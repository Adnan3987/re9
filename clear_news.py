from models.news_model import db, News
from app import app

app.app_context().push()

# Delete all news
News.query.delete()
db.session.commit()

print("All news deleted. Database is clean.")

