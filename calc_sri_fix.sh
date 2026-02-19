#!/bin/bash

set -euo pipefail

# calculate_sri downloads the given URL, computes the SHA-384 SRI hash of its content (base64) and echoes a line "<url> sha384-<base64_hash>".
calculate_sri() {
    local url="$1"
    local temp_file
    temp_file=$(mktemp)
    trap "rm -f \"$temp_file\"" RETURN

    # curl options: -f (fail on HTTP error), -S (show error), -s (silent equivalent), -L (follow redirects)
    if ! curl -fS -sL "$url" -o "$temp_file"; then
        echo "Error downloading $url" >&2
        return 1
    fi

    # Check for empty response
    if [ ! -s "$temp_file" ]; then
        echo "Error: Empty response from $url" >&2
        return 1
    fi

    local hash
    hash=$(openssl dgst -sha384 -binary < "$temp_file" | openssl base64 -A)
    echo "$url sha384-$hash"
}

calculate_sri "https://unpkg.com/react@18/umd/react.production.min.js" || true
calculate_sri "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" || true
calculate_sri "https://unpkg.com/@babel/standalone/babel.min.js" || true
# calculate_sri "https://cdn.tailwindcss.com" || true # Skipped: dynamic CDN incompatible with SRI
calculate_sri "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" || true
calculate_sri "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css" || true
calculate_sri "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js" || true
calculate_sri "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js" || true
calculate_sri "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.js" || true
calculate_sri "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js" || true
# Google Fonts returns dynamic CSS, SRI might be unstable but we check just in case or skip if needed. User instruction implies to check.
calculate_sri "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Fraunces:wght@700;900&display=swap" || true
calculate_sri "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js" || true
