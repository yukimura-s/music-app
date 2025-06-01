export function ArtistCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 animate-skeleton">
      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
        {/* アーティスト画像 skeleton */}
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-300"></div>
        </div>

        {/* アーティスト情報 skeleton */}
        <div className="flex-1 min-w-0 space-y-3 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="h-6 sm:h-8 bg-gray-300 rounded w-40 sm:w-48 mx-auto sm:mx-0"></div>
            <div className="h-5 w-5 bg-gray-300 rounded mx-auto sm:mx-0"></div>
          </div>
          
          <div className="h-4 bg-gray-300 rounded w-32 sm:w-40 mx-auto sm:mx-0"></div>
          
          <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
            <div className="h-6 bg-gray-300 rounded-full w-16"></div>
            <div className="h-6 bg-gray-300 rounded-full w-20"></div>
            <div className="h-6 bg-gray-300 rounded-full w-14"></div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-9 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 animate-skeleton">
      <div className="space-y-4">
        {/* ヘッダー部分 */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
          <div className="space-y-2">
            <div className="h-6 sm:h-7 bg-gray-300 rounded w-48 sm:w-64"></div>
            <div className="h-5 bg-gray-300 rounded-full w-16 sm:w-20"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-24 sm:w-32"></div>
        </div>

        {/* 詳細情報 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-32 sm:w-40"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-28 sm:w-36"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-20 sm:w-28"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-16 sm:w-24"></div>
          </div>
        </div>

        {/* アーティスト一覧 */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          <div className="flex flex-wrap gap-1">
            <div className="h-6 bg-gray-300 rounded-full w-12"></div>
            <div className="h-6 bg-gray-300 rounded-full w-16"></div>
            <div className="h-6 bg-gray-300 rounded-full w-14"></div>
          </div>
        </div>

        {/* ボタン */}
        <div className="h-10 bg-gray-300 rounded w-full sm:w-32"></div>
      </div>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* アーティスト情報 skeleton */}
      <div className="space-y-4">
        <div className="h-6 sm:h-7 bg-gray-300 rounded w-32 sm:w-40"></div>
        <ArtistCardSkeleton />
      </div>
      
      {/* イベント一覧 skeleton */}
      <div className="space-y-4 sm:space-y-6">
        <div className="h-6 sm:h-7 bg-gray-300 rounded w-40 sm:w-48"></div>
        <div className="grid gap-4 sm:gap-6">
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      </div>
    </div>
  );
} 