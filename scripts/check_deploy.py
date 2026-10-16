import hashlib
from pathlib import Path
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


root = Path(__file__).resolve().parents[1] / "dist"
origin = (sys.argv[1] if len(sys.argv) > 1 else "https://jtpydk5gyh-alt.github.io/cshcli-web/").rstrip("/") + "/"
files = sorted(path for path in root.rglob("*") if path.is_file())


def fetch(path):
    request = Request(origin + path, headers={"User-Agent": "CSHCLI-deployment-check", "Cache-Control": "no-cache"})
    try:
        with urlopen(request, timeout=15) as response:
            return response.status, response.read()
    except HTTPError as error:
        return error.code, error.read()


for attempt in range(6):
    try:
        for path in files:
            relative = path.relative_to(root).as_posix()
            url = relative.removesuffix("index.html") if relative.endswith("index.html") else relative
            status, body = fetch(url)
            assert status == 200, (relative, status)
            assert hashlib.sha256(body).digest() == hashlib.sha256(path.read_bytes()).digest(), (relative, "contenido publicado distinto")
        status, body = fetch("__deployment-check__/missing-page")
        assert status == 404, ("Ruta ausente", status)
        assert body == (root / "404.html").read_bytes(), "La respuesta 404 no contiene la página del proyecto"
        print(f"deploy-check: {len(files)} archivos publicados, rutas y respuesta 404 correctos")
        break
    except (AssertionError, URLError, TimeoutError) as error:
        if attempt == 5:
            raise
        print(f"deploy-check: publicación propagándose ({attempt + 1}/6): {error}", flush=True)
        time.sleep(5)
