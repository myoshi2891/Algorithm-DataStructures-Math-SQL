import hashlib
import requests
import base64

urls = [
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.css",
    "https://cdn.tailwindcss.com/3.4.1"
]

for url in urls:
    try:
        response = requests.get(url)
        content = response.content
        hash_obj = hashlib.sha384(content)
        base64_hash = base64.b64encode(hash_obj.digest()).decode('utf-8')
        print(f"URL: {url}")
        print(f"SRI: sha384-{base64_hash}")
        print("-" * 20)
    except Exception as e:
        print(f"Error fetching {url}: {e}")
