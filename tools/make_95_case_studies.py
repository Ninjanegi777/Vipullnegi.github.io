"""Build the 90s case-study pages (95/work/*.html) from the modern ones (work/*.html).

Run from anywhere:  python3 make_95_case_studies.py /path/to/site
Re-run it whenever a modern case study changes, so both versions say the same thing.
"""
import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup

SITE = Path(sys.argv[1])
CTLS = '<span class="ctls" aria-hidden="true"><span class="ctl">_</span><span class="ctl">□</span><span class="ctl">×</span></span>'

HEAD = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bungee&family=Bungee+Shade&family=Space+Mono:wght@400;700&family=VT323&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/retro.css">
  <script src="../../assets/js/switch.js"></script>
</head>
<body id="top" data-root="../" data-page="work/{name}" data-task="{task}">
  <!-- Generated from work/{name} by make_95_case_studies.py: edit the modern page, then re-run. -->
  <a class="skip-link" href="#main">Skip to content</a>
  <header id="site-header"></header>

"""
FOOT = """

  <div id="site-footer"></div>
  <script src="../assets/js/retro.js"></script>
</body>
</html>
"""


def frag(html):
    return BeautifulSoup(html, "html.parser")


def filename(text):
    t = re.sub(r"[^A-Za-z0-9]+", "_", text).strip("_").upper()
    return (t[:28] or "FILE") + ".TXT"


def wrap_window(soup, el, title, extra_body_class=""):
    """Move el's children into a 95 window (title bar + body)."""
    children = list(el.children)
    bar = frag(f'<div class="title"><span>{title}</span>{CTLS}</div>')
    body = soup.new_tag("div", attrs={"class": ("win-body " + extra_body_class).strip()})
    for c in children:
        body.append(c.extract())
    el.append(bar)
    el.append(body)


for src in sorted((SITE / "work").glob("*.html")):
    soup = BeautifulSoup(src.read_text(encoding="utf-8"), "html.parser")
    title = soup.title.get_text().replace("— Vipul Negi", "— VIPUL 95")
    desc = soup.find("meta", attrs={"name": "description"})["content"]
    main = soup.find("main")
    h1 = main.find("h1").get_text(strip=True)
    task = re.sub(r"[^A-Z0-9]+", "_", h1.upper()).strip("_") + ".DOC"

    # Hero -> desktop + window
    hero = main.find("section", class_="cs-hero")
    hero["class"] = ["cs-hero", "desk"]
    cont = hero.find("div", class_="container")
    win = soup.new_tag("div", attrs={"class": "win cs-hero-win"})
    for c in list(cont.children):
        win.append(c.extract())
    cont.append(win)
    wrap_window(soup, win, f"C:\\VIPUL\\WORK\\{task}")
    back = win.find("a", class_="back-link")
    if back:
        back["class"] = ["btn", "back-link"]

    # Everything after the hero goes on a grey page
    rest = [s for s in hero.find_next_siblings()]
    body = soup.new_tag("div", attrs={"class": "cs-body"})
    hero.insert_after(body)
    for s in rest:
        body.append(s.extract())

    # Table of contents -> window
    toc = main.find("aside", class_="toc")
    if toc:
        toc["class"] = ["win", "toc"]
        p = toc.find("p")
        label = p.get_text(strip=True) if p else "On this page"
        if p:
            p.decompose()
        toc.insert(0, frag(f'<div class="title"><span>{label}</span>{CTLS}</div>'))

    # Sections -> windows titled by their eyebrow
    for sec in main.find_all("section", class_="cs-section"):
        eb = sec.find("span", class_="eyebrow", recursive=False)
        label = eb.get_text(strip=True) if eb else "SECTION"
        sec["class"] = ["win", "cs-section"]
        wrap_window(soup, sec, filename(label))

    # Next project -> window
    for nxt in main.find_all("a", class_="next-project"):
        nxt["class"] = ["win", "next-project"]
        wrap_window(soup, nxt, "NEXT_PROJECT.LNK")

    html = str(main)
    html = html.replace('src="../assets/', 'src="../../assets/').replace('data-full="../assets/', 'data-full="../../assets/')
    out = SITE / "95" / "work" / src.name
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(HEAD.format(title=title, desc=desc, name=src.name, task=task) + "  " + html + FOOT, encoding="utf-8")
    print("wrote", out.relative_to(SITE))
