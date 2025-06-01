import { SpotifyArtist } from './spotify';

const FAVORITES_KEY = 'music-app-favorites';

export interface FavoriteArtist {
  id: string;
  name: string;
  imageUrl?: string;
  addedAt: string;
}

export class FavoritesManager {
  // お気に入りアーティストを全て取得
  static getFavorites(): FavoriteArtist[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load favorites:', error);
      return [];
    }
  }

  // アーティストをお気に入りに追加
  static addFavorite(artist: SpotifyArtist): void {
    if (typeof window === 'undefined') return;

    try {
      const favorites = this.getFavorites();
      const favoriteArtist: FavoriteArtist = {
        id: artist.id,
        name: artist.name,
        imageUrl: artist.images?.[0]?.url,
        addedAt: new Date().toISOString(),
      };

      // 既に存在する場合は追加しない
      if (!favorites.some(fav => fav.id === artist.id)) {
        favorites.unshift(favoriteArtist); // 新しいものを先頭に
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  }

  // アーティストをお気に入りから削除
  static removeFavorite(artistId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const favorites = this.getFavorites();
      const updated = favorites.filter(fav => fav.id !== artistId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  }

  // アーティストがお気に入りかどうかチェック
  static isFavorite(artistId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.id === artistId);
  }

  // お気に入りの数を取得
  static getFavoritesCount(): number {
    return this.getFavorites().length;
  }

  // お気に入りをクリア
  static clearFavorites(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(FAVORITES_KEY);
    } catch (error) {
      console.error('Failed to clear favorites:', error);
    }
  }
} 