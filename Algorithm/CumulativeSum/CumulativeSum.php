<?php
// 標準入力を読み込む
fscanf(STDIN, "%d %d", $N, $Q);

// 来場者数データを配列に読み込む
$A = array_map('intval', explode(' ', trim(fgets(STDIN))));

// 累積和を計算する
$prefixSum = array_fill(0, $N + 1, 0);
for ($i = 1; $i <= $N; $i++) {
    $prefixSum[$i] = $prefixSum[$i - 1] + $A[$i - 1];
}

// 質問を処理する
$results = [];
for ($j = 0; $j < $Q; $j++) {
    fscanf(STDIN, "%d %d", $L, $R);
    // 累積和を使って合計を計算
    $results[] = $prefixSum[$R] - $prefixSum[$L - 1];
}

// 結果を出力
foreach ($results as $result) {
    echo $result . PHP_EOL;
}
