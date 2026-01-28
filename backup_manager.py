import os
import shutil
import sqlite3
from datetime import datetime
from pathlib import Path

class BackupManager:
    def __init__(self, db_path='instance/news.db', backup_dir='backups'):
        self.db_path = db_path
        self.backup_dir = backup_dir
        
        # Kreiraj backup folder ako ne postoji
        os.makedirs(self.backup_dir, exist_ok=True)
    
    def create_backup(self):
        """Kreiraj backup baze podataka"""
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_filename = f'backup_{timestamp}.db'
            backup_path = os.path.join(self.backup_dir, backup_filename)
            
            # Kopiraj bazu
            if os.path.exists(self.db_path):
                shutil.copy2(self.db_path, backup_path)
                return {
                    'success': True,
                    'message': f'Backup uspješno kreiran: {backup_filename}',
                    'filename': backup_filename,
                    'path': backup_path
                }
            else:
                return {
                    'success': False,
                    'message': 'Baza podataka nije pronađena'
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'Greška pri kreiranju backupa: {str(e)}'
            }
    
    def get_backups(self):
        """Pronađi sve backupe sortirane po vremenu (najnoviji prvi)"""
        backups = []
        
        if os.path.exists(self.backup_dir):
            for filename in os.listdir(self.backup_dir):
                if filename.endswith('.db'):
                    filepath = os.path.join(self.backup_dir, filename)
                    file_size = os.path.getsize(filepath)
                    file_time = os.path.getmtime(filepath)
                    
                    # Parsiranje vremena iz imena fajla
                    try:
                        time_str = filename.replace('backup_', '').replace('.db', '')
                        dt = datetime.strptime(time_str, '%Y%m%d_%H%M%S')
                        date_formatted = dt.strftime('%d.%m.%Y %H:%M:%S')
                    except:
                        date_formatted = 'Nepoznato vrijeme'
                    
                    # Formiraj veličinu
                    if file_size > 1024 * 1024:
                        size_str = f'{file_size / (1024 * 1024):.1f} MB'
                    elif file_size > 1024:
                        size_str = f'{file_size / 1024:.1f} KB'
                    else:
                        size_str = f'{file_size} B'
                    
                    backups.append({
                        'filename': filename,
                        'path': filepath,
                        'date': date_formatted,
                        'size': size_str,
                        'timestamp': file_time
                    })
        
        # Sortiraj po vremenu (najnoviji prvi)
        backups.sort(key=lambda x: x['timestamp'], reverse=True)
        return backups
    
    def restore_backup(self, backup_filename):
        """Vrati bazu iz backupa"""
        try:
            backup_path = os.path.join(self.backup_dir, backup_filename)
            
            if not os.path.exists(backup_path):
                return {
                    'success': False,
                    'message': 'Backup nije pronađen'
                }
            
            # Kreiraj backup trenutne baze prije restoriranja
            self.create_backup()
            
            # Vrati iz backupa
            shutil.copy2(backup_path, self.db_path)
            
            return {
                'success': True,
                'message': f'Baza je uspješno vraćena iz backupa: {backup_filename}'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Greška pri restoriranju: {str(e)}'
            }
    
    def delete_backup(self, backup_filename):
        """Obriši backup"""
        try:
            backup_path = os.path.join(self.backup_dir, backup_filename)
            
            if not os.path.exists(backup_path):
                return {
                    'success': False,
                    'message': 'Backup nije pronađen'
                }
            
            os.remove(backup_path)
            
            return {
                'success': True,
                'message': f'Backup je obrisan: {backup_filename}'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Greška pri brisanju backupa: {str(e)}'
            }
    
    def get_backup_info(self):
        """Pronađi informacije o backupima"""
        backups = self.get_backups()
        
        return {
            'total_backups': len(backups),
            'backups': backups,
            'db_size': self._get_db_size(),
            'last_backup': backups[0] if backups else None
        }
    
    def _get_db_size(self):
        """Pronađi veličinu glavne baze"""
        if os.path.exists(self.db_path):
            size = os.path.getsize(self.db_path)
            if size > 1024 * 1024:
                return f'{size / (1024 * 1024):.1f} MB'
            elif size > 1024:
                return f'{size / 1024:.1f} KB'
            else:
                return f'{size} B'
        return 'Nepoznato'
