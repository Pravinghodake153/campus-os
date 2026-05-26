import os
import re

directory = 'apps/mobile-app'

# Color mappings from dark to light
color_map = {
    r'#0f1117': '#f9fafb', # main bg
    r'#1e293b': '#ffffff', # card bg
    r'#334155': '#e5e7eb', # borders / subdued bg
    r'#ffffff': '#111827', # primary text
    r'#9ca3af': '#6b7280', # secondary text
    r'#cbd5e1': '#4b5563', # another text gray
    r'rgba\(255,\s*255,\s*255,\s*0\.05\)': 'rgba(0,0,0,0.05)',
    r'rgba\(255,\s*255,\s*255,\s*0\.1\)': 'rgba(0,0,0,0.1)',
}

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            original_content = content
            
            # Replace dark mode colors
            for dark, light in color_map.items():
                content = re.sub(dark, light, content, flags=re.IGNORECASE)
                
            # Replace style="light" with style="dark" in StatusBars
            content = content.replace('style="light"', 'style="dark"')
            
            # Fix button text that was '#ffffff' but got replaced by '#111827'
            # Usually buttons have `color: '#ffffff'` and they are on blue background
            # If we find `color: '#111827'` inside a button or header, we might have an issue, but let's do it manually if needed.
            
            if original_content != content:
                with open(filepath, 'w') as f:
                    f.write(content)
                print(f"Updated {filepath}")
