import re

def process_file():
    with open('src/components/InvoiceTemplate.tsx', 'r') as f:
        content = f.read()

    # The goal is to strip Tailwind v4 background and text color classes and replace them with standard inline styles
    # Because html2canvas does not support Tailwind v4's oklch/color-mix CSS outputs.
    
    # Let's just find every element with a color and add a style attribute.
    # It's easier to just do manual string replacements for this specific file since we know exactly what is there.
    replacements = [
        ('className="bg-white', 'style={{ backgroundColor: "#ffffff" }} className="bg-white'),
        ('className="w-[1000px] bg-white', 'style={{ backgroundColor: "#ffffff" }} className="w-[1000px] bg-white'),
        ('bg-gradient-to-r from-[#031d4f] via-[#0b337c] to-[#031d4f]', 'bg-blue-900" style={{ background: "linear-gradient(to right, #031d4f, #0b337c, #031d4f)" }} className="'),
        ('bg-gradient-to-b from-slate-200 to-slate-400', 'bg-slate-300" style={{ background: "linear-gradient(to bottom, #e2e8f0, #94a3b8)" }} className="'),
        ('bg-[#0a2357]', 'bg-blue-900" style={{ backgroundColor: "#0a2357" }} className="'),
        ('bg-[#0b337c]', 'bg-blue-800" style={{ backgroundColor: "#0b337c" }} className="'),
        ('bg-[#12429a]', 'bg-blue-700" style={{ backgroundColor: "#12429a" }} className="'),
        ('bg-[#0d2a6a]', 'bg-blue-900" style={{ backgroundColor: "#0d2a6a" }} className="'),
        ('text-[#0d2a6a]', 'text-blue-900" style={{ color: "#0d2a6a" }} className="'),
        ('text-slate-200', 'text-slate-200" style={{ color: "#e2e8f0" }} className="'),
        ('text-white', 'text-white" style={{ color: "#ffffff" }} className="'),
        ('text-slate-400', 'text-slate-400" style={{ color: "#94a3b8" }} className="'),
        ('text-[#93c5fd]', 'text-blue-300" style={{ color: "#93c5fd" }} className="'),
        ('bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700', 'bg-blue-600" style={{ background: "linear-gradient(to right, #1d4ed8, #3b82f6, #1d4ed8)" }} className="'),
        ('text-slate-800', 'text-slate-800" style={{ color: "#1e293b" }} className="'),
        ('text-slate-600', 'text-slate-600" style={{ color: "#475569" }} className="'),
        ('text-slate-500', 'text-slate-500" style={{ color: "#64748b" }} className="'),
        ('text-[#16a34a]', 'text-green-600" style={{ color: "#16a34a" }} className="'),
        ('text-[#ea580c]', 'text-orange-600" style={{ color: "#ea580c" }} className="'),
        ('bg-slate-50', 'bg-slate-50" style={{ backgroundColor: "#f8fafc" }} className="'),
        ('border-[#e6eaf3]', 'border-slate-200" style={{ borderColor: "#e6eaf3" }} className="'),
        ('bg-white/80', 'bg-white" style={{ backgroundColor: "rgba(255,255,255,0.8)" }} className="'),
        ('bg-white/90', 'bg-white" style={{ backgroundColor: "rgba(255,255,255,0.9)" }} className="'),
        ('bg-green-50/50', 'bg-green-50" style={{ backgroundColor: "rgba(240,253,244,0.5)" }} className="'),
        ('bg-orange-50/50', 'bg-orange-50" style={{ backgroundColor: "rgba(255,247,237,0.5)" }} className="'),
        ('bg-[#16a34a]', 'bg-green-600" style={{ backgroundColor: "#16a34a" }} className="'),
        ('bg-[#fb923c]', 'bg-orange-400" style={{ backgroundColor: "#fb923c" }} className="'),
        ('bg-[#dc2626]', 'bg-red-600" style={{ backgroundColor: "#dc2626" }} className="'),
        
        # Fixing className=" to make sure styles aren't duplicated awkwardly
    ]
    
    # A cleaner approach is to rewrite the component using React inline styles for ALL layout colors
    # Actually, let's just write a script that injects style objects.
    pass

process_file()
