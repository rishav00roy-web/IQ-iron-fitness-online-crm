import re
from bs4 import BeautifulSoup
import os

html_path = r'C:\Users\User\Documents\antigravity\lucid-heisenberg\original.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

soup = BeautifulSoup(content, 'html.parser')

# Extract CSS
style_tag = soup.find('style')
if style_tag:
    css_content = style_tag.string
    with open(r'C:\Users\User\Documents\antigravity\lucid-heisenberg\src\app\globals.css', 'w', encoding='utf-8') as f:
        # Let's keep the Tailwind imports if they exist, but replace the rest
        # We will prepend standard tailwind imports just in case Next.js needs them
        f.write("@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n")
        f.write(css_content)
    print("Extracted globals.css")

# Extract Body content (we will put it in a separate text file so the AI can read it easily or convert it)
body_tag = soup.find('body')
if body_tag:
    body_html = body_tag.encode_contents().decode('utf-8')
    with open(r'C:\Users\User\Documents\antigravity\lucid-heisenberg\extracted_body.html', 'w', encoding='utf-8') as f:
        f.write(body_html)
    print("Extracted body.html")

# Extract JS
script_tags = soup.find_all('script')
js_content = "\n".join([s.string for s in script_tags if s.string])
with open(r'C:\Users\User\Documents\antigravity\lucid-heisenberg\extracted_logic.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
print("Extracted logic.js")
