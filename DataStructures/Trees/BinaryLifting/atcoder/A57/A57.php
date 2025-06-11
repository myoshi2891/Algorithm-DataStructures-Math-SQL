<?php

fscanf(STDIN, "%d %d", $N, $Q);

// 1-indexed 入力を 0-indexed に変換
$A = array_map(fn($x) => (int)$x - 1, explode(" ", trim(fgets(STDIN))));

// 定数：2^30 > 1e9
$LOG = 30;

// doubling[k][i] := i番の穴から2^k日後にいる穴の番号
$doubling = array_fill(0, $LOG, array_fill(0, $N, 0));

// 初期化（1日後）
for ($i = 0; $i < $N; $i++) {
    $doubling[0][$i] = $A[$i];
}

// ダブリング表の作成
for ($k = 1; $k < $LOG; $k++) {
    for ($i = 0; $i < $N; $i++) {
        $doubling[$k][$i] = $doubling[$k - 1][$doubling[$k - 1][$i]];
    }
}

// クエリ処理
for ($q = 0; $q < $Q; $q++) {
    fscanf(STDIN, "%d %d", $x, $y);
    $x--; // 0-indexed に変換

    for ($k = 0; $k < $LOG; $k++) {
        if (($y >> $k) & 1) {
            $x = $doubling[$k][$x];
        }
    }

    // 1-indexed に戻して出力
    echo ($x + 1) . "\n";
}
