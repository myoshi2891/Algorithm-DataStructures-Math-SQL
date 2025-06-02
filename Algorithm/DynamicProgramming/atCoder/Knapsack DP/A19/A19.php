<?php
// 標準入力からデータを読み込む
fscanf(STDIN, "%d %d", $N, $W);

$items = [];
for ($i = 0; $i < $N; $i++) {
    fscanf(STDIN, "%d %d", $w, $v);
    $items[] = [$w, $v];
}

// DPテーブルの初期化
$dp = array_fill(0, $W + 1, 0);

// ナップサックDP
foreach ($items as [$w, $v]) {
    for ($j = $W; $j >= $w; $j--) {
        $dp[$j] = max($dp[$j], $dp[$j - $w] + $v);
    }
}

// 最大価値の出力
echo max($dp) . "\n";