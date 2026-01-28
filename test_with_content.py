from models.news_model import db, News
from app import app
import json

app.app_context().push()

# Create a test news with content
news = News(
    title="Test Vijest Sa Tekstom",
    content="<p><strong>Ovo je boldan tekst</strong></p><p>Ovo je normalan tekst sa više paragrafa.</p><p>Treći paragraf sa sadržajem.</p>",
    thumbnail="/uploads/news/test.jpg",
    gallery=json.dumps(["/uploads/news/img1.jpg", "/uploads/news/img2.jpg"]),
    video_url="https://www.youtube.com/watch?v=test",
    twitter_iframe="https://twitter.com/test"
)

db.session.add(news)
db.session.commit()

print(f"Test news created with ID: {news.id}")
print(f"Title: {news.title}")
print(f"Content saved: {news.content}")

# Now retrieve it to verify
retrieved = News.query.get(news.id)
print(f"\nRetrieved from DB:")
print(f"Title: {retrieved.title}")
print(f"Content: {retrieved.content}")
print(f"Content length: {len(retrieved.content)}")
