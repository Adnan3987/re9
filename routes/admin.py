from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
import os
import json
import re
import html
from datetime import datetime
from models.news_model import db, News
from backup_manager import BackupManager

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

# Konfiguracija
UPLOAD_FOLDER = 'uploads/news'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'webm'}
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = generate_password_hash('admin123')

# Kreiraj upload folder ako ne postoji
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Kreiraj upload folder ako ne postoji
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ========================
# LOGIN
# ========================

@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username == ADMIN_USERNAME and check_password_hash(ADMIN_PASSWORD, password):
            session['admin_logged_in'] = True
            session['admin_username'] = username
            return redirect(url_for('admin.dashboard'))
        else:
            return render_template('admin/login.html', error='Pogrešno korisničko ime ili lozinka')
    
    return render_template('admin/login.html')

# ========================
# DASHBOARD
# ========================

@admin_bp.route('/dashboard')
def dashboard():
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin.login'))
    
    return render_template('admin/dashboard.html')

# ========================
# LOGOUT
# ========================

@admin_bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('admin.login'))

# ========================
# VIJESTI - CRUD OPERACIJE
# ========================

@admin_bp.route('/news/list')
def news_list():
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin.login'))
    
    page = request.args.get('page', 1, type=int)
    search_title = request.args.get('search_title', '', type=str).strip()
    search_keywords = request.args.get('search_keywords', '', type=str).strip()
    search_date_from = request.args.get('search_date_from', '', type=str).strip()
    search_date_to = request.args.get('search_date_to', '', type=str).strip()
    
    # Počni sa baznom query
    query = News.query
    
    # Pretraga po naslovu (case-insensitive)
    if search_title:
        query = query.filter(News.title.ilike(f'%{search_title}%'))
    
    # Pretraga po ključnim riječima (u sadržaju)
    if search_keywords:
        query = query.filter(News.content.ilike(f'%{search_keywords}%'))
    
    # Pretraga po datumu (od)
    if search_date_from:
        try:
            date_from = datetime.strptime(search_date_from, '%Y-%m-%d')
            query = query.filter(News.created_at >= date_from)
        except:
            pass
    
    # Pretraga po datumu (do)
    if search_date_to:
        try:
            date_to = datetime.strptime(search_date_to, '%Y-%m-%d')
            # Dodaj 23:59:59 da uključi cijeli dan
            date_to = date_to.replace(hour=23, minute=59, second=59)
            query = query.filter(News.created_at <= date_to)
        except:
            pass
    
    # Sortiraj i paginiraj
    news = query.order_by(News.created_at.desc()).paginate(page=page, per_page=5)
    
    # Prosljeđi pretragu parametre šabloni
    return render_template('admin/news_list.html', 
                         news=news,
                         search_title=search_title,
                         search_keywords=search_keywords,
                         search_date_from=search_date_from,
                         search_date_to=search_date_to)

@admin_bp.route('/news/create', methods=['GET', 'POST'])
def news_create():
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin.login'))
    
    if request.method == 'POST':
        try:
            title = request.form.get('title', '').strip()
            content = request.form.get('content', '').strip()
            video_url = request.form.get('video_url', '').strip()
            twitter_iframe = request.form.get('twitter_iframe', '').strip()
            
            # Validacija obaveznih polja
            if not title:
                if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return jsonify({'error': 'Naslov je obavezan!'}), 400
                return redirect(url_for('admin.news_create'))
            
            if not content or content == '<p><br></p>':
                if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return jsonify({'error': 'Sadržaj je obavezan!'}), 400
                return redirect(url_for('admin.news_create'))
            
            # Upload thumbnail
            thumbnail_file = request.files.get('thumbnail')
            thumbnail_path = None
            
            if not thumbnail_file or thumbnail_file.filename == '':
                if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return jsonify({'error': 'Thumbnail slika je obavezna!'}), 400
                return redirect(url_for('admin.news_create'))
            
            if thumbnail_file and allowed_file(thumbnail_file.filename):
                filename = secure_filename(thumbnail_file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
                filename = timestamp + filename
                thumbnail_file.save(os.path.join(UPLOAD_FOLDER, filename))
                thumbnail_path = f'/uploads/news/{filename}'
            else:
                if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return jsonify({'error': 'Thumbnail format nije dozvoljeno!'}), 400
                return redirect(url_for('admin.news_create'))
            
            # Upload galerija slika
            gallery = []
            gallery_files = request.files.getlist('gallery')
            
            for gallery_file in gallery_files:
                if gallery_file and gallery_file.filename and allowed_file(gallery_file.filename):
                    filename = secure_filename(gallery_file.filename)
                    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
                    filename = timestamp + filename
                    gallery_file.save(os.path.join(UPLOAD_FOLDER, filename))
                    gallery.append(f'/uploads/news/{filename}')
            
            # ČUVA sadržaj sa HTML formatiranjem iz Quill editora
            clean_content = content
            
            # Kreiraj novu vijest
            news = News(
                title=title,
                content=clean_content,
                thumbnail=thumbnail_path,
                gallery=json.dumps(gallery) if gallery else None,
                video_url=video_url if video_url else None,
                twitter_iframe=twitter_iframe if twitter_iframe else None
            )
            
            db.session.add(news)
            db.session.commit()
            
            # Ako je fetch request, vrati JSON
            if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return jsonify({'success': True, 'news_id': news.id}), 201
            
            return redirect(url_for('admin.news_list'))
        
        except Exception as e:
            db.session.rollback()
            error_msg = f'Greška pri kreiranju vijesti: {str(e)}'
            
            # Log error to file
            with open('debug.log', 'a') as f:
                f.write(f"\n=== NEWS CREATE ERROR ===\n")
                f.write(f"Error: {error_msg}\n")
                f.write(f"Title: {request.form.get('title', 'N/A')}\n")
                f.write(f"Timestamp: {datetime.now()}\n")
            
            if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return jsonify({'error': error_msg}), 500
            
            return redirect(url_for('admin.news_create'))
    
    return render_template('admin/news_create.html')

@admin_bp.route('/news/edit/<int:news_id>', methods=['GET', 'POST'])
def news_edit(news_id):
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin.login'))
    
    news = News.query.get_or_404(news_id)
    
    if request.method == 'POST':
        news.title = request.form.get('title')
        # ČUVA sadržaj sa HTML formatiranjem iz Quill editora
        news.content = request.form.get('content', '')
        news.video_url = request.form.get('video_url')
        news.twitter_iframe = request.form.get('twitter_iframe')
        news.updated_at = datetime.utcnow()
        
        # Ako je nova thumbnail uploadovana
        thumbnail_file = request.files.get('thumbnail')
        if thumbnail_file and allowed_file(thumbnail_file.filename):
            filename = secure_filename(thumbnail_file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
            filename = timestamp + filename
            thumbnail_file.save(os.path.join(UPLOAD_FOLDER, filename))
            news.thumbnail = f'/uploads/news/{filename}'
        
        # Dodaj nove galerije slike
        gallery = json.loads(news.gallery) if news.gallery else []
        
        # Ukloni izbrisane slike
        deleted_images = request.form.get('deleted_gallery_images')
        if deleted_images:
            try:
                deleted_list = json.loads(deleted_images)
                gallery = [img for img in gallery if img not in deleted_list]
            except:
                pass
        
        gallery_files = request.files.getlist('gallery')
        
        for gallery_file in gallery_files:
            if gallery_file and allowed_file(gallery_file.filename):
                filename = secure_filename(gallery_file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
                filename = timestamp + filename
                gallery_file.save(os.path.join(UPLOAD_FOLDER, filename))
                gallery.append(f'/uploads/news/{filename}')
        
        news.gallery = json.dumps(gallery) if gallery else None
        
        db.session.commit()
        return redirect(url_for('admin.news_list'))
    
    gallery = json.loads(news.gallery) if news.gallery else []
    return render_template('admin/news_edit.html', news=news, gallery=gallery)

@admin_bp.route('/news/delete/<int:news_id>')
def news_delete(news_id):
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin.login'))
    
    news = News.query.get_or_404(news_id)
    db.session.delete(news)
    db.session.commit()
    
    return redirect(url_for('admin.news_list'))

@admin_bp.route('/backup', methods=['GET', 'POST'])
def backup():
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin.login'))
    
    backup_mgr = BackupManager()
    message = None
    message_type = None
    
    # Ako je POST zahtjev
    if request.method == 'POST':
        action = request.form.get('action')
        
        if action == 'create':
            result = backup_mgr.create_backup()
            message = result['message']
            message_type = 'success' if result['success'] else 'error'
        
        elif action == 'restore':
            backup_filename = request.form.get('backup_filename')
            result = backup_mgr.restore_backup(backup_filename)
            message = result['message']
            message_type = 'success' if result['success'] else 'error'
        
        elif action == 'delete':
            backup_filename = request.form.get('backup_filename')
            result = backup_mgr.delete_backup(backup_filename)
            message = result['message']
            message_type = 'success' if result['success'] else 'error'
    
    # Pronađi informacije o backupima
    backup_info = backup_mgr.get_backup_info()
    
    return render_template(
        'admin/backup.html',
        backup_info=backup_info,
        message=message,
        message_type=message_type
    )
