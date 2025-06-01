'use client';

import { useState, useEffect } from 'react';
import { Music2, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface Artist {
  name: string;
  genre: string;
  imageUrl?: string;
  spotifyImageUrl?: string;
  alternativeNames?: string[]; // 検索用の代替名
  spotifyUrl?: string;
  imageLoaded?: boolean;
}

interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  genres: string[];
  popularity: number;
  external_urls: {
    spotify: string;
  };
}

interface ArtistSlideshowProps {
  onArtistClick: (artistName: string) => void;
}

export default function ArtistSlideshow({ onArtistClick }: ArtistSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [imageCache, setImageCache] = useState<Record<string, string>>({});

  // 初期アーティストデータ（最初は音楽アイコンのみ）
  const initialArtists: Artist[] = [
    { 
      name: 'Ado', 
      genre: 'J-Pop/Rock', 
      alternativeNames: ['うっせぇわ', 'Ado Japan'],
      imageLoaded: false
    },
    { 
      name: 'YOASOBI', 
      genre: 'J-Pop', 
      alternativeNames: ['夜に駆ける', 'YOASOBI Japan'],
      imageLoaded: false
    },
    { 
      name: 'あいみょん', 
      genre: 'J-Pop/Folk', 
      alternativeNames: ['aimyon', 'マリーゴールド'],
      imageLoaded: false
    },
    { 
      name: 'ano', 
      genre: 'Alternative Pop', 
      alternativeNames: ['ano Japan', 'ちゅ、多様性'],
      imageLoaded: false
    },
    { 
      name: 'Vaundy', 
      genre: 'Indie Rock', 
      alternativeNames: ['Vaundy Japan', 'バウンディ'],
      imageLoaded: false
    },
    { 
      name: 'King Gnu', 
      genre: 'Alternative Rock', 
      alternativeNames: ['King Gnu Japan', 'キングヌー'],
      imageLoaded: false
    },
    { 
      name: 'Mrs. GREEN APPLE', 
      genre: 'Pop Rock', 
      alternativeNames: ['ミセス', 'ミセスグリーンアップル'],
      imageLoaded: false
    },
    { 
      name: 'Official髭男dism', 
      genre: 'Pop Rock', 
      alternativeNames: ['ヒゲダン', 'Official HIGE DANdism'],
      imageLoaded: false
    },
    { 
      name: 'back number', 
      genre: 'J-Rock', 
      alternativeNames: ['back number Japan', 'バックナンバー'],
      imageLoaded: false
    },
    { 
      name: 'フジファブリック', 
      genre: 'Alternative Rock', 
      alternativeNames: ['Fujifabric', 'フジファブリック'],
      imageLoaded: false
    },
    { 
      name: 'BUMP OF CHICKEN', 
      genre: 'Alternative Rock', 
      alternativeNames: ['バンプ', 'BUMP'],
      imageLoaded: false
    },
    { 
      name: 'ONE OK ROCK', 
      genre: 'Rock', 
      alternativeNames: ['ワンオク', 'ONE OK ROCK Japan'],
      imageLoaded: false
    },
    { 
      name: 'Perfume', 
      genre: 'Electropop', 
      alternativeNames: ['パフューム', 'Perfume Japan'],
      imageLoaded: false
    },
    { 
      name: 'サカナクション', 
      genre: 'Alternative Rock', 
      alternativeNames: ['Sakanaction', 'サカナクション Japan'],
      imageLoaded: false
    },
    { 
      name: 'Aimer', 
      genre: 'J-Pop/Ballad', 
      alternativeNames: ['エメ', 'Aimer Japan'],
      imageLoaded: false
    },
    { 
      name: 'LiSA', 
      genre: 'Anime Rock', 
      alternativeNames: ['リサ', 'LiSA Japan', '紅蓮華'],
      imageLoaded: false
    },
    { 
      name: 'きゃりーぱみゅぱみゅ', 
      genre: 'J-Pop', 
      alternativeNames: ['Kyary Pamyu Pamyu', 'きゃりー'],
      imageLoaded: false
    },
    { 
      name: 'B\'z', 
      genre: 'Hard Rock', 
      alternativeNames: ['ビーズ', 'B\'z Japan'],
      imageLoaded: false
    },
    { 
      name: 'Creepy Nuts', 
      genre: 'Hip Hop', 
      alternativeNames: ['クリーピーナッツ', 'のうぜんかずら'],
      imageLoaded: false
    },
    { 
      name: '米津玄師', 
      genre: 'J-Pop/Folk', 
      alternativeNames: ['Kenshi Yonezu', 'Lemon', 'よねづけんし'],
      imageLoaded: false
    },
  ];

  // 初期化
  useEffect(() => {
    setArtists(initialArtists);
  }, []);

  // 段階的にSpotify画像を取得
  useEffect(() => {
    const fetchArtistImage = async (artist: Artist, index: number) => {
      // キャッシュから確認
      if (imageCache[artist.name]) {
        setArtists(prev => prev.map((a, i) => 
          i === index ? { 
            ...a, 
            spotifyImageUrl: imageCache[artist.name], 
            imageLoaded: true 
          } : a
        ));
        return;
      }

      try {
        // 500ms * index で段階的に取得（API負荷軽減）
        await new Promise(resolve => setTimeout(resolve, 300 * index));
        
        // 複数の検索キーワードを試行
        const searchNames = [artist.name, ...(artist.alternativeNames || [])];
        let spotifyImageUrl = null;
        let spotifyUrl: string | undefined = undefined;

        for (const searchName of searchNames) {
          try {
            const response = await fetch(`/api/search?artist=${encodeURIComponent(searchName)}`);
            const data = await response.json();
            
            if (data.success && data.artists && data.artists.length > 0) {
              const spotifyArtist: SpotifyArtist = data.artists[0];
              
              // 画像が存在する場合
              if (spotifyArtist.images && spotifyArtist.images.length > 0) {
                spotifyImageUrl = spotifyArtist.images[0].url;
                spotifyUrl = spotifyArtist.external_urls.spotify;
                break; // 成功したらループを抜ける
              }
            }
          } catch (searchError) {
            console.warn(`Search failed for ${searchName}:`, searchError);
            continue; // 次の検索名を試行
          }
        }
        
        if (spotifyImageUrl) {
          // キャッシュに保存
          setImageCache(prev => ({ ...prev, [artist.name]: spotifyImageUrl }));
          
          // アーティストデータを更新
          setArtists(prev => prev.map((a, i) => 
            i === index ? { 
              ...a, 
              spotifyImageUrl, 
              spotifyUrl,
              imageLoaded: true 
            } : a
          ));
        } else {
          // 画像が見つからない場合はロード完了としてマーク
          setArtists(prev => prev.map((a, i) => 
            i === index ? { ...a, imageLoaded: true } : a
          ));
        }
      } catch (error) {
        console.warn(`Failed to fetch Spotify image for ${artist.name}:`, error);
        // エラーの場合はプレースホルダーのままにする
        setArtists(prev => prev.map((a, i) => 
          i === index ? { ...a, imageLoaded: true } : a
        ));
      }
    };

    // 全アーティストの画像を段階的に取得
    artists.forEach((artist, index) => {
      if (!artist.imageLoaded) {
        fetchArtistImage(artist, index);
      }
    });
  }, [artists.length, imageCache]);

  // 自動スライド機能
  useEffect(() => {
    if (!isHovered && artists.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % Math.ceil(artists.length / 4));
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [isHovered, artists.length]);

  const totalSlides = Math.ceil(artists.length / 4);

  // 手動スライド操作
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  if (artists.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">アーティストを読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">おすすめ・注目アーティスト</h3>
        </div>
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* スライドショー */}
      <div
        className="overflow-hidden relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 左矢印ボタン */}
        <button
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
          disabled={totalSlides <= 1}
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* 右矢印ボタン */}
        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
          disabled={totalSlides <= 1}
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* スライドコンテンツ */}
        <div className="px-12">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {artists.slice(slideIndex * 4, (slideIndex + 1) * 4).map((artist, index) => (
                    <div
                      key={`${slideIndex}-${index}`}
                      onClick={() => onArtistClick(artist.name)}
                      className="group relative bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-102"
                    >
                      {/* アーティスト画像 */}
                      <div className="relative mb-3">
                        {/* Spotify画像がある場合のみ画像を表示 */}
                        {artist.spotifyImageUrl ? (
                          <>
                            <img
                              src={artist.spotifyImageUrl}
                              alt={artist.name}
                              className="w-full aspect-square rounded-lg object-cover bg-gray-200 transition-all duration-300 opacity-100 ring-2 ring-green-200"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.parentNode?.querySelector('.fallback-icon') as HTMLDivElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            {/* 画像エラー時のフォールバック */}
                            <div 
                              className="fallback-icon w-full aspect-square rounded-lg bg-gradient-to-br from-indigo-100 to-purple-200 items-center justify-center absolute top-0 left-0"
                              style={{ display: 'none' }}
                            >
                              <Music2 className="w-8 h-8 text-indigo-600" />
                            </div>
                          </>
                        ) : (
                          /* デフォルトの音楽アイコン */
                          <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center">
                            <Music2 className="w-8 h-8 text-indigo-600" />
                          </div>
                        )}
                      </div>

                      {/* アーティスト情報 */}
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                          {artist.name}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">{artist.genre}</p>
                        {/* Spotify画像ロード状態表示 */}
                        {!artist.imageLoaded && (
                          <div className="flex items-center justify-center mt-1">
                            <div className="w-3 h-3 border border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 