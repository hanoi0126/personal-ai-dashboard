.PHONY: help install dev dev-backend dev-frontend build test lint format clean setup

help: ## ヘルプを表示
	@echo "Personal Insight Dashboard - 開発コマンド"
	@echo ""
	@echo "使用可能なコマンド:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## 全ての依存関係をインストール
	@echo "📦 バックエンドの依存関係をインストール中..."
	cd backend && uv sync
	@echo "📦 フロントエンドの依存関係をインストール中..."
	cd frontend && npm install

dev: ## フロントエンドとバックエンドを同時に起動
	@echo "🚀 開発サーバーを起動中..."
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:3000"
	@echo "API Docs: http://localhost:8000/docs"
	@make -j 2 dev-backend dev-frontend

dev-backend: ## バックエンドのみ起動
	cd backend && uv run python run_dev.py

dev-frontend: ## フロントエンドのみ起動
	cd frontend && npm run dev

build: ## プロダクションビルド
	@echo "🔨 フロントエンドをビルド中..."
	cd frontend && npm run build

test: ## 全てのテストを実行
	@echo "🧪 バックエンドのテストを実行中..."
	cd backend && uv run pytest
	@echo "🧪 フロントエンドのテストを実行中..."
	cd frontend && npm test

lint: ## 全てのLintチェックを実行
	@echo "🔍 バックエンドのLintチェック..."
	cd backend && uv run ruff check --fix .
	@echo "🔍 フロントエンドのLintチェック..."
	cd frontend && npm run lint

format: ## 全てのコードをフォーマット
	@echo "✨ バックエンドのコードフォーマット..."
	cd backend && uv run ruff format --check .
	@echo "✨ フロントエンドのコードフォーマット..."
	cd frontend && npm run format

clean: ## キャッシュとビルドファイルを削除
	@echo "🧹 クリーンアップ中..."
	cd backend && make clean
	cd frontend && rm -rf .next node_modules

setup: ## 初期セットアップ
	@echo "🔧 初期セットアップを開始..."
	@echo "1. 依存関係をインストール..."
	@make install
	@echo ""
	@echo "2. 環境変数ファイルを作成してください:"
	@echo "   - backend/.env (backend/.env.exampleを参考に)"
	@echo "   - frontend/.env.local (frontend/.env.local.exampleを参考に)"
	@echo ""
	@echo "3. PostgreSQLデータベースをセットアップしてください"
	@echo ""
	@echo "4. データベースを初期化:"
	@echo "   cd backend && make db-init"
	@echo ""
	@echo "5. 開発サーバーを起動:"
	@echo "   make dev"

# デフォルトタスク
.DEFAULT_GOAL := help