from models.news_model import db, News
from app import app

app.app_context().push()
news = News.query.all()

if not news:
    print("No news in database")
else:
    for n in news:
        print(f"ID: {n.id}")
        print(f"Title: {n.title}")
        print(f"Content: {n.content}")
        print(f"Thumbnail: {n.thumbnail}")
        print(f"Video URL: {n.video_url}")
        print("-" * 50)
