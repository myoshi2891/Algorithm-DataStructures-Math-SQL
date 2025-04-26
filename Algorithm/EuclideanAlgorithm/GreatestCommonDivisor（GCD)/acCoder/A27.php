<?php
// 標準入力を読み込む
fscanf(STDIN, "%d %d", $a, $b);

// ユークリッドの互除法でGCDを求める関数
function gcd($a, $b) {
    while ($b != 0) {
        $temp = $b;
        $b = $a % $b;
        $a = $temp;
    }
    return $a;
}

// 結果を出力
echo gcd($a, $b) . "\n";