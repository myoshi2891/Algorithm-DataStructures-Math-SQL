<?php

// 標準入力から読み込み
fscanf(STDIN, "%d", $N);
$A = explode(" ", trim(fgets(STDIN)));

// 長さごとのカウント配列（1〜100まで）
$count = array_fill(1, 100, 0);

foreach ($A as $length) {
    $count[(int)$length]++;
}

// 長さごとのC(n,3)を計算
$result = 0;
foreach ($count as $c) {
    if ($c >= 3) {
        $result += ($c * ($c - 1) * ($c - 2)) / 6;
    }
}

// 結果出力
echo (int)$result . "\n";