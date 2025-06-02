<?php
// 標準入力からすべての行を読み込む
$input = trim(file_get_contents('php://stdin'));
$lines = explode("\n", $input);

// 1行目：N, M, B
list($N, $M, $B) = array_map('intval', explode(' ', $lines[0]));

// 2行目：A[1..N] 駅ごとの所要時間
$A = array_map('intval', explode(' ', $lines[1]));

// 3行目：C[1..M] バス停ごとの所要時間
$C = array_map('intval', explode(' ', $lines[2]));

// 合計を計算
$sumA = array_sum($A);
$sumC = array_sum($C);

// 式：N*M*B + M*sum(A) + N*sum(C)
$totalTime = $N * $M * $B + $M * $sumA + $N * $sumC;

// 結果出力
echo $totalTime . "\n";