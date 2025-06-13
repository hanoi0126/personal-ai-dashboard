import asyncio
import os
import sys

# srcディレクトリをPythonパスに追加
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from app.database import init_db


async def main():
    """データベーステーブルを作成"""
    print("Initializing database...")
    await init_db()
    print("Database initialized successfully!")


if __name__ == "__main__":
    asyncio.run(main())
