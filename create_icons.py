from PIL import Image
import os

# Path to original logo
logo_path = "static/img/logo/requiem-logo.png"
output_dir = "static/img/logo/"

# Open original image
img = Image.open(logo_path)

# Convert to RGBA if needed
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Create 192x192 icon
icon_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
icon_192.save(os.path.join(output_dir, "icon-192.png"), "PNG")
print("✅ Created icon-192.png")

# Create 512x512 icon
icon_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
icon_512.save(os.path.join(output_dir, "icon-512.png"), "PNG")
print("✅ Created icon-512.png")

print("\n🎉 Ikone kreirane! Sada:")
print("1. Refresh stranicu na telefonu")
print("2. Obriši staru RE9 ikonicu sa home screen-a")
print("3. Ponovo dodaj 'Dodaj na početni ekran'")
print("4. Nova ikonica će biti tvoj logo!")
