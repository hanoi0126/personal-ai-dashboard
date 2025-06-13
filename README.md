# Personal Insight Dashboard 🎯

AI と音声対話で日々の振り返りをサポートする個人向けダッシュボード

## 🌟 概要

Personal Insight Dashboard は、OpenAI Realtime API を活用して、毎日 5 分間の AI コーチとの音声対話を通じて、あなたの思考や感情を整理し、成長をサポートする Web アプリケーションです。

### 主な機能

- 🎙️ **リアルタイム音声対話**: AI コーチと自然な会話で 1 日を振り返る
- 📊 **感情分析**: 会話から感情の推移を可視化
- 🔍 **キーワード抽出**: 頻出トピックや関心事を自動抽出
- 📈 **成長トラッキング**: 日次・週次でのインサイトレポート
- 🔒 **プライバシー重視**: データは個人のみアクセス可能

## 🛠️ 技術スタック

### バックエンド

- **言語**: Python 3.11+
- **フレームワーク**: FastAPI
- **データベース**: PostgreSQL + SQLAlchemy
- **認証**: JWT
- **AI**: OpenAI Realtime API

### フロントエンド

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks
- **グラフ**: Recharts

## 📋 必要な環境

- Python 3.11 以上
- Node.js 18 以上
- PostgreSQL 14 以上
- OpenAI API キー

## 🚀 セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/personal-ai-dashboard.git
cd personal-ai-dashboard
```

### 2. 初期セットアップ

```bash
make setup
```

### 3. 環境変数の設定

#### backend/.env

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost/personal_insight_db
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
```

#### frontend/.env.local

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your-openai-api-key
```

### 4. データベースの初期化

```bash
cd backend
make db-init
```

### 5. 開発サーバーの起動

```bash
# プロジェクトルートで実行
make dev
```

- バックエンド: http://localhost:8000
- フロントエンド: http://localhost:3000
- API ドキュメント: http://localhost:8000/docs

## 📝 使用可能なコマンド

### プロジェクトルート

| コマンド       | 説明                         |
| -------------- | ---------------------------- |
| `make help`    | ヘルプを表示                 |
| `make install` | 全ての依存関係をインストール |
| `make dev`     | 開発サーバーを起動           |
| `make build`   | プロダクションビルド         |
| `make test`    | テストを実行                 |
| `make lint`    | Lint チェック                |
| `make format`  | コードフォーマット           |
| `make clean`   | キャッシュをクリア           |

### バックエンド専用

```bash
cd backend
make dev        # 開発サーバー起動
make test       # テスト実行
make lint       # Lintチェック
make format     # コードフォーマット
make db-init    # DB初期化
```

### フロントエンド専用

```bash
cd frontend
npm run dev     # 開発サーバー起動
npm run build   # ビルド
npm run lint    # Lintチェック
npm run format  # コードフォーマット
```

## 🏗️ プロジェクト構造

```
personal-ai-dashboard/
├── backend/              # FastAPIバックエンド
│   ├── src/
│   │   └── app/
│   │       ├── api/      # APIエンドポイント
│   │       ├── models/   # SQLAlchemyモデル
│   │       ├── schemas/  # Pydanticスキーマ
│   │       └── services/ # ビジネスロジック
│   └── pyproject.toml
├── frontend/             # Next.jsフロントエンド
│   ├── app/              # App Router
│   ├── components/       # Reactコンポーネント
│   ├── lib/              # ユーティリティ
│   └── types/            # TypeScript型定義
└── makefile              # 開発コマンド
```

## 🔐 API エンドポイント

- `POST /api/auth/signup` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `GET /api/auth/me` - ユーザー情報取得
- `POST /api/conversations/start` - 会話開始
- `GET /api/conversations` - 会話履歴
- `GET /api/insights/daily` - 日次インサイト
- `GET /api/insights/weekly` - 週次インサイト
- `WS /ws/conversation/{token}` - リアルタイム会話

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストは歓迎します！大きな変更の場合は、まず issue を作成して変更内容を議論してください。
