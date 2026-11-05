#!/usr/bin/env python3
"""Compose the products hero lineup from supplied cut-out photography.

The three category representatives already carry an alpha channel. Each one
is cleaned, scaled to a shared visual height and arranged on a transparent
canvas so the products hero can place them on its navy stage without cards.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SITE_ROOT = Path(__file__).resolve().parent.parent
OUTPUT = SITE_ROOT / "public" / "images" / "products" / "hero-lineup.webp"

MARGIN = 40
CANVAS_HEIGHT = 780

# (source, visual height, x, y) — back to front.
LAYERS = [
    ("public/images/products/y100/y100-standard-front.webp", 560, 700, 90),
    ("public/images/products/ht600/ht600-front.webp", 580, 1140, 140),
    ("public/images/products/ht550/ht550-front.webp", 600, 80, 170),
]


def keep_largest_vertical_band(image: Image.Image) -> Image.Image:
    """Drop stray full-width rules that survived the source cut-out."""
    alpha = np.array(image.getchannel("A"))
    rows = (alpha > 8).sum(axis=1)
    groups: list[tuple[int, int]] = []
    start = None
    for y, count in enumerate(rows):
        if count > 0 and start is None:
            start = y
        elif count == 0 and start is not None:
            groups.append((start, y - 1))
            start = None
    if start is not None:
        groups.append((start, len(rows) - 1))
    if not groups:
        return image
    top, bottom = max(groups, key=lambda band: band[1] - band[0])
    return image.crop((0, top, image.width, bottom + 1))


def trim(image: Image.Image, pad: int = 8, threshold: int = 8) -> Image.Image:
    alpha = image.getchannel("A").point(lambda value: 255 if value > threshold else 0)
    box = alpha.getbbox()
    if not box:
        return image
    left, top, right, bottom = box
    return image.crop(
        (
            max(0, left - pad),
            max(0, top - pad),
            min(image.width, right + pad),
            min(image.height, bottom + pad),
        )
    )


def prepare(path: str, height: int) -> Image.Image:
    image = Image.open(SITE_ROOT / path).convert("RGBA")
    image = keep_largest_vertical_band(image)
    image = trim(image)
    width = round(image.width * height / image.height)
    return image.resize((width, height), Image.LANCZOS)


def shadow_for(image: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (image.width + 120, image.height + 120), (0, 0, 0, 0))
    alpha = image.getchannel("A").point(lambda value: int(value * 0.5))
    silhouette = Image.new("RGBA", image.size, (2, 8, 20, 255))
    silhouette.putalpha(alpha)
    canvas.alpha_composite(silhouette, (60, 86))
    return canvas.filter(ImageFilter.GaussianBlur(26))


def main() -> None:
    layers = []
    for path, height, x, y in LAYERS:
        image = prepare(path, height)
        layers.append((image, x, y))

    right = max(x + image.width for image, x, _ in layers)
    bottom = max(y + image.height for image, _, y in layers)
    canvas = Image.new("RGBA", (right + MARGIN, bottom + MARGIN), (0, 0, 0, 0))

    for image, x, y in layers:
        canvas.alpha_composite(shadow_for(image), (x - 60, y - 60))
        canvas.alpha_composite(image, (x, y))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUTPUT, "WEBP", quality=92, method=6)
    print(f"wrote {OUTPUT.relative_to(SITE_ROOT)} ({canvas.width}x{canvas.height})")


if __name__ == "__main__":
    main()
