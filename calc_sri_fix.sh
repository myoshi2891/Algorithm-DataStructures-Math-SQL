#!/bin/bash

set -euo pipefail

calculate_sri() {
    url="$1"
    temp_file=$(mktemp)

    # curl options: -f (fail on HTTP error), -S (show error), -s (silent equivalent), -L (follow redirects)
    if ! curl -fS -sL "$url" -o "$temp_file"; then
        echo "Error downloading $url" >&2
        rm -f "$temp_file"
        return 1
    fi

    # Check for empty response
    if [ ! -s "$temp_file" ]; then
        echo "Error: Empty response from $url" >&2
        rm -f "$temp_file"
        return 1
    fi

    hash=$(openssl dgst -sha384 -binary < "$temp_file" | openssl base64 -A)
    echo "$url sha384-$hash"
    rm -f "$temp_file"
}

calculate_sri "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js"
calculate_sri "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.js"
