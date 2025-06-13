# Personal Insight Dashboard - Frontend

毎日5分のAI対話で、本当の自分を発見するパーソナルインサイトダッシュボードのフロントエンドアプリケーション。

## 技術スタック

- **Framework**: Next.js 15
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Type Safety**: TypeScript
- **API Communication**: REST API + WebSocket

## セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn
- バックエンドAPIが起動していること（http://localhost:8000）

### インストール

1. 依存関係をインストール

```bash
npm install
```

2. 環境変数を設定

`.env.local`ファイルを作成し、以下の内容を記述：

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

3. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてアプリケーションにアクセスできます。

## 主な機能

### 認証

- ユーザー登録（3日間の無料トライアル）
- ログイン/ログアウト
- JWT認証

### ダッシュボード

- 個人の統計情報表示
- 最新のインサイト
- アクティビティ履歴

### AI対話

- リアルタイム音声対話（WebSocket）
- 5分間のタイマー
- 音声録音・ミュート機能

### インサイト

- AIが生成した気づきと分析
- カテゴリ別フィルタリング
- 関連度スコア表示

### 履歴

- 過去の対話記録
- 検索・フィルタリング機能
- 感情分析結果

### 設定

- プロフィール管理
- 通知設定
- プライバシー設定
- サブスクリプション管理

## フォルダ構造

```
frontend/
├── app/                  # Next.js App Router
│   ├── (auth)/          # 認証関連ページ
│   ├── (dashboard)/     # ダッシュボード関連ページ
│   └── layout.tsx       # ルートレイアウト
├── components/          # UIコンポーネント
│   └── ui/             # shadcn/uiコンポーネント
├── lib/                 # ユーティリティ
│   ├── api/            # API関連
│   └── contexts/       # Reactコンテキスト
├── types/              # TypeScript型定義
└── public/             # 静的ファイル
```

## 開発

### コード規約

- ESLint + Prettierでコードフォーマット
- TypeScriptの厳格な型チェック
- コンポーネントは機能単位で分割

### テスト

```bash
npm test
```

### ビルド

```bash
npm run build
```

### デプロイ

Vercelへのデプロイを推奨：

```bash
vercel
```

## ライセンス

MIT

## その他

- [バックエンドAPI](../backend/README.md)
- [要件定義書](../docs/frontend-requirements.html)
