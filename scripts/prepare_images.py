#!/usr/bin/env python3
"""Gera as imagens otimizadas em public/img a partir de arquivo-site-antigo/imagens."""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "arquivo-site-antigo/imagens", ROOT / "public/img"
sizes = {}

def save(name, source, box=None, sat=None, max_w=1200, q=82):
    im = Image.open(SRC / source).convert("RGB")
    if box:
        w, h = im.size
        im = im.crop((int(box[0]*w), int(box[1]*h), int(box[2]*w), int(box[3]*h)))
    if sat is not None:
        from PIL import ImageEnhance
        im = ImageEnhance.Color(im).enhance(sat)
    if im.width > max_w:
        im = im.resize((max_w, round(im.height*max_w/im.width)), Image.LANCZOS)
    im.save(OUT / f"{name}.webp", "WEBP", quality=q, method=6)
    sizes[name] = [im.width, im.height]

save("hero", "WhatsApp-Image-2021-10-31-at-18.01.02.jpeg", (0, .02, 1, 1))
save("naturalidade", "WhatsApp-Image-2021-10-31-at-18.02.04.jpeg", (0, 0, 1, .74))
save("volume", "WhatsApp-Image-2021-10-31-at-18.03.51.jpeg", (0, .04, 1, .62))
save("comprimento", "WhatsApp-Image-2021-10-31-at-17.49.21-1.jpeg")
save("marta", "12-1.jpg", (.02, 0, 1, .92), sat=.72)
save("marta-retrato", "77-2.jpg", sat=.85)
save("juncao-visivel", "56_wrong.jpg", (.28, 0, 1, 1))
save("juncao-invisivel", "56_right.jpg", (.28, 0, 1, 1))

# Antes e depois: (ficheiro, painel antes, painel depois), em frações da imagem.
PAIRS = [
    ("antes_e_depois_03.jpg", (.005, .01, .4975, .85), (.505, .01, .995, .85)),
    ("antes_e_depois_02.jpg", (.005, .01, .4975, .85), (.505, .01, .995, .85)),
    ("antes_e_depois_04.jpg", (.005, .01, .4975, .85), (.505, .01, .995, .85)),
    ("antes_e_depois_01.jpg", (.005, .01, .4975, .857), (.505, .01, .995, .857)),
    ("antes-e-depois.jpg", (.02, .02, .47, .86), (.50, .02, .98, .86)),
    ("Instasize_0819012310.jpg", (.02, .03, .585, .76), (.61, .03, .98, .76)),
    ("IMG_20150811_230215.jpg", (.025, .02, .4875, .85), (.51, .02, .975, .85)),
]
for i, (f, a, b) in enumerate(PAIRS, 1):
    save(f"ad{i}-antes", f, a)
    save(f"ad{i}-depois", f, b)

for name, f in {"cert-just": "justextensionsacademy.png", "cert-donna": "MartaLopesFerreira_donna_bella.jpg",
                "cert-lab": "MartaLopesFerreira.jpg"}.items():
    save(name, f)
for name, f in {"imprensa-exame": "Materia_Exame_1.png", "imprensa-gazeta": "noticia2.png",
                "imprensa-estado": "noticia1.png", "imprensa-ego": "bolina_ego.jpg",
                "imprensa-revista": "cabelo_fio_a_fio_big-scaled.jpg", "imprensa-infomoney": "CL_InfoMoney-1.png"}.items():
    save(name, f, max_w=1000, q=80)

og = Image.open(SRC / "WhatsApp-Image-2021-10-31-at-18.01.02.jpeg").convert("RGB")
og.crop((0, 120, og.width, 120 + 403)).save(OUT / "og.jpg", quality=84)

(ROOT / "src/images.json").write_text(json.dumps(sizes, indent=1))
print(len(sizes), "imagens")
