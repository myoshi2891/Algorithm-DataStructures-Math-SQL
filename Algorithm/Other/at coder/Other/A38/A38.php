<?php
// 標準入力から読み込む
$input = file('php://stdin');
list($D, $N) = array_map('intval', explode(' ', trim($input[0])));

// 各日ごとの最大労働時間（初期値は24時間）
$maxHours = array_fill(0, $D, 24);

// 制約を反映
for ($i = 1; $i <= $N; $i++) {
    list($L, $R, $H) = array_map('intval', explode(' ', trim($input[$i])));
    for ($day = $L - 1; $day <= $R - 1; $day++) {
        $maxHours[$day] = min($maxHours[$day], $H);
    }
}

// 合計最大労働時間を計算
$total = array_sum($maxHours);
echo $total . "\n";