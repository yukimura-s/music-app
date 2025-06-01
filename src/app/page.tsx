'use client';

import { useState, useEffect } from 'react';
import { Search, Music, Calendar, AlertCircle, Heart, User, LogOut } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import EventCard from '@/components/EventCard';
import ArtistCard from '@/components/ArtistCard';
import ArtistSlideshow from '@/components/ArtistSlideshow';
import { SearchResultsSkeleton } from '@/components/LoadingSkeleton';
import { FavoritesManager } from '@/lib/favorites';
import { Event } from '@/lib/events';
import { EventService } from '@/lib/eventService';
import { SpotifyArtist } from '@/lib/spotify';

interface SearchResult {
  artist: SpotifyArtist | null;
  events: Event[];
  allArtists: SpotifyArtist[];
  warning?: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // お気に入り数の更新
  useEffect(() => {
    const updateFavoritesCount = () => {
      setFavoritesCount(FavoritesManager.getFavorites().length);
    };

    updateFavoritesCount();
    
    // カスタムイベントリスナーでお気に入りの変更を監視
    const handleFavoritesChange = () => updateFavoritesCount();
    window.addEventListener('favoritesChanged', handleFavoritesChange);
    
    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
    };
  }, []);

  const searchArtistAndEvents = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setSearchResult(null);

    try {
      // Spotify検索
      const spotifyResponse = await fetch(`/api/search?artist=${encodeURIComponent(searchQuery)}`);
      const spotifyData = await spotifyResponse.json();

      if (!spotifyData.success) {
        throw new Error(spotifyData.error || 'Spotify search failed');
      }

      const artists = spotifyData.artists;
      if (!artists || artists.length === 0) {
        setSearchResult({
          artist: null,
          events: [],
          allArtists: [],
          warning: `"${searchQuery}" に関連するアーティストが見つかりませんでした。`
        });
        return;
      }

      const mainArtist = artists[0];
      
      // 実際のライブ情報を取得（EventServiceを使用）
      const events = await EventService.searchEvents(mainArtist);
      
      setSearchResult({
        artist: mainArtist,
        events: EventService.filterUpcomingEvents(events), // 今後のイベントのみ
        allArtists: artists,
        warning: events.length === 0 ? `${mainArtist.name}のライブ情報が見つかりませんでした。` : undefined
      });

    } catch (error) {
      console.error('Search error:', error);
      setSearchResult({
        artist: null,
        events: [],
        allArtists: [],
        warning: '検索中にエラーが発生しました。しばらく時間をおいて再度お試しください。'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // スライドショーからアーティストをクリックした時の処理
  const handleArtistClick = (artistName: string) => {
    setSearchQuery(artistName);
    // 検索を実行
    setIsLoading(true);
    setSearchResult(null);
    
    setTimeout(async () => {
      try {
        const spotifyResponse = await fetch(`/api/search?artist=${encodeURIComponent(artistName)}`);
        const spotifyData = await spotifyResponse.json();

        if (spotifyData.success && spotifyData.artists && spotifyData.artists.length > 0) {
          const mainArtist = spotifyData.artists[0];
          const events = await EventService.searchEvents(mainArtist);
          
          setSearchResult({
            artist: mainArtist,
            events: EventService.filterUpcomingEvents(events),
            allArtists: spotifyData.artists,
            warning: events.length === 0 ? `${mainArtist.name}のライブ情報が見つかりませんでした。` : undefined
          });
        }
      } catch (error) {
        console.error('Artist click search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchArtistAndEvents();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 justify-center sm:justify-start">
              <Music className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                <span className="sm:hidden">Music</span>
                <span className="hidden sm:inline">MusicEventsFinder</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-4 justify-center sm:justify-end">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Heart className="w-4 h-4 text-red-500" />
                <span>お気に入り: {favoritesCount}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-green-500" />
                <span className="hidden sm:inline">ライブ情報検索</span>
                <span className="sm:hidden">検索</span>
              </div>
              
              {/* ログイン/ログアウトボタン */}
              <div className="flex items-center">
                {status === 'loading' ? (
                  <div className="text-sm text-gray-500">読み込み中...</div>
                ) : session ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-700">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">{session.user?.name || session.user?.email}</span>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">ログアウト</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => signIn()}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>ログイン</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* 検索セクション */}
        <div className="text-center mb-8 sm:mb-12 space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              お気に入りアーティストの
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl text-blue-600 font-semibold">
              ライブ情報を見つけよう🎵
            </p>
          </div>
          
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            アーティスト名を入力して、最新のライブ・フェス情報をリアルタイムで検索できます
          </p>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="アーティスト名を入力 (例: Ado, YOASOBI, あいみょん)"
                  className="w-full pl-10 pr-4 py-3 sm:py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-base whitespace-nowrap"
              >
                {isLoading ? '検索中...' : '検索'}
              </button>
            </div>
          </form>
        </div>

        {/* アーティストスライドショー */}
        <div className="mb-8 sm:mb-12 animate-fade-in animation-delay-200">
          <ArtistSlideshow onArtistClick={handleArtistClick} />
        </div>

        {/* 検索結果 */}
        {isLoading && (
          <div className="animate-fade-in">
            <SearchResultsSkeleton />
          </div>
        )}

        {searchResult && !isLoading && (
          <div className="space-y-6 sm:space-y-8">
            {/* 警告メッセージ */}
            {searchResult.warning && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-800 text-sm sm:text-base">{searchResult.warning}</p>
              </div>
            )}

            {/* アーティスト情報 */}
            {searchResult.artist && (
              <div className="animate-fade-in animation-delay-100">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Music className="w-5 h-5 text-blue-600" />
                  <span>アーティスト情報</span>
                </h3>
                <ArtistCard artist={searchResult.artist} />
              </div>
            )}

            {/* イベント一覧 */}
            {searchResult.events.length > 0 && (
              <div className="animate-fade-in animation-delay-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span>ライブ・イベント情報</span>
                  <span className="text-sm font-normal text-gray-500">
                    ({searchResult.events.length}件)
                  </span>
                </h3>
                <div className="grid gap-4 sm:gap-6">
                  {searchResult.events.map((event, index) => (
                    <div 
                      key={event.id} 
                      className={index < 3 ? "animate-fade-in" : ""}
                      style={index < 3 ? { animationDelay: `${250 + index * 50}ms` } : {}}
                    >
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 関連アーティスト */}
            {searchResult.allArtists.length > 1 && (
              <div className="animate-fade-in animation-delay-300">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Music className="w-5 h-5 text-purple-600" />
                  <span>関連アーティスト</span>
                </h3>
                <div className="grid gap-4 sm:gap-6">
                  {searchResult.allArtists.slice(1, 4).map((artist, index) => (
                    <div 
                      key={artist.id} 
                      className={index < 2 ? "animate-fade-in" : ""}
                      style={index < 2 ? { animationDelay: `${350 + index * 50}ms` } : {}}
                    >
                      <ArtistCard artist={artist} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 初期状態のサンプル検索 */}
        {!searchResult && !isLoading && (
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sm:p-8 max-w-2xl mx-auto">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                🎵 アーティストを発見しよう
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                上記のアーティストカードをクリックするか、検索バーでお気に入りのアーティストを見つけてください
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
