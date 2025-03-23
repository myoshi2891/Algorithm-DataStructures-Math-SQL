<?php

// 入力の読み込み
fscanf(STDIN, "%d", $N);
$PA = [];
for ($i = 0; $i < $N; $i++) {
    fscanf(STDIN, "%d %d", $P, $A);
    $PA[] = [$P - 1, $A]; // 0-index に変換
}

// DPテーブルの作成
$dp = array_fill(0, $N, array_fill(0, $N, 0));

// 区間 DP の計算
for ($di = 0; $di < $N; $di++) { // 区間の長さを増やしていく
    for ($i = 0; $i + $di < $N; $i++) {
        $j = $i + $di;

        // 左端のブロックを削除する場合
        if ($i > 0) {
            [$pl, $al] = $PA[$i - 1];
            $scoreL = ($i <= $pl && $pl <= $j) ? $al : 0;
            $dp[$i - 1][$j] = max($dp[$i - 1][$j], $dp[$i][$j] + $scoreL);
        }

        // 右端のブロックを削除する場合
        if ($j < $N - 1) {
            [$pr, $ar] = $PA[$j + 1];
            $scoreR = ($i <= $pr && $pr <= $j) ? $ar : 0;
            $dp[$i][$j + 1] = max($dp[$i][$j + 1], $dp[$i][$j] + $scoreR);
        }
    }
}

// 結果を出力
echo $dp[0][$N - 1] . PHP_EOL;