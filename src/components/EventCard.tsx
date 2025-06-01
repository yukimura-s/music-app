import { Event } from '@/lib/events';
import { Calendar, MapPin, Music, ExternalLink, Ticket } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatPrice = (price: Event['price']) => {
    if (!price) return null;
    if (price.min === price.max) {
      return `¥${price.min.toLocaleString()}`;
    }
    return `¥${price.min.toLocaleString()} - ¥${price.max.toLocaleString()}`;
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'festival':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'live':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'tour':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeLabel = (type: Event['type']) => {
    switch (type) {
      case 'festival':
        return 'フェス';
      case 'live':
        return 'ライブ';
      case 'tour':
        return 'ツアー';
      default:
        return type;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-shadow duration-200">
      {/* イベントタイプとタイトル */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
              <Music className="w-3 h-3 mr-1" />
              {getEventTypeLabel(event.type)}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">{event.title}</h3>
        </div>
      </div>

      {/* 日時 */}
      <div className="flex items-center text-gray-600 mb-3">
        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="text-sm sm:text-base">{formatDate(event.date)}</span>
      </div>

      {/* 会場・場所 */}
      <div className="flex items-start text-gray-600 mb-3">
        <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
        <span className="text-sm sm:text-base leading-relaxed">{event.venue} ({event.location})</span>
      </div>

      {/* 出演アーティスト */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">出演アーティスト</h4>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {event.artists.map((artist, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 sm:px-3 rounded-full text-xs bg-gray-100 text-gray-700 border"
            >
              {artist}
            </span>
          ))}
        </div>
      </div>

      {/* 説明 */}
      {event.description && (
        <p className="text-gray-600 text-xs mb-4 leading-relaxed">{event.description}</p>
      )}

      {/* 価格とチケット情報 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 sm:pt-4 border-t border-gray-100">
        <div className="text-sm order-2 sm:order-1">
          {event.price && (
            <div className="flex items-center text-gray-600">
              <Ticket className="w-4 h-4 mr-1" />
              <span className="text-sm sm:text-base font-medium">{formatPrice(event.price)}</span>
            </div>
          )}
        </div>
        
        {event.ticketUrl && (
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-3 py-2 sm:px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 order-1 sm:order-2"
          >
            チケット情報
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
          </a>
        )}
      </div>
    </div>
  );
} 