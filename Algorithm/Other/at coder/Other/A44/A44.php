<?php

// 標準入力の全体を取得
fscanf(STDIN, "%d %d", $N, $Q);

// 差分記録用の連想配列
$changes = [];
$reversed = false;
$output = [];

for ($i = 0; $i < $Q; $i++) {
    $line = trim(fgets(STDIN));
    $parts = explode(' ', $line);

    if ($parts[0] == "1") {
        // 変更操作: 1 x y
        $x = (int)$parts[1];
        $y = (int)$parts[2];
        $index = $reversed ? $N - $x : $x - 1;
        $changes[$index] = $y;
    } elseif ($parts[0] == "2") {
        // 反転操作: toggle
        $reversed = !$reversed;
    } elseif ($parts[0] == "3") {
        // 取得操作: 3 x
        $x = (int)$parts[1];
        $index = $reversed ? $N - $x : $x - 1;
        $value = array_key_exists($index, $changes) ? $changes[$index] : ($index + 1);
        $output[] = $value;
    }
}

// 出力
echo implode("\n", $output) . "\n";