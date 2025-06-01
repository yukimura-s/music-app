export interface Event {
  id: string;
  title: string;
  type: 'festival' | 'live' | 'tour';
  date: string;
  venue: string;
  location: string;
  artists: string[];
  description?: string;
  image?: string;
  ticketUrl?: string;
  price?: {
    min: number;
    max: number;
    currency: string;
  };
}

// 最新のイベントデータ（2025年以降）
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'ROCK IN JAPAN FESTIVAL 2025',
    type: 'festival',
    date: '2025-08-09',
    venue: '国営ひたち海浜公園',
    location: '茨城県ひたちなか市',
    artists: ['Ado', 'YOASOBI', 'あいみょん', 'King Gnu', 'Mrs. GREEN APPLE'],
    description: '日本最大級のロックフェスティバル2025年開催',
    ticketUrl: 'https://rijfes.jp/',
    price: {
      min: 13500,
      max: 16500,
      currency: 'JPY'
    }
  },
  {
    id: '2',
    title: 'Ado TOUR 2025 "新章"',
    type: 'tour',
    date: '2025-07-15',
    venue: '東京ドーム',
    location: '東京都文京区',
    artists: ['Ado'],
    description: 'Adoの最新アルバムツアー東京公演',
    ticketUrl: 'https://ado-official.com/',
    price: {
      min: 9000,
      max: 13500,
      currency: 'JPY'
    }
  },
  {
    id: '3',
    title: 'SUMMER SONIC 2025',
    type: 'festival',
    date: '2025-08-16',
    venue: 'ZOZOマリンスタジアム',
    location: '千葉県千葉市',
    artists: ['Ado', 'YOASOBI', 'ano', 'Vaundy', 'Official髭男dism'],
    description: '2025年都市型音楽フェスティバル',
    ticketUrl: 'https://summersonic.com/',
    price: {
      min: 15000,
      max: 19000,
      currency: 'JPY'
    }
  },
  {
    id: '4',
    title: 'FUJI ROCK FESTIVAL 2025',
    type: 'festival',
    date: '2025-07-25',
    venue: '苗場スキー場',
    location: '新潟県湯沢町',
    artists: ['ONE OK ROCK', 'あいみょん', 'back number', 'フジファブリック'],
    description: '緑に囲まれた山間のフェスティバル30周年記念',
    ticketUrl: 'https://fujirock-eng.com/',
    price: {
      min: 17000,
      max: 21000,
      currency: 'JPY'
    }
  },
  {
    id: '5',
    title: 'あいみょん TOUR 2025 "心の声"',
    type: 'live',
    date: '2025-09-20',
    venue: '横浜アリーナ',
    location: '神奈川県横浜市',
    artists: ['あいみょん'],
    description: 'あいみょんの全国ツアー2025横浜公演',
    ticketUrl: 'https://aimyon.com/',
    price: {
      min: 7500,
      max: 9500,
      currency: 'JPY'
    }
  },
  {
    id: '6',
    title: 'Ado LIVE 2025 at Saitama Super Arena',
    type: 'live',
    date: '2025-10-14',
    venue: 'さいたまスーパーアリーナ',
    location: '埼玉県さいたま市',
    artists: ['Ado'],
    description: 'Ado 最新ライブ さいたまスーパーアリーナ公演',
    ticketUrl: 'https://ado-official.com/',
    price: {
      min: 8500,
      max: 12000,
      currency: 'JPY'
    }
  },
  {
    id: '7',
    title: 'COUNTDOWN JAPAN 25/26',
    type: 'festival',
    date: '2025-12-29',
    venue: '幕張メッセ',
    location: '千葉県千葉市',
    artists: ['YOASOBI', 'King Gnu', 'Mrs. GREEN APPLE', 'Vaundy', 'ano'],
    description: '年末恒例のカウントダウンフェスティバル',
    ticketUrl: 'https://countdownjapan.jp/',
    price: {
      min: 12000,
      max: 15000,
      currency: 'JPY'
    }
  },
  {
    id: '8',
    title: 'ONE OK ROCK WORLD TOUR 2025',
    type: 'tour',
    date: '2025-06-28',
    venue: '東京ドーム',
    location: '東京都文京区',
    artists: ['ONE OK ROCK'],
    description: 'ONE OK ROCK ワールドツアー東京ドーム公演',
    ticketUrl: 'https://oneokrock.com/',
    price: {
      min: 9500,
      max: 14000,
      currency: 'JPY'
    }
  },
  {
    id: '9',
    title: 'YOASOBI ARENA TOUR 2025',
    type: 'tour',
    date: '2025-08-05',
    venue: '大阪城ホール',
    location: '大阪府大阪市',
    artists: ['YOASOBI'],
    description: 'YOASOBIアリーナツアー大阪公演',
    ticketUrl: 'https://yoasobi-music.jp/',
    price: {
      min: 8000,
      max: 11000,
      currency: 'JPY'
    }
  },
  {
    id: '10',
    title: 'RISING SUN ROCK FESTIVAL 2025',
    type: 'festival',
    date: '2025-08-15',
    venue: '石狩湾新港樽川ふ頭横野外特設ステージ',
    location: '北海道小樽市',
    artists: ['ONE OK ROCK', 'back number', 'サチモス', 'フジファブリック'],
    description: '北海道の大自然で開催される音楽フェスティバル',
    ticketUrl: 'https://rsr.wess.co.jp/',
    price: {
      min: 14000,
      max: 18000,
      currency: 'JPY'
    }
  }
];

export class EventsAPI {
  // アーティスト名で検索
  searchByArtist(artistName: string): Event[] {
    const normalizedSearch = artistName.toLowerCase().trim();
    return mockEvents.filter(event =>
      event.artists.some(artist =>
        artist.toLowerCase().includes(normalizedSearch)
      )
    );
  }

  // イベントタイプで検索
  searchByType(type: Event['type']): Event[] {
    return mockEvents.filter(event => event.type === type);
  }

  // 日付範囲で検索
  searchByDateRange(startDate: string, endDate: string): Event[] {
    return mockEvents.filter(event =>
      event.date >= startDate && event.date <= endDate
    );
  }

  // 地域で検索
  searchByLocation(location: string): Event[] {
    const normalizedLocation = location.toLowerCase().trim();
    return mockEvents.filter(event =>
      event.location.toLowerCase().includes(normalizedLocation) ||
      event.venue.toLowerCase().includes(normalizedLocation)
    );
  }

  // 今後のイベントを取得
  getUpcomingEvents(): Event[] {
    const today = new Date().toISOString().split('T')[0];
    return mockEvents.filter(event => event.date >= today);
  }

  // 全イベントを取得
  getAllEvents(): Event[] {
    return [...mockEvents];
  }

  // IDでイベント取得
  getEventById(id: string): Event | undefined {
    return mockEvents.find(event => event.id === id);
  }

  // 複合検索
  search(params: {
    artist?: string;
    type?: Event['type'];
    location?: string;
    startDate?: string;
    endDate?: string;
  }): Event[] {
    let results = [...mockEvents];

    if (params.artist) {
      results = this.searchByArtist(params.artist);
    }

    if (params.type) {
      results = results.filter(event => event.type === params.type);
    }

    if (params.location) {
      const normalizedLocation = params.location.toLowerCase().trim();
      results = results.filter(event =>
        event.location.toLowerCase().includes(normalizedLocation) ||
        event.venue.toLowerCase().includes(normalizedLocation)
      );
    }

    if (params.startDate) {
      results = results.filter(event => event.date >= params.startDate!);
    }

    if (params.endDate) {
      results = results.filter(event => event.date <= params.endDate!);
    }

    return results;
  }
}

// 便利関数：アーティスト名でモックイベントを取得
export function getMockEvents(artistName: string): Event[] {
  const eventsAPI = new EventsAPI();
  return eventsAPI.searchByArtist(artistName);
}

export const eventsAPI = new EventsAPI(); 