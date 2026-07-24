import re

html_path = r'C:\Users\User\Documents\antigravity\lucid-heisenberg\extracted_body.html'
with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace class= with className=
content = content.replace('class="', 'className="')
content = content.replace("class='", "className='")

# Replace inline styles if any (simple heuristic: style="...")
# Actually, the original file might not have inline styles or very few. Let's look for style="
def style_replacer(match):
    style_str = match.group(1)
    # just a very naive conversion or simply remove it to let global CSS handle it, but we can try to leave it as a string and React will error, we'll fix manually.
    # Actually, a better way is to avoid it if possible, but let's just let it be for now and fix compile errors.
    return 'style={{}}'

content = re.sub(r'style="([^"]*)"', style_replacer, content)

# Replace self-closing tags
content = re.sub(r'<img([^>]*?)(?<!/)>', r'<img\1 />', content)
content = re.sub(r'<input([^>]*?)(?<!/)>', r'<input\1 />', content)
content = re.sub(r'<hr([^>]*?)(?<!/)>', r'<hr\1 />', content)
content = re.sub(r'<br([^>]*?)(?<!/)>', r'<br\1 />', content)

# Some attributes like viewBox, fillRule etc.
content = content.replace('viewbox=', 'viewBox=')
content = content.replace('fill-rule=', 'fillRule=')
content = content.replace('clip-rule=', 'clipRule=')
content = content.replace('stroke-width=', 'strokeWidth=')
content = content.replace('stroke-linecap=', 'strokeLinecap=')
content = content.replace('stroke-linejoin=', 'strokeLinejoin=')
content = content.replace('xmlns:xlink=', 'xmlnsXlink=')

# Also handle standard HTML comments -> JSX comments
content = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', content, flags=re.DOTALL)

with open(r'C:\Users\User\Documents\antigravity\lucid-heisenberg\src\app\page.tsx', 'w', encoding='utf-8') as f:
    f.write('export default function Home() {\n  return (\n    <>\n')
    f.write(content)
    f.write('\n    </>\n  );\n}\n')

print("Converted to JSX")
