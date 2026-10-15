"""
Builds web-ready brand assets from the original Zinfity logo PNGs in the project root.

Only transparent padding (and stray marks outside the logo) is cropped away.
Logo pixels are never recoloured, redrawn or reshaped.

Usage:  python scripts/build-assets.py   (requires Pillow)
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "brand"
OUT.mkdir(parents=True, exist_ok=True)

# source file -> (output name, crop box in source pixels)
CROPS = {
    "Zin_Tech.png": ("logo-on-dark", (118, 126, 554, 248)),            # Z + wordmark, white type
    "Zinfity_White_full.png": ("lockup-on-dark", (96, 126, 578, 264)),  # + tagline, white type
    "Zinfity_Black_Final.png": ("lockup-on-light", (96, 126, 578, 262)),
    "Zinfity_01.png": ("z-mark", (176, 58, 460, 306)),                 # 3D metallic Z symbol
}


def save(im: Image.Image, name: str) -> None:
    im.save(OUT / f"{name}.png", optimize=True)
    im.save(OUT / f"{name}.webp", quality=92, method=6)
    print(f"  {name}: {im.size}")


def main() -> None:
    crops = {}
    for src, (name, box) in CROPS.items():
        im = Image.open(ROOT / src).convert("RGBA").crop(box)
        crops[name] = im
        save(im, name)

    # Official light-background lockup (Z + INFITY, high resolution): downscaled only.
    light = Image.open(ROOT / "Zinfity_Logo_ColorOnLight.png").convert("RGBA")
    light = light.resize((640, round(light.height * 640 / light.width)), Image.LANCZOS)
    save(light, "logo-on-light")

    mark = crops["z-mark"]

    # Favicons: the real mark centred on a square, transparent for the tab icon,
    # dark for platforms that need an opaque tile.
    def square(size: int, pad: float, bg=None) -> Image.Image:
        canvas = Image.new("RGBA", (size, size), bg or (0, 0, 0, 0))
        inner = int(size * (1 - pad * 2))
        m = mark.copy()
        m.thumbnail((inner, inner), Image.LANCZOS)
        canvas.alpha_composite(m, ((size - m.width) // 2, (size - m.height) // 2))
        return canvas

    pub = ROOT / "public"
    square(64, 0.04).save(pub / "favicon-64.png", optimize=True)
    square(32, 0.02).save(pub / "favicon-32.png", optimize=True)
    square(48, 0.02).save(pub / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    square(180, 0.16, (10, 11, 14, 255)).save(pub / "apple-touch-icon.png", optimize=True)
    square(512, 0.18, (10, 11, 14, 255)).save(pub / "icon-512.png", optimize=True)

    # Open Graph image: lockup centred on a dark, softly lit field.
    W, H = 1200, 630
    og = Image.new("RGBA", (W, H), (8, 9, 12, 255))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse((W * 0.18, -H * 0.55, W * 0.82, H * 0.75), fill=(176, 122, 79, 70))
    og.alpha_composite(glow.filter(ImageFilter.GaussianBlur(120)))
    lock = crops["lockup-on-dark"].copy()
    scale = 760 / lock.width
    lock = lock.resize((760, int(lock.height * scale)), Image.LANCZOS)
    og.alpha_composite(lock, ((W - lock.width) // 2, (H - lock.height) // 2))
    og.convert("RGB").save(pub / "og-image.jpg", quality=90, optimize=True)
    print("  favicons + og-image done")


if __name__ == "__main__":
    main()
