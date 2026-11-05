#!/usr/bin/env python3
"""Compose the home hero product lineup from supplied cut-out photography.

The three source files live in ``产品素材/首页`` and already carry an alpha
channel. They are cleaned, scaled and composed into one transparent WebP so
the hero keeps its existing two-column layout and navy background.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SITE_ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = SITE_ROOT.parent / "产品素材" / "首页"
OUTPUT = SITE_ROOT / "public" / "images" / "home" / "hero-lineup.webp"
PREVIEW = Path("/tmp/hero-lineup-preview.png")

CANVAS = (1200, 1100)


def load(name: str) -> Image.Image:
    return Image.open(SOURCE_DIR / name).convert("RGBA")


def trim(image: Image.Image, pad: int = 6, threshold: int = 8) -> Image.Image:
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


def rotated(image: Image.Image, degrees: float) -> Image.Image:
    """Rotate with premultiplied alpha to avoid dark fringes."""
    rgba = np.array(image).astype(np.float32)
    alpha = rgba[..., 3:4] / 255.0
    rgba[..., :3] *= alpha
    premultiplied = Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8))
    spun = np.array(
        premultiplied.rotate(degrees, expand=True, resample=Image.BICUBIC)
    ).astype(np.float32)
    spun_alpha = spun[..., 3:4] / 255.0
    spun[..., :3] = np.divide(
        spun[..., :3],
        np.maximum(spun_alpha, 1e-6),
        out=np.zeros_like(spun[..., :3]),
        where=spun_alpha > 0.003,
    )
    return Image.fromarray(np.clip(spun, 0, 255).astype(np.uint8))


def scale_width(image: Image.Image, width: int) -> Image.Image:
    height = round(image.height * width / image.width)
    return image.resize((width, height), Image.LANCZOS)


def scale_height(image: Image.Image, height: int) -> Image.Image:
    width = round(image.width * height / image.height)
    return image.resize((width, height), Image.LANCZOS)


def draw_shadow(canvas: Image.Image, center: tuple[int, int], size: tuple[int, int]) -> None:
    """Lay a soft contact shadow under a product before pasting it."""
    width, height = size
    plate = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    left = round(center[0] - width / 2)
    top = round(center[1] - height / 2)
    ImageDraw.Draw(plate).ellipse(
        (left, top, left + width, top + height), fill=(3, 8, 16, 105)
    )
    plate = plate.filter(ImageFilter.GaussianBlur(26))
    canvas.alpha_composite(plate)


def place(
    canvas: Image.Image,
    image: Image.Image,
    center: tuple[int, int],
    degrees: float,
    shadow: tuple[int, int] | None = None,
) -> None:
    product = rotated(image, degrees)
    if shadow:
        draw_shadow(
            canvas,
            (center[0], center[1] + product.height // 2 - shadow[1] // 3),
            shadow,
        )
    canvas.alpha_composite(
        product,
        (center[0] - product.width // 2, center[1] - product.height // 2),
    )


def navy_background(size: tuple[int, int]) -> Image.Image:
    width, height = size
    yy, xx = np.mgrid[0:height, 0:width]
    cx, cy = width * 0.78, height * 0.45
    distance = np.sqrt(((xx - cx) / width) ** 2 + ((yy - cy) / height) ** 2)
    distance /= distance.max()

    stops = [(0.0, (33, 68, 108)), (0.35, (20, 41, 67)), (0.72, (16, 28, 45))]
    rgb = np.zeros((height, width, 3), dtype=np.float32)
    for (start, colour), (end, next_colour) in zip(stops, stops[1:]):
        band = (distance >= start) & (distance <= end)
        mix = np.clip((distance - start) / (end - start), 0, 1)[..., None]
        rgb[band] = (
            np.array(colour, dtype=np.float32) * (1 - mix[band])
            + np.array(next_colour, dtype=np.float32) * mix[band]
        )
    rgb[distance > stops[-1][0]] = stops[-1][1]
    return Image.fromarray(rgb.astype(np.uint8)).convert("RGBA")


def main() -> None:
    tablet = trim(load("Rugged Tablets.png"))
    rfid = trim(load("RFID Handhelds.png"))
    barcode = trim(load("Barcode Handhelds.png"))

    tablet = scale_width(tablet, 640)
    barcode = scale_height(barcode, 410)
    rfid = scale_width(rfid, 450)

    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))

    # A quiet, symmetric family portrait: the tablet sits above while both
    # handhelds share a near-common ground line, only grazing its lower bezel.
    place(canvas, tablet, (600, 335), -2, shadow=(580, 52))
    place(canvas, rfid, (310, 745), -4, shadow=(390, 50))
    place(canvas, barcode, (890, 735), 4, shadow=(160, 38))

    canvas = trim(canvas, pad=30, threshold=4)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUTPUT, "WEBP", quality=90, method=6)
    print(f"wrote {OUTPUT.relative_to(SITE_ROOT)} ({OUTPUT.stat().st_size} bytes)")

    preview = navy_background(canvas.size)
    preview.alpha_composite(canvas)
    preview.convert("RGB").save(PREVIEW)
    print(f"wrote preview {PREVIEW}")


if __name__ == "__main__":
    main()
