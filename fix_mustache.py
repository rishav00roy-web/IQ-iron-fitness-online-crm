import re

path = r'C:\Users\User\Documents\antigravity\lucid-heisenberg\src\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any text node containing {{var}} with {"{{var}}"}
content = re.sub(r'>\s*\{\{([a-zA-Z0-9_]+)\}\}\s*<', r'>{"{{\1}}"}<', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
