#!/usr/bin/env python3
"""Generate web icon atlases from the EQ client's sprite-atlas files.
Source is the EQ/EQL client install (NOT in this repo); output is gitignored.
Usage: python3 scripts/gen-item-icons.py [SRC_DIR] [OUT_DIR]
  SRC_DIR default: ~/src/showeq/EverQuest/uifiles/default   (EQ client uifiles)
  OUT_DIR default: public/icons

Two icon sets are transcoded, both a 256x256 atlas of a 6x6 grid of 40x40 icons.
Output index is normalized to 3-digit zero-padding (ItemIcon always requests
zero-padded), so file names and requests always agree:
  * Item icons:  dragitem1.dds -> dragitem001.png  (atlas "dragitem", base 500)
  * Spell icons: Spells21.tga  -> spells021.png     (atlas "spells",   base 0)
Icon id -> file/cell:  file = (icon-base)//36 + 1 ;  cell = (icon-base)%36 ;
  col = cell%6 ; row = cell//6 ; sprite at (col*40, row*40).

The client atlases are DXT5-compressed DDS (items) / uncompressed TGA (spells),
both of which Pillow reads natively (Image.open -> convert("RGBA")) -- no
texconv / ImageMagick / nvdxt needed. This script transcodes each source atlas
to a lowercase, 3-digit zero-padded .png so the browser can load them as CSS
background sprites (see src/ui/ItemIcon.tsx).

Spell source files use mixed casing (spells01.tga .. Spells63.tga); we glob
case-insensitively and always emit a lowercase "spellsNN.png".

Re-run whenever the client's art updates (rare). The PNGs are gitignored
(public/icons/), so a fresh checkout must run this once before icons show.
"""
import glob
import os
import re
import sys

from PIL import Image


DEFAULT_SRC = os.path.expanduser("~/src/showeq/EverQuest/uifiles/default")
DEFAULT_OUT = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "icons"
)


def _iglob(src_dir: str, prefix: str, ext: str) -> list:
    """Case-insensitive glob for <prefix>*<ext> in src_dir (dedup by realpath)."""
    seen = {}
    # Build a per-character case-insensitive class for the prefix, e.g.
    # "spells" -> "[sS][pP][eE][lL][lL][sS]".
    ci_prefix = "".join("[%s%s]" % (c.lower(), c.upper()) for c in prefix)
    ci_ext = "".join(
        "[%s%s]" % (c.lower(), c.upper()) if c.isalpha() else c for c in ext
    )
    for path in glob.glob(os.path.join(src_dir, ci_prefix + "*" + ci_ext)):
        seen[os.path.realpath(path)] = path
    return sorted(seen.values())


def _convert(src_files: list, out_dir: str, out_prefix: str) -> int:
    """Transcode each source atlas to <out_prefix><index>.png. Returns count."""
    count = 0
    for src in src_files:
        stem = os.path.splitext(os.path.basename(src))[0]
        # Emit a normalized, 3-digit zero-padded index (ItemIcon always requests
        # zero-padded), so dragitem1.dds -> dragitem001.png, Spells21.tga ->
        # spells021.png. 3 digits covers the largest set (dragitem, ~399).
        m = re.search(r"(\d+)$", stem)
        index = f"{int(m.group(1)):03d}" if m else stem
        out_png = os.path.join(out_dir, out_prefix + index + ".png")
        Image.open(src).convert("RGBA").save(out_png)
        count += 1
    return count


def main() -> int:
    src_dir = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SRC
    out_dir = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_OUT

    if not os.path.isdir(src_dir):
        print(
            f"error: SRC_DIR not found: {src_dir}\n"
            "Pass the path to your EQ client uifiles/default dir as the first arg.",
            file=sys.stderr,
        )
        return 1

    item_files = sorted(glob.glob(os.path.join(src_dir, "dragitem*.dds")))
    spell_files = _iglob(src_dir, "spells", ".tga")

    if not item_files and not spell_files:
        print(
            f"error: no dragitem*.dds or spells*.tga found in {src_dir}",
            file=sys.stderr,
        )
        return 1

    os.makedirs(out_dir, exist_ok=True)

    item_count = _convert(item_files, out_dir, "dragitem")
    spell_count = _convert(spell_files, out_dir, "spells")

    print(
        f"converted {item_count} item + {spell_count} spell atlas file(s): "
        f"{src_dir} -> {out_dir}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
