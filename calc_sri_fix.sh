#!/bin/bash

calculate_sri() {
    url="$1"
    hash=$(curl -sL "$url" | openssl dgst -sha384 -binary | openssl base64 -A)
    echo "$url sha384-$hash"
}

calculate_sri "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js"
calculate_sri "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.js"
