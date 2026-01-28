from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class News(db.Model):
    __tablename__ = 'news'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    thumbnail = db.Column(db.String(500))  # Putanja do glavne slike
    gallery = db.Column(db.Text)  # JSON sa listom slika galerije
    video_url = db.Column(db.String(500))  # YouTube ili lokalni video
    twitter_iframe = db.Column(db.String(500))  # X/Twitter iframe URL
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<News {self.title}>'
