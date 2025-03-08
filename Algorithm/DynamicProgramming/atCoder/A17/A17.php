<?php
fscanf(STDIN, "%d", $N);
$A = array_map('intval', explode(' ', trim(fgets(STDIN))));
$B = array_map('intval', explode(' ', trim(fgets(STDIN))));

$dp = array_fill(1, $N, PHP_INT_MAX);
$prev = array_fill(1, $N, -1);
$dp[1] = 0;

for ($i = 2; $i <= $N; $i++) {
    if ($dp[$i] > $dp[$i - 1] + $A[$i - 2]) {
        $dp[$i] = $dp[$i - 1] + $A[$i - 2];
        $prev[$i] = $i - 1;
    }
    if ($i > 2 && $dp[$i] > $dp[$i - 2] + $B[$i - 3]) {
        $dp[$i] = $dp[$i - 2] + $B[$i - 3];
        $prev[$i] = $i - 2;
    }
}

// 最短経路の復元
$path = [];
for ($i = $N; $i != -1; $i = $prev[$i]) {
    array_push($path, $i);
}
$path = array_reverse($path);

// 出力
echo count($path) . "\n";
echo implode(" ", $path) . "\n";