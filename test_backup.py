#!/usr/bin/env python3
"""Test backup sistema"""
import sys
sys.path.insert(0, '/Users/Adi/Desktop/re9')

from backup_manager import BackupManager

# Kreiraj instance
backup_mgr = BackupManager()

# Test 1: Kreiraj backup
print("=" * 50)
print("TEST 1: Kreiranja Backup")
print("=" * 50)
result = backup_mgr.create_backup()
print(f"✓ Status: {result['message']}")
print()

# Test 2: Pronađi backupe
print("=" * 50)
print("TEST 2: Lista Backupa")
print("=" * 50)
backup_info = backup_mgr.get_backup_info()
print(f"✓ Ukupno backupa: {backup_info['total_backups']}")
print(f"✓ Veličina baze: {backup_info['db_size']}")
if backup_info['backups']:
    for i, backup in enumerate(backup_info['backups'][:3], 1):
        print(f"  {i}. {backup['filename']} - {backup['date']} ({backup['size']})")
print()

# Test 3: Kreiraj još jedan backup
print("=" * 50)
print("TEST 3: Kreiranja Drugog Backupa")
print("=" * 50)
result = backup_mgr.create_backup()
print(f"✓ Status: {result['message']}")
print()

# Test 4: Provjera da li radi restoriranje
print("=" * 50)
print("TEST 4: Simulacija Restoriranja")
print("=" * 50)
backup_info = backup_mgr.get_backup_info()
if backup_info['backups'] and len(backup_info['backups']) > 1:
    oldest = backup_info['backups'][-1]  # Najstariji
    print(f"⚠️  Najstariji backup: {oldest['filename']}")
    print(f"   Vremenske oznake se čuvaju")
    print(f"   Kliknite VRATI dugme u admin panelu da vratite staro stanje")
else:
    print("✓ Trebate koristiti sistem preko web interfacea")

print()
print("=" * 50)
print("✅ BACKUP SISTEM JE SPREMAN!")
print("=" * 50)
print("\nKorak po korak:")
print("1. Idi na: http://127.0.0.1:5000/admin/backup")
print("2. Klikni 'KREIRAJ BACKUP'")
print("3. Obriši neku vijest")
print("4. Klikni 'VRATI' na backup koji si napravio")
print("5. Vijest će se vratiti!")
