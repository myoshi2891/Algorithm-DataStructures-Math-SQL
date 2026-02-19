# Index Maintenance Guide

This project includes tools to automatically generate and update the `index.html` file, which serves as a categorized table of contents for all HTML documentation in the repository.

## Files

- `generate_index.py`: Python script that scans directories and generates `index.html`.
- `update_index.sh`: Shell script wrapper for easy execution.
- `index.html`: The generated index file.

## Manual Update

To manually update the index (for example, after adding new problems), run the following command in the root directory:

```bash
./update_index.sh
```

This will overwrite `index.html` with the latest file structure.

## Automatic Update (Git Hook)

You can set up a Git **pre-commit hook** to automatically update the index every time you commit. This ensures `index.html` is always in sync with your changes.

### Setup Instructions

1. Create the hook file:

    ```bash
    touch .git/hooks/pre-commit
    ```

2. Open `.git/hooks/pre-commit` in a text editor and add the following content:

    ```bash
    #!/bin/sh

    # Generate index.html
    echo "Updating index.html..."
    ./update_index.sh

    # Add index.html to the commit if it was modified
    git add index.html
    ```

3. Make the hook executable:

    ```bash
    chmod +x .git/hooks/pre-commit
    ```

### How it Works

Now, whenever you run `git commit`:

1. The hook runs `update_index.sh`.
2. `index.html` is updated with any new files you created.
3. The updated `index.html` is automatically staged (`git add`).
4. The commit proceeds with the updated index.
