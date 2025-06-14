<?php

fscanf(STDIN, "%d", $N);
$A = array_map('intval', explode(' ', trim(fgets(STDIN))));

$result = array_fill(0, $N, -1);
$stack = []; // インデックスを保持する単調スタック

for ($i = 0; $i < $N; $i++) {
    // スタックのトップが A[i] 以下なら無効なので除去
    while (!empty($stack) && $A[end($stack)] <= $A[$i]) {
        array_pop($stack);
    }

    // スタックが残っていればそのトップが起算日
    if (!empty($stack)) {
        $result[$i] = end($stack) + 1; // 出力は1-based
    }

    // 今のインデックスを積む
    $stack[] = $i;
}

echo implode(' ', $result) . PHP_EOL;