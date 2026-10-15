# CSHCLI Website

[![Site](https://github.com/jtpydk5gyh-alt/cshcli-web/actions/workflows/pages.yml/badge.svg)](https://github.com/jtpydk5gyh-alt/cshcli-web/actions/workflows/pages.yml)
[MIT License](LICENSE)

The public website for **CSHCLI**, an open-source command-line tool for connecting personal AI providers and coordinating local project work.

[Visit the website](https://jtpydk5gyh-alt.github.io/cshcli-web/) · [Explore the CLI](https://github.com/jtpydk5gyh-alt/cshcli) · [Read the documentation](https://github.com/jtpydk5gyh-alt/cshcli/blob/main/README.md)

## Overview

This repository contains the CSHCLI installation website, product information, illustrative terminal examples, and legal notices. It is a static HTML, CSS, and JavaScript site published through GitHub Pages.

- Installation instructions for Windows, macOS, and Linux.
- A responsive layout with keyboard-accessible controls.
- Optional animations that are paused by default.
- A terminal preview with a stable layout when examples change.
- Locally hosted fonts and an optimized WebP background.
- Search metadata, structured data, a sitemap, and crawler instructions.
- Terms of use, privacy information, cookie information, and license attribution.

The CLI source code and its tests are maintained in the [CSHCLI repository](https://github.com/jtpydk5gyh-alt/cshcli).

## Install CSHCLI

Requires **Python 3.11 or later** with pip.

```powershell
python -m pip install "https://github.com/jtpydk5gyh-alt/cshcli/archive/refs/heads/main.zip"
cshcli --version
```

The command installs the current `main` branch of the CLI repository. Use the [website](https://jtpydk5gyh-alt.github.io/cshcli-web/#instalar) for platform-specific commands and virtual environment instructions.

**Project status:** CSHCLI 0.2.0 is a local pilot. AI access requires the user's own provider credentials or a compatible official CLI. Remote collaboration is not deployed, and file reservations are cooperative. See the [CLI documentation](https://github.com/jtpydk5gyh-alt/cshcli/blob/main/README.md) for capabilities and current limitations.

## Develop locally

### Prerequisites

- Git to clone the repository.
- Python 3.11 or later to serve and validate the site.
- Node.js to check JavaScript syntax.

No package installation or build step is required.

```powershell
git clone https://github.com/jtpydk5gyh-alt/cshcli-web.git
cd cshcli-web
python -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173). The server exposes only the `dist` directory.

### Validate changes

```powershell
node --check dist/app.js
python scripts/check_site.py
```

The site check validates page structure, internal links and anchors, assets, local fonts, canonical URLs, JSON-LD, sitemap entries, and the initial animation state. GitHub Actions runs these checks for every pull request.

For visual changes, also verify narrow and desktop viewports, keyboard navigation, platform selection, command copying, legal links, and the animation controls.

## Repository structure

| Path | Purpose |
| --- | --- |
| `dist/index.html` | Public landing page and installation instructions |
| `dist/legal.html` | Project notice, terms, privacy, cookies, and attribution |
| `dist/styles.css` | Responsive layout, local fonts, and visual styling |
| `dist/app.js` | Platform selection, command copying, and optional demonstrations |
| `dist/assets/` | Optimized illustration, icon, fonts, and font licenses |
| `dist/robots.txt` | Crawler access and sitemap location |
| `dist/sitemap.xml` | Public page URLs |
| `scripts/check_site.py` | Dependency-free site validation |
| `.github/workflows/pages.yml` | Pull request checks and GitHub Pages deployment |

## Search visibility

Product information and direct answers are available in static HTML, with stable section links and structured data that matches the visible content. The website identifies the official source repository, documentation, current pilot version, requirements, and limitations so search engines and assistants can cite the project accurately.

Google's [AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) uses the same crawlability and content fundamentals as traditional search. [OpenAI's crawler documentation](https://developers.openai.com/api/docs/bots) distinguishes search discovery from model training. Search placement and citations are determined by each service.

On a GitHub Pages project URL, the robots file in this repository is served below `/cshcli-web/`. Crawler rules apply at the host root; this file does not control host-wide crawler access. The published sitemap can be submitted in Search Console after verifying the property. A future custom domain would provide a site root for crawler configuration.

## Contribute and publish

Submit changes through a pull request. The protected `main` branch requires the `site-check` status check and resolved conversations. Direct pushes, force pushes, and branch deletion are blocked, including for administrators.

Repository write access is limited to the owner, [jtpydk5gyh-alt](https://github.com/jtpydk5gyh-alt). Public forks and pull requests do not grant write access to this repository.

After a pull request is merged, GitHub Actions validates the result and publishes `dist` to GitHub Pages. Deployment is limited to `main` through the `github-pages` environment. Official actions are pinned to full commit SHAs. The workflow uses read access to source code; the deployment job additionally receives Pages and OIDC permissions.

## Privacy and legal information

The site's own code does not include analytics, advertising, forms, or persistent browser storage. Fonts are served locally. GitHub Pages logs visitor IP addresses for security under GitHub's policies.

The [legal information](https://jtpydk5gyh-alt.github.io/cshcli-web/legal.html) is available in Spanish. It distinguishes browsing the website from installing the CLI and using third-party AI providers. Do not publish credentials or personal information in public issues.

## License and attribution

This project's code is licensed under the [MIT License](LICENSE).

Copyright © 2026 Trankideal and CSHCLI contributors.

DM Sans and Instrument Serif are distributed under the SIL Open Font License. Their license notices are included in [`dist/assets/fonts`](dist/assets/fonts). The night-sky illustration was generated for this website and is served as an optimized WebP asset.
