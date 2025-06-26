<?php

// 入力を取得
$N = intval(trim(fgets(STDIN)));
$A = array_map('intval', explode(' ', trim(fgets(STDIN))));
$B = array_map('intval', explode(' ', trim(fgets(STDIN))));

// 難易度：降順、気温：昇順でソート
rsort($A); // 降順ソート
sort($B);  // 昇順ソート

// 総労力を計算
$totalEffort = 0;
for ($i = 0; $i < $N; $i++) {
    $totalEffort += $A[$i] * $B[$i];
}

echo $totalEffort . PHP_EOL;