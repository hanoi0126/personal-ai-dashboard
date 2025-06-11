.PHONY: lint # uv linter
lint:
	uv run ruff check --fix .
	uv run ruff format --check .
	uv run mypy . --explicit-package-bases