<?php

function minTimeToReachN(int $N, array $A, array $B): int {
    $dp = array_fill(0, $N, PHP_INT_MAX);
    $dp[0] = 0;
    
    for ($i = 1; $i < $N; $i++) {
        $dp[$i] = min($dp[$i], $dp[$i - 1] + $A[$i - 1]);
        
        if ($i > 1) {
            $dp[$i] = min($dp[$i], $dp[$i - 2] + $B[$i - 2]);
        }
    }
    
    return $dp[$N - 1];
}

$input = explode("\n", trim(file_get_contents("php://stdin")));

$N = (int)$input[0];
$A = array_map('intval', explode(" ", $input[1]));
$B = isset($input[2]) ? array_map('intval', explode(" ", $input[2])) : [];

echo minTimeToReachN($N, $A, $B) . "\n";