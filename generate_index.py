import os
import re
import datetime
from collections import defaultdict
from html import escape

def get_html_title(filepath):
    """Extracts the title from an HTML file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
            if match:
                return match.group(1).strip()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
    return os.path.basename(filepath)

def generate_index():
    root_dir = "."
    index_file = "index.html"

    # Exclude these directories
    exclude_dirs = {'.git', '.idea', '.vscode', '.venv', 'node_modules', '__pycache__'}

    structure = defaultdict(list)

    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Modify dirnames in-place to exclude directories
        dirnames[:] = [d for d in dirnames if d not in exclude_dirs]

        for filename in filenames:
            if filename.endswith('.html') and filename != index_file:
                filepath = os.path.join(dirpath, filename)
                # Skip if file is in an excluded directory path (double check)
                if any(ex in filepath.split(os.sep) for ex in exclude_dirs):
                    continue

                rel_path = os.path.relpath(filepath, root_dir)

                # Determine category (top-level directory)
                parts = rel_path.split(os.sep)
                if len(parts) > 1:
                    category = parts[0]
                else:
                    category = "Uncategorized"

                if category.startswith('.'): # Skip hidden folders at root
                     continue

                title = get_html_title(filepath)
                structure[category].append((title, rel_path))

    # Sort categories and files
    sorted_categories = sorted(structure.keys())

    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Documentation Index</title>
    <style>
        body {{ font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 20px; color: #333; }}
        h1 {{ color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 30px; }}

        /* Tab Styles */
        .tab {{
            overflow: hidden;
            border: 1px solid #ccc;
            background-color: #f1f1f1;
            border-radius: 5px 5px 0 0;
            display: flex;
            flex-wrap: wrap;
        }}

        .tab button {{
            background-color: inherit;
            float: left;
            border: none;
            outline: none;
            cursor: pointer;
            padding: 14px 16px;
            transition: 0.3s;
            font-size: 16px;
            flex-grow: 1;
            text-align: center;
        }}

        .tab button:hover {{
            background-color: #ddd;
        }}

        .tab button.active {{
            background-color: #3498db;
            color: white;
        }}

        /* Tab Content Styles */
        .tabcontent {{
            display: none;
            padding: 20px;
            border: 1px solid #ccc;
            border-top: none;
            border-radius: 0 0 5px 5px;
            animation: fadeEffect 0.5s; /* Fading effect */
        }}

        /* Go from zero to full opacity */
        @keyframes fadeEffect {{
            from {{opacity: 0;}}
            to {{opacity: 1;}}
        }}

        ul {{ list-style-type: none; padding: 0; }}
        li {{ margin-bottom: 12px; border-bottom: 1px solid #f9f9f9; padding-bottom: 8px; }}
        a {{ text-decoration: none; color: #3498db; font-weight: 500; display: block; }}
        a:hover {{ text-decoration: underline; color: #2980b9; }}
        .file-path {{ font-size: 0.8em; color: #95a5a6; display: block; margin-top: 2px; }}

        .footer {{ margin-top: 50px; font-size: 0.8em; color: #7f8c8d; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }}
    </style>
</head>
<body>

    <h1>Documentation Index</h1>

    <div class="tab">
"""

    # Generate Tab Buttons
    for i, category in enumerate(sorted_categories):
        # Create a safe ID for the category (remove spaces/special chars)
        safe_id = re.sub(r'[^a-zA-Z0-9]', '_', category)
        active_class = " active" if i == 0 else ""
        html_content += f"""        <button class="tablinks{active_class}" onclick="openCategory(event, '{safe_id}')">{escape(category)}</button>\n"""

    html_content += "    </div>\n"

    # Generate Tab Content
    for i, category in enumerate(sorted_categories):
        safe_id = re.sub(r'[^a-zA-Z0-9]', '_', category)
        display_style = "block" if i == 0 else "none"

        html_content += f"""    <div id="{safe_id}" class="tabcontent" style="display: {display_style};">\n"""
        html_content += f"""        <h2>{escape(category)}</h2>\n        <ul>\n"""

        # Sort files by title
        files = sorted(structure[category], key=lambda x: x[0])
        for title, path in files:
            # properly escape path for URL
            url_path = path.replace(os.path.sep, '/')
            html_content += f"""            <li>
                <a href="{escape(url_path)}">{escape(title)}</a>
                <span class="file-path">{escape(path)}</span>
            </li>\n"""

        html_content += "        </ul>\n    </div>\n"

    html_content += f"""
    <div class="footer">
        Last updated: {current_time}
    </div>

    <script>
        function openCategory(evt, categoryName) {{
            var i, tabcontent, tablinks;

            // Get all elements with class="tabcontent" and hide them
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {{
                tabcontent[i].style.display = "none";
            }}

            // Get all elements with class="tablinks" and remove the class "active"
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {{
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }}

            // Show the current tab, and add an "active" class to the button that opened the tab
            document.getElementById(categoryName).style.display = "block";
            evt.currentTarget.className += " active";
        }}
    </script>
</body>
</html>"""

    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"Successfully updated {index_file} with tabbed interface at {current_time}")

if __name__ == "__main__":
    generate_index()
