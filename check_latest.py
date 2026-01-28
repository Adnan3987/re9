from models.news_model import db, News
from app import app

app.app_context().push()

# Get latest news
news = News.query.order_by(News.created_at.desc()).first()

if news:
    print(f"ID: {news.id}")
    print(f"Title: {news.title}")
    print(f"Content exists: {news.content is not None and len(news.content) > 0}")
    print(f"Content length: {len(news.content) if news.content else 0}")
    if news.content:
        print(f"Content preview: {news.content[:200]}")
    else:
        print("CONTENT IS EMPTY OR NULL!")
else:
    print("No news found")
