import os

replacements = {
    r'c:\Users\Admin\Desktop\Soil\frontend\src\pages\Communication.jsx': [
        (
            "axios.post(`${import.meta.env.VITE_API_URL || 'https://krishimitra-backend-wrc0.onrender.com'}/api/send-sms', {",
            "axios.post(`${import.meta.env.VITE_API_URL || 'https://krishimitra-backend-wrc0.onrender.com'}/api/send-sms`, {"
        ),
        (
            "axios.post(`${import.meta.env.VITE_API_URL || 'https://krishimitra-backend-wrc0.onrender.com'}/api/chat', {",
            "axios.post(`${import.meta.env.VITE_API_URL || 'https://krishimitra-backend-wrc0.onrender.com'}/api/chat`, {"
        ),
        (
            "showToast(`✅ SMS sent successfully!",
            "showToast(`Success: SMS sent successfully!"
        )
    ],
    r'c:\Users\Admin\Desktop\Soil\frontend\src\pages\Analyze.jsx': [
        (
            "axios.post(`${import.meta.env.VITE_API_URL || 'https://krishimitra-backend-wrc0.onrender.com'}/predict', formData);",
            "axios.post(`${import.meta.env.VITE_API_URL || 'https://krishimitra-backend-wrc0.onrender.com'}/predict`, formData);"
        )
    ],
    r'c:\Users\Admin\Desktop\Soil\frontend\src\components\AIChatbot.jsx': [
        (
            "axios.post(`${import.meta.env.VITE_API_URL || 'https://krishimitra-backend-wrc0.onrender.com'}/api/chat', {",
            "axios.post(`${import.meta.env.VITE_API_URL || 'https://krishimitra-backend-wrc0.onrender.com'}/api/chat`, {"
        )
    ]
}

for file_path, reps in replacements.items():
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for old, new in reps:
            content = content.replace(old, new)
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed {file_path}')
