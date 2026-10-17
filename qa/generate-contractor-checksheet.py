"""Generate the printable checklist from the same five items used on the page."""
import argparse
import json
from pathlib import Path
import shutil
import subprocess

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--node', default=shutil.which('node'))
parser.add_argument('--font', default='C:/Windows/Fonts/meiryo.ttc')
parser.add_argument('--bold-font', default='C:/Windows/Fonts/meiryob.ttc')
args = parser.parse_args()
if not args.node:
    parser.error('Node.js is required to read the page content; pass --node.')
source = "import {pages} from './site/map/content.js'; console.log(JSON.stringify(pages.find(p=>p.id==='compare').checkQuestions));"
items = json.loads(subprocess.check_output(
    [args.node, '--input-type=module', '--eval', source], cwd=ROOT, encoding='utf-8'))
assert len(items) == 5
pdfmetrics.registerFont(TTFont('Checklist', args.font, subfontIndex=0))
pdfmetrics.registerFont(TTFont('ChecklistBold', args.bold_font, subfontIndex=0))
out = ROOT / 'site/map/assets/contractor-checksheet.pdf'
c = canvas.Canvas(str(out), pagesize=A4, pageCompression=1, invariant=1)
c.setTitle('施工会社を選ぶ，5つのチェック｜はれトク')
c.setAuthor('はれトク')
c.setSubject('1社につき1枚使う，相談・見積もり比較用のチェックシート')
W, H = A4
green = colors.HexColor('#174b3b')
muted = colors.HexColor('#52685d')
rule = colors.HexColor('#b7c7be')
left, right = 42, W - 42

def text(x, y, value, size=10, bold=False, color=green):
    c.setFillColor(color)
    c.setFont('ChecklistBold' if bold else 'Checklist', size)
    c.drawString(x, y, value)

def paragraph(x, top, value, width, size=9, bold=False, leading=14):
    style = ParagraphStyle('body', fontName='ChecklistBold' if bold else 'Checklist',
                           fontSize=size, leading=leading, textColor=green, wordWrap='CJK')
    p = Paragraph(escape(value), style)
    _, height = p.wrap(width, H)
    p.drawOn(c, x, top - height)
    return height

text(left, H-43, 'はれトク', 12, True)
text(left, H-78, '施工会社を選ぶ，5つのチェック', 19, True)
text(left, H-100, '1社につき1枚．説明や書面で確かめた項目に，チェックを入れましょう．', 9)
text(left, H-132, '会社名：', 10)
text(left+325, H-132, '相談日：', 10)
c.setStrokeColor(rule)
c.setLineWidth(.6)
c.line(left+44, H-138, left+309, H-138)
c.line(left+369, H-138, right, H-138)

top = H-158
row_height = 111
for i, item in enumerate(items):
    y = top-i*row_height
    c.setStrokeColor(green)
    c.setLineWidth(1)
    c.rect(left, y-15, 11, 11)
    height = paragraph(left+21, y, item['question'], right-left-21, 10.5, True, 16)
    assert height <= 32, 'Checklist heading needs more room'
    desc_height = paragraph(left+21, y-height-7, item['explanation'], right-left-21, 9, leading=14)
    assert height+desc_height <= 60, 'Checklist text overlaps writing space'
    text(left+21, y-75, 'メモ', 8, color=muted)
    c.setStrokeColor(rule)
    c.setLineWidth(.5)
    c.line(left+47, y-78, right, y-78)
    c.line(left+21, y-99, right, y-99)

bottom = top-5*row_height
paragraph(left, bottom-8, '分からない点は説明や書面を追加でお願いし，納得してから契約しましょう．', right-left, 9)
text(left, 40, 'はれトク｜施工会社の選び方', 8, color=muted)
text(right-151, 40, 'https://haretoku.jp/#compare', 8, color=muted)
c.linkURL('https://haretoku.jp/#compare', (right-151, 37, right, 51), relative=0)
c.showPage()
c.save()
print(out)
