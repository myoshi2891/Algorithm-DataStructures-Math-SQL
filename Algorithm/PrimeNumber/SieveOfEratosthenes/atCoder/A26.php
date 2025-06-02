<?php
// 標準入力読み込み
$input = trim(fgets(STDIN));
$Q = (int)$input;
$numbers = [];

for ($i = 0; $i < $Q; $i++) {
    $numbers[] = (int)trim(fgets(STDIN));
}

// エラトステネスの篩
$MAX = 300000;
$is_prime = array_fill(0, $MAX + 1, true);
$is_prime[0] = $is_prime[1] = false;

for ($i = 2; $i * $i <= $MAX; $i++) {
    if ($is_prime[$i]) {
        for ($j = $i * $i; $j <= $MAX; $j += $i) {
            $is_prime[$j] = false;
        }
    }
}

// 判定して出力
foreach ($numbers as $x) {
    echo $is_prime[$x] ? "Yes\n" : "No\n";
}