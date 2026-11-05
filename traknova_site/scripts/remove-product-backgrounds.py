#!/usr/bin/env python3
"""Remove the flat studio background from generated product WebP files.

The source photography is supplied on white or light-grey backgrounds. The
product pages place images on pale gradient panels, so a visible rectangular
background looks like a box. Flood-fill from the four corners and make the
connected background transparent.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent / "public" / "images" / "products"
SENTINEL = (255, 0, 254)


def process(path: Path) -> None:
    image = Image.open(path).convert("RGBA")
    width, height = image.size
    work = image.convert("RGB").copy()

    for point in ((2, 2), (width - 3, 2), (2, height - 3), (width - 3, height - 3)):
        try:
            ImageDraw.floodfill(work, point, SENTINEL, thresh=28)
        except ValueError:
            continue

    rgb = np.array(work)
    background = (
        (rgb[:, :, 0] == SENTINEL[0])
        & (rgb[:, :, 1] == SENTINEL[1])
        & (rgb[:, :, 2] == SENTINEL[2])
    )

    rgba = np.array(image)
    rgba[background, 3] = 0
    alpha = Image.fromarray(rgba[:, :, 3]).filter(ImageFilter.GaussianBlur(0.6))
    rgba[:, :, 3] = np.array(alpha)

    out = Image.fromarray(rgba)
    bbox = out.getbbox()
    if bbox:
        padding = 40
        box = (
            max(0, bbox[0] - padding),
            max(0, bbox[1] - padding),
            min(width, bbox[2] + padding),
            min(height, bbox[3] + padding),
        )
        out = out.crop(box)
        out.thumbnail((1120, 1120), Image.LANCZOS)
        canvas = Image.new("RGBA", (1200, 1200), (0, 0, 0, 0))
        canvas.paste(out, ((1200 - out.width) // 2, (1200 - out.height) // 2), out)
        out = canvas

    out.save(path, "WEBP", quality=82, method=6)
    removed = int(background.sum())
    print(f"background removed: {path.relative_to(ROOT)} ({removed} px)")


def main() -> None:
    files = sorted(ROOT.glob("**/*.webp"))
    for path in files:
        process(path)
    print(f"processed {len(files)} product images")


if __name__ == "__main__":
    main()
