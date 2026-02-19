# Index Maintenance Guide

This project includes tools to automatically generate and update the `index.html` file, which serves as a categorized table of contents for all HTML documentation in the repository.

## How It Works

The index maintenance system consists of two main scripts:

1. **`generate_index.py`**: A Python script that:
    - Scans the directory structure.
    - Extracts titles from HTML files.
    - Copies HTML files to a clean `public/` directory.
    - **Vendors Dependencies**: Copies required libraries (React, Babel, PrismJS, etc.) from `node_modules` to `public/vendor`.
    - **Rewrites Links**: Updates HTML files to point to local `/vendor/...` assets instead of CDNs.
    - Generates a categorised `index.html` with a tabbed interface.

## Dependency Management

This project uses `bun` to manage dependencies.

- **Install Dependencies**: `bun install`
- **Add New Library**: `bun add <library>`
- **Vendor Logic**: If you add a new library, update `generate_index.py` to copy it to `public/vendor` and add a rewrite rule.

## Manual Update

To manually update the index (for example, after adding new problems), run the following command in the root directory:

```bash
./update_index.sh
```

This will populate the `public/` directory with the latest file structure and `index.html`.

## Automatic Update (Git Hook)

You can set up a Git **pre-commit hook** to automatically update the index every time you commit. This ensures `index.html` is always in sync with your changes.

### Setup Instructions

1. Make the wrapper script executable:

    ```bash
    chmod +x update_index.sh
    ```

2. Create the hook file:

    ```bash
    touch .git/hooks/pre-commit
    ```

3. Open `.git/hooks/pre-commit` in a text editor and add the following content:

    ```bash
    #!/bin/bash

    # Generate index and populate public/ directory. Fail if scripts fail.
    echo "Updating public index..."
    ./update_index.sh || exit 1

    # Add public directory to the commit if modified
    if ! git diff --quiet public; then
        echo "Staging updated public directory..."
        git add public
    fi
    ```

4. Make the hook executable:

    ```bash
    chmod +x .git/hooks/pre-commit
    ```

### How it Works

Now, whenever you run `git commit`:

1. The hook runs `update_index.sh`. If it fails, the commit is aborted.
2. The `public/` directory (including `index.html` and copied content) is updated.
3. If `public/` has changed, it is automatically staged (`git add`).
4. The commit proceeds with the updated public artifacts.
