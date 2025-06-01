import { NextRequest, NextResponse } from 'next/server';
import { eventsAPI } from '@/lib/events';

// モックのSpotifyアーティストデータ
const createMockArtist = (name: string) => ({
  id: `mock-${name.toLowerCase().replace(/\s+/g, '-')}`,
  name,
  images: [{
    url: 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(name),
    height: 300,
    width: 300
  }],
  genres: ['J-Pop', 'Pop'],
  popularity: Math.floor(Math.random() * 100),
  external_urls: {
    spotify: `https://open.spotify.com/search/${encodeURIComponent(name)}`
  }
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artistName = searchParams.get('artist');

  if (!artistName) {
    return NextResponse.json(
      { success: false, error: 'Artist name is required' },
      { status: 400 }
    );
  }

  try {
    // Spotify APIの代わりにモックデータを使用
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    let artists = [];
    let warning = undefined;

    if (!clientId) {
      // Spotify APIキーがない場合はモックデータを使用
      artists = [createMockArtist(artistName)];
      warning = 'Spotify APIキーが設定されていません。モックデータを表示しています。';
    } else {
      // Spotify APIキーがある場合は実際のAPIを試行
      try {
        const { spotifyAPI } = await import('@/lib/spotify');
        artists = await spotifyAPI.searchArtist(artistName);
      } catch (error) {
        console.error('Spotify API error:', error);
        artists = [createMockArtist(artistName)];
        warning = 'Spotify APIへの接続に失敗しました。モックデータを表示しています。';
      }
    }
    
    // ライブ・フェス情報を検索
    const events = eventsAPI.searchByArtist(artistName);

    return NextResponse.json({
      success: true,
      artists,
      events,
      warning: warning || (artists.length === 0 ? 'No artists found' : undefined)
    });
  } catch (error) {
    console.error('Search error:', error);
    
    // エラーが発生した場合もモックデータで対応
    const events = eventsAPI.searchByArtist(artistName);
    
    return NextResponse.json({
      success: true,
      artists: [createMockArtist(artistName)],
      events,
      warning: '検索中にエラーが発生しました。モックデータを表示しています。'
    });
  }
} 