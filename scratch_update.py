import os

frontend_dir = r'c:\Users\Admin\Desktop\Soil\frontend\src'

replacements = {
    r'pages\Login.jsx': [
        ("'http://localhost:5005'", "'https://krishimitra-backend-wrc0.onrender.com'")
    ],
    r'pages\Insights.jsx': [
        ("'http://localhost:5005'", "'https://krishimitra-backend-wrc0.onrender.com'")
    ],
    r'pages\History.jsx': [
        ("'http://localhost:5005'", "'https://krishimitra-backend-wrc0.onrender.com'")
    ],
    r'pages\Communication.jsx': [
        ("'http://localhost:5005'", "'https://krishimitra-backend-wrc0.onrender.com'")
    ],
    r'pages\Analyze.jsx': [
        ("'http://localhost:5005'", "'https://krishimitra-backend-wrc0.onrender.com'")
    ],
    r'components\AIChatbot.jsx': [
        ("'http://localhost:5005'", "'https://krishimitra-backend-wrc0.onrender.com'")
    ]
}

for rel_path, reps in replacements.items():
    file_path = os.path.join(frontend_dir, rel_path)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for old, new in reps:
            content = content.replace(old, new)
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed {rel_path}')
