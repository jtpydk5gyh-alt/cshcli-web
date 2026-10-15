from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET


root = Path(__file__).resolve().parents[1] / "dist"
origin = "https://jtpydk5gyh-alt.github.io/cshcli-web/"


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids = []
        self.links = []
        self.h1 = 0
        self.feed(text)

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        self.h1 += tag == "h1"
        if "id" in attrs:
            self.ids.append(attrs["id"])
        for key in ("href", "src"):
            if key in attrs:
                self.links.append(attrs[key])


pages = {path.name: Page(path.read_text(encoding="utf-8")) for path in root.glob("*.html")}
assert {"index.html", "legal.html"} <= pages.keys()
for name, page in pages.items():
    assert page.h1 == 1, (name, "H1")
    assert len(page.ids) == len(set(page.ids)), (name, "IDs duplicados")
    for link in page.links:
        parts = urlsplit(link)
        if parts.scheme or parts.netloc:
            continue
        target = parts.path or name
        if target in ("/", "./"):
            target = "index.html"
        assert not target.startswith("/"), (name, "Ruta fuera del proyecto", link)
        assert (root / target).is_file(), (name, "Archivo ausente", link)
        if parts.fragment:
            assert parts.fragment in pages[target].ids, (name, "Ancla ausente", link)
    text = (root / name).read_text(encoding="utf-8")
    expected = origin if name == "index.html" else origin + name
    assert f'rel="canonical" href="{expected}"' in text, (name, "Canonical")
    assert "chatgpt.site" not in text, (name, "Origen antiguo")
    assert "noindex" not in text.lower(), (name, "No indexable")
    for data in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S):
        json.loads(data)

css = (root / "styles.css").read_text(encoding="utf-8")
for asset in re.findall(r"url\(['\"]?([^)'\"]+)", css):
    assert not asset.startswith("http"), ("Recurso externo", asset)
    assert (root / asset).is_file(), ("Asset CSS ausente", asset)

locations = {element.text for element in ET.parse(root / "sitemap.xml").iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")}
assert locations == {origin, origin + "legal.html"}, "Sitemap incoherente"
assert "Sitemap: " + origin + "sitemap.xml" in (root / "robots.txt").read_text()
assert 'class="motion-paused"' in (root / "index.html").read_text(encoding="utf-8")
print(f"site-check: {len(pages)} páginas, enlaces, assets, SEO y movimiento inicial correctos")
