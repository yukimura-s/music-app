# 🎵 MusicEventsFinder

アーティストのライブ・フェス検索アプリです。Spotify APIと連携してアーティスト情報を取得し、出演予定のライブやフェスティバルの情報を表示します。

## ✨ 機能

- 🔍 **アーティスト検索**: アーティスト名で検索可能
- 🎤 **Spotify連携**: アーティストの画像、ジャンル、人気度を表示
- 🎪 **イベント情報**: ライブ、フェス、ツアー情報の表示
- 📱 **レスポンシブデザイン**: モバイル・デスクトップ対応
- 🎨 **モダンUI**: Tailwind CSSによる美しいデザイン

## 🚀 技術スタック

- **Frontend**: Next.js 14 (App Router)
- **TypeScript**: 型安全な開発
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Spotify Web API
- **HTTP Client**: Axios

## 📋 セットアップ

### 1. リポジトリのクローン

\`\`\`bash
git clone <repository-url>
cd music-search-app
\`\`\`

### 2. 依存関係のインストール

\`\`\`bash
npm install
\`\`\`

### 3. Spotify API設定

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)にアクセス
2. 新しいアプリを作成
3. Client IDとClient Secretを取得
4. 環境変数ファイルを作成:

\`\`\`bash
# .env.local ファイルを作成
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
\`\`\`

### 4. 開発サーバーの起動

\`\`\`bash
npm run dev
\`\`\`

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## 🎯 使用方法

1. **アーティスト検索**: ホーム画面の検索ボックスにアーティスト名を入力
2. **結果の確認**: 
   - アーティスト情報（Spotify提供）
   - 出演予定のライブ・フェス情報
3. **詳細情報**: チケット情報リンクから公式サイトへアクセス可能

## 📂 プロジェクト構造

\`\`\`
src/
├── app/
│   ├── api/search/          # 検索API
│   ├── globals.css          # グローバルスタイル
│   ├── layout.tsx           # レイアウト
│   └── page.tsx             # メインページ
├── components/
│   ├── ArtistCard.tsx       # アーティストカード
│   └── EventCard.tsx        # イベントカード
└── lib/
    ├── events.ts            # イベントデータ管理
    └── spotify.ts           # Spotify API連携
\`\`\`

## 🔧 現在の課題と今後の改善点

### 🚨 現在の問題点
- **ライブ・フェス情報の取得**: 現在は仮のデータを使用

### 💡 解決策の提案

#### 1. イベント情報API
- **e-plus API**: チケット販売サイトのAPI
- **LiveNation API**: 海外アーティスト情報
- **Bandsintown API**: ライブ情報専門API
- **Songkick API**: 音楽イベント検索

#### 2. ウェブスクレイピング
- 各フェスティバル公式サイト
- チケット販売サイト
- 音楽メディアサイト

#### 3. データベース構築
- 手動でのイベント情報登録
- ユーザー投稿機能の追加

### 🎯 今後の機能拡張

- **お気に入り機能**: ユーザーがアーティストをお気に入り登録
- **通知機能**: 新しいライブ情報の通知
- **カレンダー連携**: イベント日程をカレンダーに追加
- **ソーシャル機能**: ユーザー間でのイベント情報共有
- **地域フィルター**: 地域別でのイベント検索
- **価格比較**: 複数のチケット販売サイトの価格比較

## 🌐 API情報

### Spotify API
- **認証**: Client Credentials Flow
- **エンドポイント**: 
  - アーティスト検索: `/v1/search`
  - アーティスト詳細: `/v1/artists/{id}`

### 検索API
- **エンドポイント**: `/api/search`
- **パラメータ**: `artist` (必須)
- **レスポンス**: アーティスト情報 + イベント情報

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📞 サポート

質問や問題がある場合は、Issueを作成してください。

---

**注意**: このアプリケーションを本格的に使用する前に、実際のライブ・フェス情報APIとの連携が必要です。現在は開発・デモ用途での使用を想定しています。
