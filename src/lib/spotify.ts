import axios from 'axios';

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

interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[];
  };
}

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

class SpotifyAPI {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Spotify API credentials not configured');
    }

    try {
      const response = await axios.post<SpotifyTokenResponse>(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000; // Subtract 60 seconds for safety

      return this.accessToken;
    } catch (error) {
      console.error('Failed to get Spotify access token:', error);
      throw new Error('Failed to authenticate with Spotify API');
    }
  }

  async searchArtist(artistName: string): Promise<SpotifyArtist[]> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get<SpotifySearchResponse>(
        `https://api.spotify.com/v1/search`,
        {
          params: {
            q: artistName,
            type: 'artist',
            limit: 10,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.artists.items;
    } catch (error) {
      console.error('Failed to search artist:', error);
      throw new Error('Failed to search for artist');
    }
  }

  async getArtist(artistId: string): Promise<SpotifyArtist> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get<SpotifyArtist>(
        `https://api.spotify.com/v1/artists/${artistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to get artist:', error);
      throw new Error('Failed to get artist information');
    }
  }
}

export const spotifyAPI = new SpotifyAPI();
export type { SpotifyArtist }; 