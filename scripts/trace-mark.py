"""
Traces the exact silhouette of the supplied 3D Z mark (public/brand/z-mark.png)
from its alpha channel, for the extruded 3D version used on the home page.

The outline is derived from the logo's own pixels (marching squares on the
alpha mask, light Douglas-Peucker simplification), so the 3D silhouette matches
the asset; the front face of the 3D mark is textured with the original image.

Usage:  python scripts/trace-mark.py   (requires Pillow)
Output: src/visuals/three/z-outline.json
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "brand" / "z-mark.png"
OUT = ROOT / "src" / "visuals" / "three" / "z-outline.json"
SCALE = 3          # supersample for smoother sub-pixel contours
THRESH = 0.5       # alpha iso-level
EPS = 0.35         # simplification tolerance in source pixels


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    W, H = im.size
    a = im.getchannel("A").resize((W * SCALE, H * SCALE), Image.BICUBIC)
    w, h = a.size
    px = a.load()
    # 1px transparent border so every contour closes
    def val(x, y):
        if x < 0 or y < 0 or x >= w or y >= h:
            return 0.0
        return px[x, y] / 255.0

    # --- marching squares: collect edge segments ---------------------------
    def interp(p1, p2, v1, v2):
        t = (THRESH - v1) / (v2 - v1) if v2 != v1 else 0.5
        return (p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1]))

    segs = {}
    for y in range(-1, h):
        for x in range(-1, w):
            v = [val(x, y), val(x + 1, y), val(x + 1, y + 1), val(x, y + 1)]
            idx = sum(1 << i for i, s in enumerate(v) if s >= THRESH)
            if idx in (0, 15):
                continue
            c = [(x, y), (x + 1, y), (x + 1, y + 1), (x, y + 1)]
            e = {
                0: ("t", interp(c[0], c[1], v[0], v[1])),
                1: ("r", interp(c[1], c[2], v[1], v[2])),
                2: ("b", interp(c[3], c[2], v[3], v[2])),
                3: ("l", interp(c[0], c[3], v[0], v[3])),
            }
            table = {
                1: [(3, 0)], 2: [(0, 1)], 3: [(3, 1)], 4: [(1, 2)], 5: [(3, 0), (1, 2)],
                6: [(0, 2)], 7: [(3, 2)], 8: [(2, 3)], 9: [(2, 0)], 10: [(0, 1), (2, 3)],
                11: [(2, 1)], 12: [(1, 3)], 13: [(1, 0)], 14: [(0, 3)],
            }
            for a_, b_ in table[idx]:
                p, q = e[a_][1], e[b_][1]
                kp = (round(p[0], 4), round(p[1], 4))
                kq = (round(q[0], 4), round(q[1], 4))
                segs.setdefault(kp, []).append(kq)

    # --- chain segments into closed loops ----------------------------------
    loops, used = [], set()
    for start in list(segs.keys()):
        if start in used:
            continue
        loop, cur = [start], start
        used.add(start)
        while True:
            nxts = [n for n in segs.get(cur, []) if n not in used]
            if not nxts:
                break
            cur = nxts[0]
            used.add(cur)
            loop.append(cur)
        if len(loop) > 20:
            loops.append(loop)

    def area(poly):
        return 0.5 * sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[(i + 1) % len(poly)][0] * poly[i][1] for i in range(len(poly)))

    def rdp(pts, eps):
        if len(pts) < 3:
            return pts
        (x1, y1), (x2, y2) = pts[0], pts[-1]
        dx, dy = x2 - x1, y2 - y1
        n = (dx * dx + dy * dy) ** 0.5 or 1e-9
        dmax, idx = 0.0, 0
        for i in range(1, len(pts) - 1):
            d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / n
            if d > dmax:
                dmax, idx = d, i
        if dmax > eps:
            return rdp(pts[: idx + 1], eps)[:-1] + rdp(pts[idx:], eps)
        return [pts[0], pts[-1]]

    def simplify_closed(loop, eps):
        # split at farthest-apart points so RDP works on open polylines
        far = max(range(len(loop)), key=lambda i: (loop[i][0] - loop[0][0]) ** 2 + (loop[i][1] - loop[0][1]) ** 2)
        a_ = rdp(loop[: far + 1], eps)
        b_ = rdp(loop[far:] + [loop[0]], eps)
        return a_[:-1] + b_[:-1]

    shapes = []
    loops.sort(key=lambda l: -abs(area(l)))
    for l in loops:
        A = area(l) / (SCALE * SCALE)
        if abs(A) < 30:  # ignore specks
            continue
        pts = [(x / SCALE, y / SCALE) for x, y in l]
        pts = simplify_closed(pts, EPS)
        shapes.append({"area": round(A, 1), "points": [[round(x, 2), round(y, 2)] for x, y in pts]})

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"width": W, "height": H, "loops": shapes}))
    print(f"{len(shapes)} loops:", [(s['area'], len(s['points'])) for s in shapes])


if __name__ == "__main__":
    main()
