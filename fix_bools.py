import re

path = r'C:\Users\User\Documents\antigravity\lucid-heisenberg\src\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('noValidate=""', 'noValidate')
content = content.replace('readOnly=""', 'readOnly')
content = content.replace('autoFocus=""', 'autoFocus')
content = content.replace('required=""', 'required')
content = content.replace('checked=""', 'defaultChecked')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
