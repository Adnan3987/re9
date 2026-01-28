from models.news_model import db, News
from app import app

app.app_context().push()

# Test: kreiraj vijest sa sadržajem direktno
news = News(
    title="Test Vijest",
    content="<p>Ovo je test sadržaj sa HTML-om</p><p>Drugi paragraf</p>",
    thumbnail="/uploads/test.jpg"
)

db.session.add(news)
db.session.commit()

# Provjeri da li je spravljeno
print(f"News ID: {news.id}")
print(f"Content: {news.content}")
