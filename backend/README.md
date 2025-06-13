# Personal Insight Dashboard - Backend

FastAPI ベースのバックエンド API

## 技術スタック

- Python 3.11+
- FastAPI
- SQLAlchemy (Async)
- PostgreSQL
- JWT 認証
- OpenAI Realtime API
- WebSocket

## 開発コマンド

```bash
# 依存関係のインストール
make install

# 開発サーバー起動
make dev

# データベース初期化
make db-init

# テスト実行
make test

# Lintチェック
make lint

# コードフォーマット
make format
```

## ディレクトリ構造

```
src/app/
├── api/              # APIエンドポイント
│   ├── auth/         # 認証関連
│   ├── conversations/ # 会話管理
│   └── insights/     # インサイト分析
├── models/           # SQLAlchemyモデル
├── schemas/          # Pydanticスキーマ
├── services/         # ビジネスロジック
├── utils/            # ユーティリティ
├── config.py         # 設定
├── database.py       # DB接続
└── main.py           # エントリーポイント
```

## API ドキュメント

開発サーバー起動後、以下の URL で API ドキュメントを確認できます：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
