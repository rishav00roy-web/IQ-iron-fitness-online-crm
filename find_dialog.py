path = r'C:\Users\User\Documents\antigravity\lucid-heisenberg\src\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'id="modal' in line or 'className="dialog"' in line or 'dialog-overlay' in line:
        print(f'Line {i+1}: {line.strip()}')
