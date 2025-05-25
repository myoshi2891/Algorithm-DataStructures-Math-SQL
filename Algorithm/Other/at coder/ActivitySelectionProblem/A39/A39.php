<?php
// 標準入力を読み込む
$input = file('php://stdin');
$n = intval(array_shift($input));

$movies = [];
foreach ($input as $line) {
    [$start, $end] = array_map('intval', explode(' ', trim($line)));
    $movies[] = ['start' => $start, 'end' => $end];
}

// 終了時間でソート
usort($movies, function ($a, $b) {
    return $a['end'] <=> $b['end'];
});

// 映画を選んでいく
$currentTime = 0;
$count = 0;

foreach ($movies as $movie) {
    if ($movie['start'] >= $currentTime) {
        $count++;
        $currentTime = $movie['end'];
    }
}

echo $count . PHP_EOL;

// <?php
// // 標準入力から N を読み取る
// fscanf(STDIN, "%d", $n);

// $movies = [];

// // N回ループして各映画の開始・終了時間を読み取る
// for ($i = 0; $i < $n; $i++) {
//     fscanf(STDIN, "%d %d", $l, $r);
//     $movies[] = ['start' => $l, 'end' => $r];
// }

// // 終了時間でソート（昇順）
// usort($movies, function($a, $b) {
//     return $a['end'] <=> $b['end'];
// });

// // 映画を選ぶ貪欲戦略
// $currentTime = 0;
// $count = 0;

// foreach ($movies as $movie) {
//     if ($movie['start'] >= $currentTime) {
//         $count++;
//         $currentTime = $movie['end'];
//     }
// }

// // 結果を出力
// echo $count . PHP_EOL;