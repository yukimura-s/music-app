import { SpotifyArtist } from './spotify';
import { Event, getMockEvents } from './events';

// 実際のライブ情報APIサービス
interface BandsinTownEvent {
  id: string;
  datetime: string;
  venue: {
    name: string;
    city: string;
    region: string;
    country: string;
  };
  description?: string;
  offers?: Array<{
    url: string;
    type: string;
  }>;
}

export class EventService {
  private static readonly BANDSINTOWN_BASE_URL = 'https://rest.bandsintown.com';
  private static readonly APP_ID = 'music-events-finder';

  // Bandsintown APIからイベントを取得
  static async fetchBandsinTownEvents(artistName: string): Promise<Event[]> {
    try {
      const response = await fetch(
        `${this.BANDSINTOWN_BASE_URL}/artists/${encodeURIComponent(artistName)}/events?app_id=${this.APP_ID}&date=upcoming`
      );

      if (!response.ok) {
        // 404の場合は空の配列を返す
        if (response.status === 404) {
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const events: BandsinTownEvent[] = await response.json();
      
      return events.map(event => this.convertBandsinTownEvent(event, artistName));
    } catch (error) {
      console.warn(`Bandsintown API failed for ${artistName}:`, error);
      return [];
    }
  }

  // Bandsintown形式から我々のEvent形式に変換
  private static convertBandsinTownEvent(btEvent: BandsinTownEvent, artistName: string): Event {
    const date = new Date(btEvent.datetime).toISOString().split('T')[0];
    const location = [btEvent.venue.city, btEvent.venue.region, btEvent.venue.country]
      .filter(Boolean)
      .join(', ');

    return {
      id: `bt-${btEvent.id}`,
      title: `${artistName} Live`,
      type: 'live',
      date: date,
      venue: btEvent.venue.name,
      location: location,
      artists: [artistName],
      description: btEvent.description || `${artistName}のライブ`,
      ticketUrl: btEvent.offers?.[0]?.url,
    };
  }

  // 複数のソースからイベントを取得してマージ
  static async searchEvents(artist: SpotifyArtist): Promise<Event[]> {
    const artistName = artist.name;
    
    try {
      // 並行してリアルAPIとモックデータの両方を取得
      const [realEvents, mockEvents] = await Promise.all([
        this.fetchBandsinTownEvents(artistName),
        Promise.resolve(getMockEvents(artistName))
      ]);

      // リアルイベントが見つかった場合はそれを優先
      if (realEvents.length > 0) {
        console.log(`Found ${realEvents.length} real events for ${artistName}`);
        return realEvents;
      }

      // リアルイベントがない場合はモックデータを返す
      if (mockEvents.length > 0) {
        console.log(`Using mock events for ${artistName}`);
        return mockEvents;
      }

      return [];
    } catch (error) {
      console.error(`Event search failed for ${artistName}:`, error);
      // エラーが発生した場合はモックデータにフォールバック
      return getMockEvents(artistName);
    }
  }

  // 地域フィルタリング機能
  static filterEventsByLocation(events: Event[], targetLocation?: string): Event[] {
    if (!targetLocation) return events;
    
    const target = targetLocation.toLowerCase();
    return events.filter(event => 
      event.location.toLowerCase().includes(target) ||
      event.venue.toLowerCase().includes(target)
    );
  }

  // 日付範囲フィルタリング機能
  static filterEventsByDateRange(events: Event[], startDate?: string, endDate?: string): Event[] {
    return events.filter(event => {
      const eventDate = event.date;
      
      if (startDate && eventDate < startDate) return false;
      if (endDate && eventDate > endDate) return false;
      
      return true;
    });
  }

  // 今後のイベントのみフィルタリング
  static filterUpcomingEvents(events: Event[]): Event[] {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.date >= today);
  }
} 