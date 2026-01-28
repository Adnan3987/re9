#!/usr/bin/env python
"""
Script za čišćenje starih vijesti - uklanja HTML tagove iz postojećih vijesti
"""
import re
import html
from app import app
from models.news_model import db, News

def strip_html_tags(text):
    """Očisti HTML tagove i entity iz teksta"""
    if not text:
        return ''
    
    # Ukloni HTML tagove
    text = re.sub(r'<[^>]+>', '', text)
    
    # Dekoduj HTML entity
    text = html.unescape(text)
    
    # Očisti razmake
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def clean_all_news():
    """Očisti sve vijesti od HTML tagova"""
    with app.app_context():
        all_news = News.query.all()
        
        if not all_news:
            print("❌ Nema vijesti za čišćenje!")
            return
        
        print(f"✅ Počinjem čišćenje {len(all_news)} vijesti...\n")
        
        for news in all_news:
            if news.content:
                old_content = news.content
                new_content = strip_html_tags(old_content)
                
                # Proveri da li se nešto promenilo
                if old_content != new_content:
                    news.content = new_content
                    print(f"✓ Očišćena vijest: {news.title[:50]}...")
                    print(f"  Pre:  {old_content[:80]}...")
                    print(f"  Posle: {new_content[:80]}...\n")
        
        db.session.commit()
        print(f"\n✅ Sve vijesti su očišćene!")

if __name__ == '__main__':
    clean_all_news()
