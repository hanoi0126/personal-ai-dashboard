.PHONY: help install dev test format lint type-check db-init db-migrate clean

help: ## ヘルプを表示
	@echo "使用可能なコマンド:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## 依存関係をインストール
	uv sync

dev: ## 開発サーバーを起動
	uv run python run_dev.py

test: ## テストを実行
	uv run pytest

format: ## コードをフォーマット
	uv run ruff format .
	uv run ruff check --fix .

lint: ## Lintチェックを実行
	uv run ruff check --fix .
	uv run ruff format --check .

type-check: ## 型チェックを実行
	uv run mypy .

db-init: ## データベースを初期化
	uv run python init_db.py

db-migrate: ## データベースマイグレーション（将来の実装用）
	@echo "データベースマイグレーション機能は今後実装予定です"

clean: ## キャッシュファイルを削除
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	find . -type d -name ".ruff_cache" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

# デフォルトタスク
.DEFAULT_GOAL := help