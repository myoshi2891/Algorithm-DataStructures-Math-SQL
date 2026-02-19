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
        """Replaces CDN links with local vendor links."""
        replacements = [
            # React
            ('https://unpkg.com/react@18/umd/react.development.js', '/vendor/react/react.development.js'),
            ('https://unpkg.com/react@18/umd/react.production.min.js', '/vendor/react/react.production.min.js'),
            ('https://unpkg.com/react-dom@18/umd/react-dom.development.js', '/vendor/react-dom/react-dom.development.js'),
            ('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', '/vendor/react-dom/react-dom.production.min.js'),
            # Babel
            ('https://unpkg.com/@babel/standalone/babel.min.js', '/vendor/babel/babel.min.js'),
            ('https://unpkg.com/@babel/standalone/babel.js', '/vendor/babel/babel.min.js'),
            # Tailwind
            ('https://cdn.tailwindcss.com', '/vendor/tailwindcss/script.js'),
            # PrismJS
            # Handle minified vs unminified mapping. Node modules usually has unminified.
            # We map the CDN .min.css requests to our local .css files (which we copied from node_modules)
            ('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css', '/vendor/prismjs/themes/prism.css'),
            ('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css', '/vendor/prismjs/plugins/line-numbers/prism-line-numbers.css'),
            ('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.css', '/vendor/prismjs/plugins/toolbar/prism-toolbar.css'),
             # FontAwesome
            ('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', '/vendor/fontawesome/css/all.min.css'),
        ]

        for old, new in replacements:
            content = content.replace(old, new)

        return content

    def generate_index(self) -> None:
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

                    title = self.get_html_title(filepath)
                    structure[category].append((title, rel_path))

        # Sort categories and files
        sorted_categories = sorted(structure.keys())
        for cat in structure:
            structure[cat].sort(key=lambda x: x[0])

        current_time = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

        # HTML Template
        html_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Algorithm Study Index</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; max-width: 1200px; margin: 0 auto; padding: 20px; background-color: #f5f5f7; }}
        h1 {{ text-align: center; color: #2c3e50; margin-bottom: 30px; }}
        .tabs {{ display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 20px; }}
        .tab-button {{ padding: 10px 20px; border: none; background: #e0e0e0; cursor: pointer; border-radius: 5px; font-weight: 500; font-size: 16px; transition: all 0.3s ease; }}
        .tab-button.active {{ background: #007bff; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }}
        .tab-button:hover:not(.active) {{ background: #d0d0d0; }}
        .tab-content {{ display: none; animation: fadeIn 0.5s; }}
        .tab-content.active {{ display: block; }}
        @keyframes fadeIn {{ from {{ opacity: 0; }} to {{ opacity: 1; }} }}
        .file-list {{ list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; }}
        .file-item {{ background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: transform 0.2s; padding: 15px; border: 1px solid #eee; }}
        .file-item:hover {{ transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-color: #007bff; }}
        .file-link {{ text-decoration: none; color: #2c3e50; font-weight: 500; display: block; }}
        .file-path {{ font-size: 0.8em; color: #7f8c8d; margin-top: 5px; display: block; word-break: break-all; }}
        footer {{ margin-top: 50px; text-align: center; font-size: 0.9em; color: #777; border-top: 1px solid #ddd; padding-top: 20px; }}
    </style>
</head>
<body>
    <h1>Algorithm Study Index</h1>

    <div class="tabs" id="categoryTabs">
        <button class="tab-button active" onclick="openTab(event, 'All')">All</button>
        {tabs}
    </div>

    <div id="All" class="tab-content active">
        <ul class="file-list">
            {all_files}
        </ul>
    </div>

    {tab_contents}

    <footer>
        Generated on {timestamp}
    </footer>

    <script>
        function openTab(evt, categoryName) {{
            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tab-content");
            for (i = 0; i < tabcontent.length; i++) {{
                tabcontent[i].style.display = "none";
                tabcontent[i].classList.remove("active");
            }}
            tablinks = document.getElementsByClassName("tab-button");
            for (i = 0; i < tablinks.length; i++) {{
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }}
            document.getElementById(categoryName).style.display = "block";
            document.getElementById(categoryName).classList.add("active");
            evt.currentTarget.className += " active";
        }}
    </script>
</body>
</html>"""

        tabs_html = ""
        tab_contents_html = ""
        all_files_html = ""

        for category in sorted_categories:
            files = structure[category]
            count = len(files)
            tabs_html += f'<button class="tab-button" onclick="openTab(event, \'{category}\')">{category} ({count})</button>\n'

            file_list_html = '<ul class="file-list">\n'
            for title, path in files:
                # Use urllib.parse.quote to handle spaces and special chars in URL
                encoded_path = urllib.parse.quote(path)
                item_html = f'<li class="file-item"><a class="file-link" href="{encoded_path}">{title}<span class="file-path">{path}</span></a></li>\n'
                file_list_html += item_html
                all_files_html += item_html
            file_list_html += '</ul>'

            tab_contents_html += f'<div id="{category}" class="tab-content">\n{file_list_html}\n</div>\n'

        final_html = html_template.format(
            tabs=tabs_html,
            all_files=all_files_html,
            tab_contents=tab_contents_html,
            timestamp=current_time
        )

        output_index_path = os.path.join(output_dir, index_file)
        with open(output_index_path, 'w', encoding='utf-8') as f:
            f.write(final_html)

        print(f"Successfully updated {output_index_path} with vendored assets at {current_time}")

if __name__ == "__main__":
    Solution().generate_index()
