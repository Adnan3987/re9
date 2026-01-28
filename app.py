from flask import Flask, render_template, request, jsonify, send_from_directory
from routes.admin import admin_bp
from models.news_model import db
import os

# Flask app MORA biti definisan PRIJE ruta
app = Flask(__name__, static_url_path='/static', static_folder='static')
app.secret_key = 'supersecretkey'  # TREBALO BI PROMENITI!

# Registruj upload folder kao dostupan
@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'uploads'), filename)

# Database konfiguracija
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///news.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads/news'
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max

# Inicijalizuj bazu
db.init_app(app)

# Registruj admin blueprint
app.register_blueprint(admin_bp)

# Kreiraj bazu pri pokretanju
with app.app_context():
    db.create_all()

# -------------------------
# FRONTEND RUTE
# -------------------------

@app.route("/")
def home():
    return render_template("frontend/index.html")

@app.route("/meni")
def meni():
    return render_template("frontend/meni.html")

@app.route("/hronika")
def hronika():
    return render_template("frontend/hronika.html")

@app.route("/likovi")
def likovi():
    return render_template("frontend/likovi.html")

@app.route("/multimedija")
def multimedija():
    return render_template("frontend/multimedija.html")

@app.route("/novosti")
def novosti():
    from models.news_model import News
    
    page = request.args.get('page', 1, type=int)
    search_query = request.args.get('search_query', '', type=str).strip()
    
    query = News.query
    
    # Ako postoji search query, filtriraj
    if search_query:
        query = query.filter(
            (News.title.ilike(f'%{search_query}%')) | 
            (News.content.ilike(f'%{search_query}%'))
        )
    
    news_pagination = query.order_by(News.created_at.desc()).paginate(page=page, per_page=5)
    
    return render_template("frontend/novosti.html", news=news_pagination, search_query=search_query)

# -------------------------
# API RUTE
# -------------------------

@app.route("/api/news/<int:news_id>")
def api_get_news(news_id):
    from models.news_model import News
    import json
    news = News.query.get_or_404(news_id)
    gallery = json.loads(news.gallery) if news.gallery else []
    return jsonify({
        'id': news.id,
        'title': news.title,
        'content': news.content,
        'thumbnail': news.thumbnail,
        'gallery': gallery,
        'video_url': news.video_url,
        'twitter_iframe': news.twitter_iframe,
        'created_at': news.created_at.isoformat()
    })

# Clear all news (for debugging)
@app.route("/admin/clear-all-news", methods=['POST'])
def clear_all_news():
    from models.news_model import News
    News.query.delete()
    db.session.commit()
    return jsonify({'status': 'cleared'})

# -------------------------
# RUN APP
# -------------------------

if __name__ == "__main__":
    # host='0.0.0.0' omogućava pristup sa drugih uređaja na istoj mreži
    app.run(debug=True, host='0.0.0.0', port=5000)
