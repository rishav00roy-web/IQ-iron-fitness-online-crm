import re
import os

path = r'C:\Users\User\Documents\antigravity\lucid-heisenberg\src\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

components_dir = r'C:\Users\User\Documents\antigravity\lucid-heisenberg\src\components'

dialogs_content = re.findall(r'<dialog.*?</dialog>', content, re.DOTALL)
if dialogs_content:
    file_path = os.path.join(components_dir, 'Dialogs.tsx')
    code = f'''import React from "react";

export default function Dialogs() {{
  return (
    <>
      {chr(10).join(dialogs_content)}
    </>
  );
}}
'''
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print('Created Dialogs.tsx')
