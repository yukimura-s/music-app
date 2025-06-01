import { useState, useEffect } from 'react';
import { SpotifyArtist } from '@/lib/spotify';
import { FavoritesManager } from '@/lib/favorites';
import { ExternalLink, Music, Users, Heart } from 'lucide-react';

interface ArtistCardProps {
  artist: SpotifyArtist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(FavoritesManager.isFavorite(artist.id));
  }, [artist.id]);

  const toggleFavorite = () => {
    if (isFavorite) {
      FavoritesManager.removeFavorite(artist.id);
      setIsFavorite(false);
    } else {
      FavoritesManager.addFavorite(artist);
      setIsFavorite(true);
    }
  };

  const getArtistImage = () => {
    if (artist.images && artist.images.length > 0) {
      // 中サイズの画像を優先、なければ最初の画像
      const mediumImage = artist.images.find(img => img.height >= 300 && img.height <= 500);
      return mediumImage?.url || artist.images[0].url;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
        {/* アーティスト画像 */}
        <div className="flex-shrink-0 relative mx-auto sm:mx-0">
          {getArtistImage() ? (
            <img
              src={getArtistImage()!}
              alt={artist.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
              <Music className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
          )}
          
          {/* お気に入りボタン */}
          <button
            onClick={toggleFavorite}
            className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white text-gray-400 border border-gray-300 hover:border-red-300 hover:text-red-400'
            }`}
            title={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
          >
            <Heart 
              className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorite ? 'fill-current' : ''}`}
            />
          </button>
        </div>

        {/* アーティスト情報 */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="mb-2 sm:mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate mb-1 sm:mb-0">
              {artist.name}
            </h2>
          </div>

          {/* ジャンル */}
          {artist.genres && artist.genres.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-center sm:justify-start mb-1">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">ジャンル</span>
              </div>
              <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                {artist.genres.slice(0, 4).map((genre, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 border border-blue-200"
                  >
                    {genre}
                  </span>
                ))}
                {artist.genres.length > 4 && (
                  <span className="text-xs text-gray-500 ml-1">
                    +{artist.genres.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Spotifyリンク */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="text-xs text-gray-500 text-center sm:text-left">
              Powered by Spotify
            </div>
            <a
              href={artist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Spotifyで開く
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 