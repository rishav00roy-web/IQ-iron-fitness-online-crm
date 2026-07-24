import re
import os

path = r'C:\Users\User\Documents\antigravity\lucid-heisenberg\src\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# We know Header is from {/*  Header  */} up to {/*  Metrics  */}
header_match = re.search(r'\{\/\*\s*Header\s*\*\/\}(.*?)\{\/\*\s*Metrics\s*\*\/\}', content, re.DOTALL)
metrics_match = re.search(r'\{\/\*\s*Metrics\s*\*\/\}(.*?)\{\/\*\s*Table Panel\s*\*\/\}', content, re.DOTALL)
# Table Panel goes up to the first <dialog>
table_panel_match = re.search(r'\{\/\*\s*Table Panel\s*\*\/\}(.*?)<dialog id="dialog-add">', content, re.DOTALL)
# Dialogs go from first <dialog> to the end of the return statement
dialogs_match = re.search(r'(<dialog id="dialog-add">.*?</dialog>\s*</div>\s*</>\s*\)\s*;\s*\})', content, re.DOTALL)

components_dir = r'C:\Users\User\Documents\antigravity\lucid-heisenberg\src\components'
os.makedirs(components_dir, exist_ok=True)

def write_component(name, jsx_content):
    if not jsx_content:
        print(f"Failed to extract {name}")
        return
    file_path = os.path.join(components_dir, f'{name}.tsx')
    code = f'''import React from "react";

export default function {name}() {{
  return (
    <>
      {jsx_content.strip()}
    </>
  );
}}
'''
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"Created {name}.tsx")

if header_match:
    write_component('Header', header_match.group(1))
if metrics_match:
    write_component('Metrics', metrics_match.group(1))
if table_panel_match:
    write_component('TablePanel', table_panel_match.group(1))

# For dialogs, we need to extract only the dialog tags, wait, dialogs_match captures the end tags too.
if dialogs_match:
    # let's just find all <dialog>...</dialog> blocks
    dialogs_content = re.findall(r'<dialog.*?</dialog>', content, re.DOTALL)
    if dialogs_content:
        write_component('Dialogs', '\n'.join(dialogs_content))

