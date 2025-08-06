<?php

$handle = fopen("php://stdin", "r");
$Q = intval(fgets($handle));

$stack = [];
$output = [];

for ($i = 0; $i < $Q; $i++) {
    $line = trim(fgets($handle));
    $parts = explode(' ', $line);
    $type = $parts[0];

    if ($type === '1') {
        $stack[] = $parts[1];
    } elseif ($type === '2') {
        $output[] = end($stack);
    } elseif ($type === '3') {
        array_pop($stack);
    }
}

echo implode("\n", $output) . "\n";