import os
import re
import datetime
import html
import urllib.parse
import shutil
from collections import defaultdict
from typing import List, Tuple, Dict

class Solution:
    def get_html_title(self, filepath: str) -> str:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
            if match:
                return html.unescape(match.group(1).strip())
            return os.path.basename(filepath)

    def copy_vendor_files(self, output_dir: str) -> None:
        """Copies vendor files from node_modules and local vendor dir to public/vendor."""
        vendor_dir = os.path.join(output_dir, "vendor")
        if not os.path.exists(vendor_dir):
            os.makedirs(vendor_dir)

        # Mapping: Source -> Destination (relative to vendor_dir)
        # Note: We map minified URL requests to unminified files if minified aren't present in node_modules
        file_map = {
            # React
            "node_modules/react/umd/react.production.min.js": "react/react.production.min.js",
            "node_modules/react/umd/react.development.js": "react/react.development.js",
            "node_modules/react-dom/umd/react-dom.production.min.js": "react-dom/react-dom.production.min.js",
            "node_modules/react-dom/umd/react-dom.development.js": "react-dom/react-dom.development.js",
            # Babel
            "node_modules/@babel/standalone/babel.min.js": "babel/babel.min.js",
            # Tailwind (Standalone script downloaded separately)
            "vendor/tailwindcss/script.js": "tailwindcss/script.js",
            # PrismJS
            "node_modules/prismjs/prism.js": "prismjs/prism.js",
            "node_modules/prismjs/themes/prism.css": "prismjs/themes/prism.css",
             # FontAwesome (CSS)
            "node_modules/@fortawesome/fontawesome-free/css/all.min.css": "fontawesome/css/all.min.css",
        }

        # Directory Mapping for Prism Plugins (since individual files are tedious)
        # We will copy specific plugins if needed, or just copy the whole plugins dir?
        # For simplicity and coverage, let's copy specific known plugins used.
        prism_plugins = [
            "node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css",
            "node_modules/prismjs/plugins/line-numbers/prism-line-numbers.js",
            "node_modules/prismjs/plugins/toolbar/prism-toolbar.css",
            "node_modules/prismjs/plugins/toolbar/prism-toolbar.js",
            "node_modules/prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js",
        ]

        prism_langs = [
            'python', 'javascript', 'typescript', 'sql', 'java', 'c', 'cpp', 'csharp', 'bash', 'json', 'clike',
            'css', 'markup', 'go', 'rust', 'ruby', 'swift', 'php'
        ]
        for lang in prism_langs:
            prism_plugins.append(f"node_modules/prismjs/components/prism-{lang}.min.js")

        for src in prism_plugins:
             if os.path.exists(src):
                 rel_path = os.path.relpath(src, "node_modules/prismjs")
                 file_map[src] = f"prismjs/{rel_path}"

        for src, dest_rel in file_map.items():
            if os.path.exists(src):
                dest = os.path.join(vendor_dir, dest_rel)
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                shutil.copy2(src, dest)
                print(f"Copied vendor file: {src} -> {dest}")
            else:
                print(f"Warning: Vendor file not found: {src}")

        # FontAwesome Webfonts (Special case: Directory copy)
        fa_fonts_src = "node_modules/@fortawesome/fontawesome-free/webfonts"
        fa_fonts_dest = os.path.join(vendor_dir, "fontawesome/webfonts")
        if os.path.exists(fa_fonts_src):
            if os.path.exists(fa_fonts_dest):
                shutil.rmtree(fa_fonts_dest)
            shutil.copytree(fa_fonts_src, fa_fonts_dest)
            print(f"Copied FontAwesome webfonts: {fa_fonts_src} -> {fa_fonts_dest}")

    def rewrite_html_content(self, content: str) -> str:
        """
        Rewrite CDN asset URLs in HTML to local /vendor/ paths.

        Replaces known external CDN links (React, Babel, Tailwind, PrismJS, FontAwesome, etc.) with corresponding /vendor/... paths and removes `integrity` and `crossorigin` attributes from `<link>` and `<script>` tags that reference those local vendor files.

        Parameters:
            content (str): HTML document content to rewrite.

        Returns:
            str: The HTML content with matching CDN URLs substituted by local vendor URLs and SRI/crossorigin attributes stripped for vendored assets.
        """
        replacements = [
            # React
            (r'https://unpkg\.com/react@[^/]+/umd/react\.development\.js', '/vendor/react/react.development.js'),
            (r'https://unpkg\.com/react@[^/]+/umd/react\.production\.min\.js', '/vendor/react/react.production.min.js'),
            (r'https://unpkg\.com/react-dom@[^/]+/umd/react-dom\.development\.js', '/vendor/react-dom/react-dom.development.js'),
            (r'https://unpkg\.com/react-dom@[^/]+/umd/react-dom\.production\.min\.js', '/vendor/react-dom/react-dom.production.min.js'),
            # Babel
            (r'https://unpkg\.com/@babel/standalone(?:@[^/]+)?/babel\.min\.js', '/vendor/babel/babel.min.js'),
            (r'https://unpkg\.com/@babel/standalone(?:@[^/]+)?/babel\.js', '/vendor/babel/babel.min.js'),
            # Tailwind
            (r'https://cdn\.tailwindcss\.com(?:@[^/]+)?', '/vendor/tailwindcss/script.js'),
            # PrismJS
            (r'https://cdnjs\.cloudflare\.com/ajax/libs/prism/[^/]+/themes/prism\.min\.css', '/vendor/prismjs/themes/prism.css'),
            (r'https://cdnjs\.cloudflare\.com/ajax/libs/prism/[^/]+/plugins/([a-zA-Z0-9_-]+)/prism-\1\.min\.css', r'/vendor/prismjs/plugins/\1/prism-\1.css'),
             # FontAwesome
            (r'https://cdnjs\.cloudflare\.com/ajax/libs/font-awesome/[^/]+/css/all\.min\.css', '/vendor/fontawesome/css/all.min.css'),
            # jsDelivr generic patterns for Prism JS and CSS (often used interchangeably)
            (r'https://cdn\.jsdelivr\.net/npm/prismjs(?:@[^/]+)?/prism\.min\.js', '/vendor/prismjs/prism.js'),
            (r'https://cdn\.jsdelivr\.net/npm/prismjs(?:@[^/]+)?/components/prism-core\.min\.js', '/vendor/prismjs/prism.js'),
            (r'https://cdn\.jsdelivr\.net/npm/prismjs(?:@[^/]+)?/components/prism-([a-zA-Z0-9_-]+)\.min\.js', r'/vendor/prismjs/components/prism-\1.js'),
            (r'https://cdn\.jsdelivr\.net/npm/prismjs(?:@[^/]+)?/plugins/([a-zA-Z0-9_-]+)/prism-\1\.min\.js', r'/vendor/prismjs/plugins/\1/prism-\1.js'),
            (r'https://cdn\.jsdelivr\.net/npm/prismjs(?:@[^/]+)?/plugins/([a-zA-Z0-9_-]+)/prism-\1\.min\.css', r'/vendor/prismjs/plugins/\1/prism-\1.css'),
            (r'https://cdn\.jsdelivr\.net/npm/prismjs(?:@[^/]+)?/themes/prism(?:-[a-zA-Z0-9_-]+)?\.min\.css', '/vendor/prismjs/themes/prism.css'),
        ]

        for pattern_str, new in replacements:
            content = re.sub(pattern_str, new, content)

        # Strip integrity and crossorigin attributes from tags referencing local /vendor/ files
        def strip_sri(match: re.Match[str]) -> str:
            """
            Remove Subresource Integrity (`integrity`) and `crossorigin` attributes from an HTML <link> or <script> tag if the tag references a `/vendor/` path.

            Parameters:
                match (re.Match): A regex match object whose matched text is the full HTML tag.

            Returns:
                str: The original tag text with `integrity` and `crossorigin` attributes removed when the tag contains `/vendor/`; otherwise the original tag text unchanged.
            """
            tag_text = match.group(0)
            if '/vendor/' in tag_text:
                tag_text = re.sub(r'\s*integrity="[^"]+"', '', tag_text)
                tag_text = re.sub(r'\s*crossorigin="[^"]+"', '', tag_text)
            return tag_text

        content = re.sub(r'<(?:link|script)[^>]+>', strip_sri, content)

        return content

    def generate_index(self) -> None:
        """
        Generate a static index HTML page under the public directory listing repository HTML files grouped by category.

        Scans the repository (excluding common build, VCS, virtualenv and vendor directories), copies required vendor assets into public/vendor, rewrites HTML files to reference local vendored assets, copies those files into the public tree, and produces a themed index at public/index.html with category tabs, search, pagination, per-category icons, total counts, and a UTC generation timestamp. Files in hidden categories (category name starting with '.') or in excluded directories are skipped. If reading or rewriting a file fails, the file is copied as a fallback.
        """
        root_dir = "."
        output_dir = "public"
        index_file = "index.html"

        # Create public directory if it doesn't exist
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        exclude_dirs = {'.git', '.idea', '.vscode', '.venv', 'node_modules', '__pycache__', output_dir, 'vendor'}

        # 1. Copy Vendor Files
        self.copy_vendor_files(output_dir)

        structure: Dict[str, List[Tuple[str, str]]] = defaultdict(list)

        for dirpath, dirnames, filenames in os.walk(root_dir):
            dirnames[:] = [d for d in dirnames if d not in exclude_dirs]

            for filename in filenames:
                if filename.endswith('.html') and filename != index_file:
                    filepath = os.path.join(dirpath, filename)
                    if any(ex in filepath.split(os.sep) for ex in exclude_dirs):
                        continue

                    rel_path = os.path.relpath(filepath, root_dir)
                    dest_path = os.path.join(output_dir, rel_path)

                    os.makedirs(os.path.dirname(dest_path), exist_ok=True)

                    # Read, Rewrite, Write
                    try:
                        with open(filepath, 'r', encoding='utf-8') as f:
                            content = f.read()

                        modified_content = self.rewrite_html_content(content)

                        with open(dest_path, 'w', encoding='utf-8') as f:
                            f.write(modified_content)

                    except Exception as e:
                        print(f"Error processing {filepath}: {e}")
                        # Fallback copy if encoding/read fails (unlikely given check)
                        shutil.copy2(filepath, dest_path)

                    # Indexing Logic
                    parts = rel_path.split(os.sep)
                    if len(parts) > 1:
                        category = parts[0]
                    else:
                        category = "Uncategorized"

                    if category.startswith('.'):
                        continue

                    try:
                        title = self.get_html_title(filepath)
                    except Exception:
                        title = os.path.basename(filepath)

                    # Append disambiguator if 'detailed' is in the filename
                    if 'detailed' in filename.lower():
                        if '(detailed)' not in title.lower():
                            title += ' (detailed)'

                    structure[category].append((title, rel_path))

        # Sort categories and files
        sorted_categories = sorted(structure.keys())
        for cat in structure:
            structure[cat].sort(key=lambda x: x[0])

        # カテゴリアイコンと合計数
        category_icons = {
            'All': '\U0001F30D',
            'Algorithm': '\U0001F9E9',
            'Concurrency': '\u26A1',
            'DataStructures': '\U0001F3D7\uFE0F',
            'JavaScript': '\U0001F4DC',
            'Mathematics': '\U0001F4D0',
            'SQL': '\U0001F5C3\uFE0F',
        }
        total_count = sum(len(v) for v in structure.values())
        domain_count = len(sorted_categories)
        current_time = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

        # HTML Template — "Refined Lab" デザイン
        html_template = """<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Algorithm Study Lab</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}

        :root {{
            --bg-primary: #faf8f5;
            --bg-card: #ffffff;
            --text-primary: #2d3436;
            --text-secondary: #636e72;
            --text-muted: #b2bec3;
            --border-light: #e0dcd7;
            --shadow-color: rgba(0, 0, 0, 0.06);
            --color-all: #6c5ce7;
            --color-algorithm: #0984e3;
            --color-concurrency: #e17055;
            --color-datastructures: #00b894;
            --color-javascript: #f0932b;
            --color-mathematics: #a29bfe;
            --color-sql: #fd79a8;
            --color-all-light: #ede9fe;
            --color-algorithm-light: #dbeafe;
            --color-concurrency-light: #fee2d5;
            --color-datastructures-light: #d1fae5;
            --color-javascript-light: #fef3c7;
            --color-mathematics-light: #e8e5fe;
            --color-sql-light: #fce7f3;
            --radius-sm: 8px;
            --radius-md: 14px;
            --radius-lg: 50px;
            --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }}

        [data-theme="dark"] {{
            --bg-primary: #13111a;
            --bg-card: #1c1a27;
            --text-primary: #e8e6f0;
            --text-secondary: #9b99a9;
            --text-muted: #5c5a6a;
            --border-light: #2e2c3a;
            --shadow-color: rgba(0, 0, 0, 0.4);
            --color-all-light: #2d2654;
            --color-algorithm-light: #0f2a4a;
            --color-concurrency-light: #3a1a10;
            --color-datastructures-light: #0a2e23;
            --color-javascript-light: #3a2a10;
            --color-mathematics-light: #2a2654;
            --color-sql-light: #3a1a2e;
        }}

        body {{
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            max-width: 1280px;
            margin: 0 auto;
            padding: 20px 24px;
            background-color: var(--bg-primary);
            background-image: radial-gradient(circle, var(--border-light) 1px, transparent 1px);
            background-size: 28px 28px;
            min-height: 100vh;
        }}

        /* Theme Toggle */
        .theme-toggle {{
            position: fixed;
            top: 20px;
            right: 20px;
            width: 46px;
            height: 46px;
            border-radius: 50%;
            border: 2px solid var(--border-light);
            background: var(--bg-card);
            cursor: pointer;
            font-size: 1.3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all var(--transition);
            z-index: 100;
            box-shadow: 0 2px 12px var(--shadow-color);
        }}
        .theme-toggle:hover {{
            transform: rotate(20deg) scale(1.1);
            box-shadow: 0 4px 20px var(--shadow-color);
        }}

        /* Header */
        .site-header {{
            text-align: center;
            padding: 48px 20px 32px;
            position: relative;
        }}
        .header-badge {{
            display: inline-block;
            background: linear-gradient(135deg, var(--color-all), #a29bfe);
            color: white;
            padding: 4px 18px;
            border-radius: 20px;
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 14px;
        }}
        .site-title {{
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            font-size: 2.8rem;
            color: var(--text-primary);
            line-height: 1.15;
        }}
        .title-accent {{
            background: linear-gradient(135deg, var(--color-all), var(--color-algorithm));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }}
        .site-subtitle {{
            color: var(--text-secondary);
            font-size: 1rem;
            margin-top: 10px;
            font-weight: 400;
        }}

        /* Search */
        .search-container {{
            max-width: 620px;
            margin: 0 auto 28px;
            position: relative;
            display: flex;
            align-items: center;
        }}
        .search-icon {{
            position: absolute;
            left: 18px;
            font-size: 1.1rem;
            opacity: 0.4;
            pointer-events: none;
        }}
        .search-input {{
            width: 100%;
            padding: 14px 90px 14px 48px;
            border: 2px solid var(--border-light);
            border-radius: var(--radius-lg);
            font-family: 'Outfit', sans-serif;
            font-size: 0.95rem;
            background: var(--bg-card);
            color: var(--text-primary);
            transition: border-color var(--transition), box-shadow var(--transition);
            outline: none;
        }}
        .search-input::placeholder {{ color: var(--text-muted); }}
        .search-input:focus {{
            border-color: var(--color-all);
            box-shadow: 0 0 0 4px var(--color-all-light);
        }}
        .search-count {{
            position: absolute;
            right: 48px;
            font-size: 0.78rem;
            color: var(--text-muted);
            font-weight: 500;
        }}
        .search-clear {{
            position: absolute;
            right: 14px;
            background: none;
            border: none;
            font-size: 1.4rem;
            cursor: pointer;
            color: var(--text-muted);
            padding: 4px 8px;
            border-radius: 50%;
            transition: all 0.2s;
            display: none;
        }}
        .search-clear:hover {{
            color: var(--text-primary);
            background: var(--border-light);
        }}

        /* Tabs */
        .tabs {{
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
            margin-bottom: 28px;
            padding: 0 16px;
        }}
        .tab-button {{
            padding: 10px 20px;
            border: 2px solid var(--border-light);
            background: var(--bg-card);
            cursor: pointer;
            border-radius: var(--radius-lg);
            font-family: 'Outfit', sans-serif;
            font-weight: 600;
            font-size: 0.88rem;
            color: var(--text-secondary);
            transition: all var(--transition);
            display: inline-flex;
            align-items: center;
            gap: 6px;
            white-space: nowrap;
        }}
        .tab-icon {{ font-size: 1.05em; }}
        .tab-count {{
            background: var(--border-light);
            color: var(--text-muted);
            padding: 1px 8px;
            border-radius: 12px;
            font-size: 0.72rem;
            font-weight: 700;
            transition: all var(--transition);
        }}
        .tab-button:hover:not(.active) {{
            border-color: var(--text-muted);
            transform: translateY(-1px);
        }}
        .tab-button.active .tab-count {{
            background: rgba(255,255,255,0.25);
            color: white;
        }}

        /* カテゴリ別アクティブカラー */
        .tab-button[data-category="all"].active {{ background: var(--color-all); color: white; border-color: var(--color-all); box-shadow: 0 4px 16px rgba(108,92,231,0.35); }}
        .tab-button[data-category="algorithm"].active {{ background: var(--color-algorithm); color: white; border-color: var(--color-algorithm); box-shadow: 0 4px 16px rgba(9,132,227,0.35); }}
        .tab-button[data-category="concurrency"].active {{ background: var(--color-concurrency); color: white; border-color: var(--color-concurrency); box-shadow: 0 4px 16px rgba(225,112,85,0.35); }}
        .tab-button[data-category="datastructures"].active {{ background: var(--color-datastructures); color: white; border-color: var(--color-datastructures); box-shadow: 0 4px 16px rgba(0,184,148,0.35); }}
        .tab-button[data-category="javascript"].active {{ background: var(--color-javascript); color: white; border-color: var(--color-javascript); box-shadow: 0 4px 16px rgba(240,147,43,0.35); }}
        .tab-button[data-category="mathematics"].active {{ background: var(--color-mathematics); color: white; border-color: var(--color-mathematics); box-shadow: 0 4px 16px rgba(162,155,254,0.35); }}
        .tab-button[data-category="sql"].active {{ background: var(--color-sql); color: white; border-color: var(--color-sql); box-shadow: 0 4px 16px rgba(253,121,168,0.35); }}

        /* Tab Content */
        .tab-content {{ display: none; }}
        .tab-content.active {{ display: block; }}

        /* Card Grid */
        .file-list {{
            list-style: none;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 16px;
        }}
        .file-item {{
            background: var(--bg-card);
            border-radius: var(--radius-md);
            box-shadow: 0 2px 8px var(--shadow-color);
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid var(--border-light);
            border-left: 4px solid var(--border-light);
            overflow: hidden;
            opacity: 0;
            transform: translateY(16px);
            animation: cardSlideIn 0.4s ease forwards;
        }}
        .file-item[data-category="algorithm"] {{ border-left-color: var(--color-algorithm); }}
        .file-item[data-category="concurrency"] {{ border-left-color: var(--color-concurrency); }}
        .file-item[data-category="datastructures"] {{ border-left-color: var(--color-datastructures); }}
        .file-item[data-category="javascript"] {{ border-left-color: var(--color-javascript); }}
        .file-item[data-category="mathematics"] {{ border-left-color: var(--color-mathematics); }}
        .file-item[data-category="sql"] {{ border-left-color: var(--color-sql); }}

        .file-item:hover {{
            transform: translateY(-4px) scale(1.01);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
        }}
        .file-item[data-category="algorithm"]:hover {{ background: linear-gradient(135deg, var(--color-algorithm-light), var(--bg-card)); }}
        .file-item[data-category="concurrency"]:hover {{ background: linear-gradient(135deg, var(--color-concurrency-light), var(--bg-card)); }}
        .file-item[data-category="datastructures"]:hover {{ background: linear-gradient(135deg, var(--color-datastructures-light), var(--bg-card)); }}
        .file-item[data-category="javascript"]:hover {{ background: linear-gradient(135deg, var(--color-javascript-light), var(--bg-card)); }}
        .file-item[data-category="mathematics"]:hover {{ background: linear-gradient(135deg, var(--color-mathematics-light), var(--bg-card)); }}
        .file-item[data-category="sql"]:hover {{ background: linear-gradient(135deg, var(--color-sql-light), var(--bg-card)); }}

        @keyframes cardSlideIn {{
            from {{ opacity: 0; transform: translateY(16px); }}
            to {{ opacity: 1; transform: translateY(0); }}
        }}

        .file-link {{
            text-decoration: none;
            color: var(--text-primary);
            display: block;
            padding: 16px 18px;
        }}
        .card-header {{
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 6px;
        }}
        .card-icon {{
            font-size: 1.25rem;
            flex-shrink: 0;
            line-height: 1.4;
        }}
        .card-title {{
            font-family: 'Outfit', sans-serif;
            font-weight: 600;
            font-size: 0.92rem;
            line-height: 1.45;
            color: var(--text-primary);
        }}
        .file-path {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            color: var(--text-muted);
            margin-top: 4px;
            display: block;
            word-break: break-all;
            line-height: 1.5;
        }}

        /* Pagination */
        .pagination {{
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
            margin-top: 32px;
            padding-bottom: 24px;
        }}
        .page-button {{
            padding: 8px 14px;
            border: 1px solid var(--border-light);
            background: var(--bg-card);
            cursor: pointer;
            border-radius: 10px;
            color: var(--text-secondary);
            font-family: 'Outfit', sans-serif;
            font-weight: 600;
            font-size: 0.88rem;
            transition: all 0.2s;
        }}
        .page-button.active {{
            background: var(--color-all);
            color: white;
            border-color: var(--color-all);
            box-shadow: 0 2px 8px rgba(108, 92, 231, 0.3);
        }}
        .page-button:hover:not(.active):not(:disabled) {{
            background: var(--color-all-light);
            border-color: var(--color-all);
            color: var(--color-all);
        }}
        .page-button:disabled {{
            opacity: 0.35;
            cursor: not-allowed;
        }}
        .page-ellipsis {{
            color: var(--text-muted);
            font-weight: 600;
            padding: 0 4px;
        }}

        .hidden-item {{ display: none !important; }}

        /* Footer */
        footer {{
            margin-top: 60px;
            text-align: center;
            font-size: 0.82rem;
            color: var(--text-muted);
            border-top: 1px dashed var(--border-light);
            padding: 24px 20px;
        }}
        .footer-icon {{ margin-right: 4px; }}

        /* No Results */
        .no-results {{
            text-align: center;
            padding: 60px 20px;
            color: var(--text-muted);
            font-size: 1.1rem;
            display: none;
        }}
        .no-results-icon {{ font-size: 2.5rem; display: block; margin-bottom: 12px; }}

        /* Responsive */
        @media (max-width: 768px) {{
            .site-title {{ font-size: 2rem; }}
            .file-list {{ grid-template-columns: 1fr; gap: 12px; }}
            .tabs {{ gap: 6px; }}
            .tab-button {{ padding: 8px 14px; font-size: 0.8rem; }}
            .search-input {{ padding: 12px 80px 12px 42px; font-size: 0.9rem; }}
            .theme-toggle {{ top: 12px; right: 12px; width: 40px; height: 40px; font-size: 1.1rem; }}
        }}
        @media (max-width: 480px) {{
            body {{ padding: 12px; }}
            .site-title {{ font-size: 1.6rem; }}
            .site-header {{ padding: 36px 12px 24px; }}
            .tab-button {{ padding: 6px 10px; font-size: 0.75rem; }}
            .tab-count {{ display: none; }}
            .file-list {{ grid-template-columns: 1fr; }}
        }}
    </style>
</head>
<body>
    <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode">
        <span id="themeIcon">\u263E</span>
    </button>

    <header class="site-header">
        <div class="header-badge">Lab</div>
        <h1 class="site-title">
            🧪 Algorithm Study
            <span class="title-accent">Index</span>
        </h1>
        <p class="site-subtitle">{total_count} interactive lessons across {domain_count} domains</p>
    </header>

    <div class="search-container">
        <span class="search-icon">🔍</span>
        <input type="text" id="searchInput" class="search-input"
               placeholder="Search problems... (e.g. Binary Search, DP, LeetCode 91)"
               aria-label="Search problems"
               autocomplete="off">
        <span id="searchCount" class="search-count"></span>
        <button id="searchClear" class="search-clear" aria-label="Clear search">&times;</button>
    </div>

    <div class="tabs" id="categoryTabs">
        <button class="tab-button active" data-category="all" data-tab-target="All">
            <span class="tab-icon">🌍</span> All <span class="tab-count">{total_count}</span>
        </button>
        {tabs}
    </div>

    <div id="All" class="tab-content active">
        <ul class="file-list">
            {all_files}
        </ul>
        <div class="no-results"><span class="no-results-icon">\U0001F50E</span>No results found</div>
    </div>

    {tab_contents}

    <footer>
        <span class="footer-icon">\U0001F9EA</span>
        Generated on {timestamp}
    </footer>

    <script>
        const ITEMS_PER_PAGE = 12;
        let currentPages = {{}};

        /* Pagination */
        function initPagination() {{
            document.querySelectorAll('.tab-content').forEach(tab => {{
                currentPages[tab.id] = 1;
                renderPage(tab.id);
            }});
        }}

        function renderPage(tabId) {{
            const tab = document.getElementById(tabId);
            const allItems = Array.from(tab.querySelectorAll('.file-item'));
            const items = allItems.filter(item => item.dataset.searchHidden !== 'true');
            const hiddenBySearch = allItems.filter(item => item.dataset.searchHidden === 'true');

            hiddenBySearch.forEach(item => item.classList.add('hidden-item'));

            const totalItems = items.length;
            const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
            const currentPage = Math.min(currentPages[tabId] || 1, totalPages);
            currentPages[tabId] = currentPage;

            items.forEach((item, index) => {{
                const start = (currentPage - 1) * ITEMS_PER_PAGE;
                const end = start + ITEMS_PER_PAGE;
                if (index >= start && index < end) {{
                    item.classList.remove('hidden-item');
                }} else {{
                    item.classList.add('hidden-item');
                }}
            }});

            const noResults = tab.querySelector('.no-results');
            if (noResults) {{
                noResults.style.display = totalItems === 0 ? 'block' : 'none';
            }}

            renderPaginationControls(tabId, totalPages, currentPage);
            applyStaggerAnimation(tabId);
        }}

        function renderPaginationControls(tabId, totalPages, currentPage) {{
            const tab = document.getElementById(tabId);
            const existing = tab.querySelector('.pagination');

            if (totalPages <= 1) {{
                if (existing) existing.remove();
                return;
            }}

            const container = existing || document.createElement('div');
            if (!existing) {{
                container.className = 'pagination';
                tab.appendChild(container);
            }}
            while (container.firstChild) container.removeChild(container.firstChild);

            const prevBtn = document.createElement('button');
            prevBtn.className = 'page-button';
            prevBtn.textContent = '\u00AB Prev';
            prevBtn.disabled = currentPage === 1;
            prevBtn.onclick = () => {{ currentPages[tabId]--; renderPage(tabId); window.scrollTo({{ top: 0, behavior: 'smooth' }}); }};
            container.appendChild(prevBtn);

            for (let i = 1; i <= totalPages; i++) {{
                if (totalPages > 7) {{
                    if (i !== 1 && i !== totalPages && Math.abs(i - currentPage) > 1) {{
                        if (i === 2 || i === totalPages - 1) {{
                            const el = document.createElement('span');
                            el.className = 'page-ellipsis';
                            el.textContent = '...';
                            container.appendChild(el);
                        }}
                        continue;
                    }}
                }}
                const btn = document.createElement('button');
                btn.className = 'page-button';
                btn.textContent = i;
                if (i === currentPage) btn.classList.add('active');
                btn.onclick = () => {{ currentPages[tabId] = i; renderPage(tabId); window.scrollTo({{ top: 0, behavior: 'smooth' }}); }};
                container.appendChild(btn);
            }}

            const nextBtn = document.createElement('button');
            nextBtn.className = 'page-button';
            nextBtn.textContent = 'Next \u00BB';
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.onclick = () => {{ currentPages[tabId]++; renderPage(tabId); window.scrollTo({{ top: 0, behavior: 'smooth' }}); }};
            container.appendChild(nextBtn);
        }}

        /* Stagger Animation */
        function applyStaggerAnimation(tabId) {{
            const tab = document.getElementById(tabId);
            const items = tab.querySelectorAll('.file-item:not(.hidden-item)');
            items.forEach(item => {{ item.style.animation = 'none'; }});
            tab.offsetHeight;
            items.forEach((item, i) => {{
                item.style.animation = '';
                item.style.animationDelay = (i * 0.04) + 's';
            }});
        }}

        /* Tab Navigation */
        function openTab(categoryName) {{
            document.querySelectorAll('.tab-content').forEach(tc => {{
                tc.style.display = 'none';
                tc.classList.remove('active');
            }});
            document.querySelectorAll('.tab-button').forEach(tb => {{
                tb.classList.remove('active');
            }});

            const target = document.getElementById(categoryName);
            target.style.display = 'block';
            target.classList.add('active');
            const btn = document.querySelector('.tab-button[data-tab-target="' + categoryName + '"]');
            if (btn) btn.classList.add('active');

            const input = document.getElementById('searchInput');
            if (input.value) {{
                input.value = '';
                document.getElementById('searchClear').style.display = 'none';
                document.getElementById('searchCount').textContent = '';
                document.querySelectorAll('.tab-content').forEach(tc => {{
                    clearSearchFilter(tc.id);
                }});
            }}

            currentPages[categoryName] = currentPages[categoryName] || 1;
            renderPage(categoryName);
        }}

        function clearSearchFilter(tabId) {{
            const tab = document.getElementById(tabId);
            tab.querySelectorAll('.file-item').forEach(item => {{
                delete item.dataset.searchHidden;
            }});
        }}

        /* Search */
        function initSearch() {{
            const input = document.getElementById('searchInput');
            const clearBtn = document.getElementById('searchClear');
            const countEl = document.getElementById('searchCount');
            let debounceTimer;

            input.addEventListener('input', () => {{
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => filterCards(input.value), 150);
                clearBtn.style.display = input.value ? 'block' : 'none';
            }});

            clearBtn.addEventListener('click', () => {{
                input.value = '';
                clearBtn.style.display = 'none';
                countEl.textContent = '';
                const activeTab = document.querySelector('.tab-content.active');
                if (activeTab) {{
                    clearSearchFilter(activeTab.id);
                    currentPages[activeTab.id] = 1;
                    renderPage(activeTab.id);
                }}
            }});

            function filterCards(query) {{
                const q = query.toLowerCase().trim();
                const activeTab = document.querySelector('.tab-content.active');
                if (!activeTab) return;

                const items = activeTab.querySelectorAll('.file-item');
                let visible = 0;

                items.forEach(item => {{
                    const text = item.textContent.toLowerCase();
                    const match = !q || text.includes(q);
                    if (match) {{
                        delete item.dataset.searchHidden;
                        visible++;
                    }} else {{
                        item.dataset.searchHidden = 'true';
                    }}
                }});

                countEl.textContent = q ? visible + ' found' : '';
                currentPages[activeTab.id] = 1;
                renderPage(activeTab.id);
            }}
        }}

        /* Dark Mode */
        function initTheme() {{
            const toggle = document.getElementById('themeToggle');
            const icon = document.getElementById('themeIcon');
            const saved = localStorage.getItem('algo-study-theme');

            if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {{
                document.documentElement.setAttribute('data-theme', 'dark');
                icon.textContent = '\u2600';
            }}

            toggle.addEventListener('click', () => {{
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                const next = isDark ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                icon.textContent = next === 'dark' ? '\u2600' : '\u263E';
                localStorage.setItem('algo-study-theme', next);
            }});
        }}

        /* Tab Delegation */
        function initTabs() {{
            document.getElementById('categoryTabs').addEventListener('click', (evt) => {{
                const btn = evt.target.closest('.tab-button');
                if (btn && btn.dataset.tabTarget) {{
                    openTab(btn.dataset.tabTarget);
                }}
            }});
        }}

        /* Init */
        window.addEventListener('DOMContentLoaded', () => {{
            initTheme();
            initTabs();
            initPagination();
            initSearch();
        }});
    </script>
</body>
</html>"""

        # HTML生成
        tabs_html = ""
        tab_contents_html = ""
        all_files_html = ""

        def render_category_files(structure, sorted_categories):
            """
            Builds HTML fragments for category tabs, per-category file lists, and an aggregated all-files list.

            Parameters:
                structure (Dict[str, List[Tuple[str, str]]]): Mapping from category name to a list of (title, relative_path) pairs for files in that category.
                sorted_categories (List[str]): Ordered list of category names to render; determines the iteration order and tab order.

            Returns:
                Tuple[str, str, str]: A 3-tuple with:
                    - tabs_html: HTML for the category tab buttons (includes icon and item count for each category).
                    - tab_contents_html: HTML sections for each category containing the per-category file lists and a "no results" placeholder.
                    - all_files_html: Aggregated HTML list of all file items across all categories.
            """
            tabs_html_list = []
            files_html_sections = []
            all_files_html_list = [] # Renamed to avoid conflict with outer scope all_files_html

            for category in sorted_categories:
                files = structure[category]
                css_cat = html.escape(category.lower(), quote=True)
                safe_category = html.escape(category, quote=True)
                icon = category_icons.get(category, '📁') # Default icon if not found

                tabs_html_list.append(f'<button class="tab-button" data-category="{css_cat}" data-tab-target="{safe_category}">'
                                      f'<span class="tab-icon">{icon}</span> {safe_category} '
                                      f'<span class="tab-count">{len(files)}</span></button>\n')

                file_list_html = '<ul class="file-list">\n'
                category_files = []
                for title, path in files:
                    encoded_path = urllib.parse.quote(path)
                    # Use standard GitHub-style path (assuming 'path' is already relative or suitable)
                    github_path = path # Assuming 'path' is already the desired relative path
                    safe_title = html.escape(title)
                    safe_github_path = html.escape(github_path) # Escape path for display

                    safe_encoded_path = html.escape(encoded_path, quote=True)
                    item_html = f'<li class="file-item" data-category="{css_cat}"><a class="file-link" href="{safe_encoded_path}">' \
                                f'<span class="card-header"><span class="card-icon">{icon}</span>' \
                                f'<span class="card-title">{safe_title}</span></span><span class="file-path">{safe_github_path}</span></a></li>\n'
                    category_files.append(item_html)
                    all_files_html_list.append(item_html) # Add to the list for all files
                file_list_html += ''.join(category_files) + '</ul>'

                files_html_sections.append(f'<div id="{safe_category}" class="tab-content">\n{file_list_html}\n<div class="no-results"><span class="no-results-icon">\U0001F50E</span>No results found</div>\n</div>\n')

            return ''.join(tabs_html_list), ''.join(files_html_sections), ''.join(all_files_html_list)

        # Call the new function
        tabs_html, tab_contents_html, all_files_html = render_category_files(structure, sorted_categories)

        final_html = html_template.format(
            tabs=tabs_html,
            all_files=all_files_html,
            tab_contents=tab_contents_html,
            timestamp=current_time,
            total_count=total_count,
            domain_count=domain_count,
        )

        output_index_path = os.path.join(output_dir, index_file)
        with open(output_index_path, 'w', encoding='utf-8') as f:
            f.write(final_html)

        print(f"Successfully updated {output_index_path} with vendored assets at {current_time}")

if __name__ == "__main__":
    Solution().generate_index()
