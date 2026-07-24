import re
import os

with open('src/components/InvoiceTemplate.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We will regex replace the class names with class names + inline styles
replacements = {
    'className="relative bg-gradient-to-r from-[#031d4f] via-[#0b337c] to-[#031d4f]': 'style={{ background: "linear-gradient(to right, #031d4f, #0b337c, #031d4f)" }} className="relative bg-blue-900',
    'className="w-32 h-40 bg-gradient-to-b from-slate-200 to-slate-400': 'style={{ background: "linear-gradient(to bottom, #e2e8f0, #94a3b8)" }} className="w-32 h-40',
    'className="w-full h-full bg-[#0a2357]': 'style={{ backgroundColor: "#0a2357" }} className="w-full h-full',
    'className="text-[#93c5fd]': 'style={{ color: "#93c5fd" }} className="',
    'className="bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700': 'style={{ background: "linear-gradient(to right, #1d4ed8, #3b82f6, #1d4ed8)" }} className="',
    'className="w-12 h-12 rounded-full bg-[#0d2a6a]': 'style={{ backgroundColor: "#0d2a6a" }} className="w-12 h-12 rounded-full',
    'className="text-xs font-bold text-[#0d2a6a]': 'style={{ color: "#0d2a6a" }} className="text-xs font-bold',
    'className="bg-[#0b337c] px-4 py-2': 'style={{ backgroundColor: "#0b337c" }} className="px-4 py-2',
    'className="bg-[#12429a] text-white': 'style={{ backgroundColor: "#12429a", color: "white" }} className="',
    'className="col-span-3 font-bold text-[#0d2a6a]': 'style={{ color: "#0d2a6a" }} className="col-span-3 font-bold',
    'className="text-2xl font-black text-[#0d2a6a]': 'style={{ color: "#0d2a6a" }} className="text-2xl font-black',
    'className="text-[#16a34a] font-bold"': 'style={{ color: "#16a34a" }} className="font-bold"',
    'className="text-xs font-bold text-[#16a34a]': 'style={{ color: "#16a34a" }} className="text-xs font-bold',
    'className="text-3xl font-black text-[#16a34a]': 'style={{ color: "#16a34a" }} className="text-3xl font-black',
    'className="text-[#ea580c] font-bold"': 'style={{ color: "#ea580c" }} className="font-bold"',
    'className="text-xs font-bold text-[#ea580c]': 'style={{ color: "#ea580c" }} className="text-xs font-bold',
    'className="text-3xl font-black text-[#ea580c]': 'style={{ color: "#ea580c" }} className="text-3xl font-black',
    'className="w-4 h-4 text-[#0d2a6a]"': 'style={{ color: "#0d2a6a" }} className="w-4 h-4"',
    'className="font-bold text-[#0d2a6a]': 'style={{ color: "#0d2a6a" }} className="font-bold',
    'className="text-[10px] font-bold text-[#0d2a6a]': 'style={{ color: "#0d2a6a" }} className="text-[10px] font-bold',
    'className="bg-gradient-to-r from-[#031d4f] via-[#0b337c] to-[#031d4f] py-4': 'style={{ background: "linear-gradient(to right, #031d4f, #0b337c, #031d4f)" }} className="py-4 bg-blue-900',
    'className="w-[1000px] bg-white': 'style={{ backgroundColor: "#ffffff" }} className="w-[1000px]',
    'className="bg-white font-sans text-neutral-800"': 'className="font-sans text-neutral-800" style={{ backgroundColor: "#ffffff" }}',
    'className="p-8 relative z-10 space-y-6"': 'className="p-8 relative z-10 space-y-6" style={{ backgroundColor: "#ffffff" }}',
}

for k, v in replacements.items():
    content = content.replace(k, v)

# Update statusBg logic
content = content.replace("let statusBg = 'bg-[#fb923c]';", "let statusBg = 'bg-[#fb923c]';\n  let statusColor = '#fb923c';")
content = content.replace("statusBg = 'bg-[#16a34a]';", "statusBg = 'bg-[#16a34a]'; statusColor = '#16a34a';")
content = content.replace("statusBg = 'bg-[#dc2626]';", "statusBg = 'bg-[#dc2626]'; statusColor = '#dc2626';")
content = content.replace("className={`\\${statusBg} text-white", "style={{ backgroundColor: statusColor }} className={`text-white")

with open('src/components/InvoiceTemplate.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
