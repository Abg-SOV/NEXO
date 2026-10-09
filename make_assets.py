"""Genera los assets de marca de NEXO a partir del logo original (PNG con transparencia).

Salida en assets/:
  logo.png / logo.webp            -> logo original recortado
  logo-dark.webp / logo-dark.png  -> variante para fondos oscuros (cinta aclarada a azul marino)
  logo-dark-sm.webp               -> versión ligera para navbar/footer
  favicon.ico, favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png
  og-image.jpg (1200x630)         -> imagen para compartir en redes
Uso: python make_assets.py <ruta_logo.png> <carpeta_assets>
"""
import sys
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

SRC, OUT = sys.argv[1], sys.argv[2]
logo = Image.open(SRC).convert("RGBA")
logo = logo.crop(logo.getbbox())
logo.save(f"{OUT}/logo.png", optimize=True)
logo.save(f"{OUT}/logo.webp", quality=90, method=6)

# ---------- Variante oscura: aclara la cinta negra a un degradado azul marino ----------
r, g, b, a = logo.split()
rgb = Image.merge("RGB", (r, g, b))
lum = ImageChops.lighter(ImageChops.lighter(r, g), b)             # max(R,G,B)
dark = lum.point(lambda v: max(0, int(255 * (1 - v / 110))))       # 255 donde es casi negro
W, H = logo.size
grad = Image.new("RGB", (1, H))
top, bot = (30, 52, 140), (9, 16, 50)                              # azul marino claro -> profundo
for y in range(H):
    t = y / (H - 1)
    grad.putpixel((0, y), tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
grad = grad.resize((W, H))
lift = ImageChops.multiply(grad, Image.merge("RGB", (dark, dark, dark)))
logo_dark = Image.merge("RGBA", (*ImageChops.add(rgb, lift).split(), a))
logo_dark.save(f"{OUT}/logo-dark.png", optimize=True)
logo_dark.save(f"{OUT}/logo-dark.webp", quality=90, method=6)
sm = logo_dark.copy(); sm.thumbnail((240, 240), Image.LANCZOS)
sm.save(f"{OUT}/logo-dark-sm.webp", quality=88, method=6)


def glow_bg(size, radius_ratio=0.62, rounded=True):
    """Fondo negro-azul con brillo azul eléctrico centrado."""
    s = size
    bg = Image.new("RGBA", (s, s), (5, 8, 22, 255))
    glow = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(glow)
    rr = int(s * radius_ratio / 2)
    d.ellipse((s // 2 - rr, s // 2 - rr, s // 2 + rr, s // 2 + rr), fill=(31, 75, 255, 150))
    glow = glow.filter(ImageFilter.GaussianBlur(s * 0.12))
    bg = Image.alpha_composite(bg, glow)
    if rounded:
        mask = Image.new("L", (s, s), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, s - 1, s - 1), radius=int(s * 0.22), fill=255)
        bg.putalpha(mask)
    return bg


def icon(size, rounded=True):
    bg = glow_bg(size, rounded=rounded)
    mark = logo_dark.copy()
    mark.thumbnail((int(size * 0.86), int(size * 0.86)), Image.LANCZOS)
    x, y = (size - mark.width) // 2, (size - mark.height) // 2 + int(size * 0.02)
    bg.alpha_composite(mark, (x, y))
    return bg


icon(512).save(f"{OUT}/icon-512.png", optimize=True)
icon(192).save(f"{OUT}/icon-192.png", optimize=True)
icon(180, rounded=False).convert("RGB").save(f"{OUT}/apple-touch-icon.png", optimize=True)
icon(64).resize((32, 32), Image.LANCZOS).save(f"{OUT}/favicon-32.png", optimize=True)
icon(256).save(f"{OUT}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

# ---------- Imagen Open Graph 1200x630 ----------
OW, OH = 1200, 630
og = Image.new("RGBA", (OW, OH), (3, 4, 10, 255))
layer = Image.new("RGBA", (OW, OH), (0, 0, 0, 0))
d = ImageDraw.Draw(layer)
d.ellipse((60, 60, 640, 600), fill=(31, 75, 255, 120))
d.ellipse((780, -200, 1400, 300), fill=(10, 43, 214, 90))
d.ellipse((700, 420, 1300, 900), fill=(127, 212, 255, 40))
og = Image.alpha_composite(og, layer.filter(ImageFilter.GaussianBlur(90)))
mark = logo_dark.copy(); mark.thumbnail((560, 400), Image.LANCZOS)
og.alpha_composite(mark, (70, (OH - mark.height) // 2))
d = ImageDraw.Draw(og)
try:
    f_big = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 132)
    f_mid = ImageFont.truetype("C:/Windows/Fonts/segoeuisl.ttf", 40)
    f_sm = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 28)
except OSError:
    f_big = f_mid = f_sm = ImageFont.load_default()
d.text((680, 180), "NEXO", font=f_big, fill=(255, 255, 255))
d.text((684, 340), "Tu mundo digital,", font=f_mid, fill=(214, 226, 255))
d.text((684, 390), "en un solo lugar.", font=f_mid, fill=(214, 226, 255))
d.line((686, 470, 1100, 462), fill=(77, 116, 255), width=3)
d.text((684, 490), "Robux · Suscripciones · Gift cards", font=f_sm, fill=(154, 170, 210))
og.convert("RGB").save(f"{OUT}/og-image.jpg", quality=88, optimize=True, progressive=True)
print("ok", logo.size)
