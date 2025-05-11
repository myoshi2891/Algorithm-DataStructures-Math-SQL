<?php
// 標準入力から受け取る
fscanf(STDIN, "%d", $N);
$A = explode(" ", trim(fgets(STDIN)));

// XORを計算
$xor = 0;
foreach ($A as $a) {
    $xor ^= (int)$a;
}

// 勝者を判定
echo $xor === 0 ? "Second\n" : "First\n";