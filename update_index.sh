#!/bin/bash
set -euo pipefail

# Ensure we are in the directory where the script is located
cd "$(dirname "$0")"

# Execute the python generator
python3 generate_index.py
