<?php
// 標準入力を取得
fscanf(STDIN, "%d %d %d", $H, $W, $N);

// (H+2) x (W+2) の差分配列を初期化
$diff = array_fill(0, $H + 2, array_fill(0, $W + 2, 0));

// 差分配列に雪の情報を反映
for ($i = 0; $i < $N; $i++) {
	fscanf(STDIN, "%d %d %d %d", $A, $B, $C, $D);

	$diff[$A][$B] += 1;
	$diff[$C + 1][$B] -= 1;
	$diff[$A][$D + 1] -= 1;
	$diff[$C + 1][$D + 1] += 1;
}

// 横方向の累積和を計算
for ($i = 1; $i <= $H; $i++) {
	for ($j = 1; $j <= $W; $j++) {
		$diff[$i][$j] += $diff[$i][$j - 1];
	}
}

// 縦方向の累積和を計算
for ($j = 1; $j <= $W; $j++) {
	for ($i = 1; $i <= $H; $i++) {
		$diff[$i][$j] += $diff[$i - 1][$j];
	}
}

// 最終的な積雪量を出力
for ($i = 1; $i <= $H; $i++) {
	$row = [];
	for ($j = 1; $j <= $W; $j++) {
		$row[] = $diff[$i][$j];
	}
	echo implode(' ', $row) . PHP_EOL;
}
