#!/usr/bin/env python3
"""Prepare the home OEM panel artwork from the supplied exploded-view lineup.

The source PNG is a wide six-device decomposition lineup whose transparency
was flattened into a baked light checkerboard. The OEM panel sits on a navy
background, so flood-fill the connected checkerboard from the edges, make it
transparent, trim the margins and export a WebP for the panel.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SITE_ROOT = Path(__file__).resolve().parent.parent
SOURCE = SITE_ROOT.parent / "产品素材" / "首页" / "RFID-PDA部件分解图-精简版.png"
OUTPUT = SITE_ROOT / "public" / "images" / "home" / "oem-assembly.webp"
PREVIEW = Path("/tmp/oem-assembly-preview.png")

SENTINEL = (255, 0, 254)
TARGET_WIDTH = 1600


def remove_checkerboard(image: Image.Image, threshold: int = 150) -> Image.Image:
    width, height = image.size
    work = image.copy()

    points = [
        (2, 2),
        (width - 3, 2),
        (2, height - 3),
        (width - 3, height - 3),
        (width // 2, 2),
        (width // 2, height - 3),
        (2, height // 2),
        (width - 3, height // 2),
    ]
    for point in points:
        try:
            ImageDraw.floodfill(work, point, SENTINEL, thresh=threshold)
        except ValueError:
            continue

    rgb = np.array(work)
    background = (
        (rgb[:, :, 0] == SENTINEL[0])
        & (rgb[:, :, 1] == SENTINEL[1])
        & (rgb[:, :, 2] == SENTINEL[2])
    )

    rgba = np.array(image.convert("RGBA"))
    rgba[background, 3] = 0
    alpha = Image.fromarray(rgba[:, :, 3]).filter(ImageFilter.GaussianBlur(0.6))
    rgba[:, :, 3] = np.array(alpha)
    return Image.fromarray(rgba)


def main() -> None:
    image = Image.open(SOURCE).convert("RGB")
    result = remove_checkerboard(image)

    bbox = result.getbbox()
    if bbox:
        padding = 24
        box = (
            max(0, bbox[0] - padding),
            max(0, bbox[1] - padding),
            min(result.width, bbox[2] + padding),
            min(result.height, bbox[3] + padding),
        )
        result = result.crop(box)

    if result.width > TARGET_WIDTH:
        height = round(result.height * TARGET_WIDTH / result.width)
        result = result.resize((TARGET_WIDTH, height), Image.LANCZOS)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    result.save(OUTPUT, "WEBP", quality=90, method=6)
    print(
        f"wrote {OUTPUT.relative_to(SITE_ROOT)} "
        f"({result.width}x{result.height}, {OUTPUT.stat().st_size} bytes)"
    )

    # Preview against the panel's navy card background.
    preview = Image.new("RGBA", result.size, (15, 29, 48, 255))
    preview.alpha_composite(result)
    preview.convert("RGB").save(PREVIEW)
    print(f"wrote preview {PREVIEW}")


if __name__ == "__main__":
    main()
