<?php
// 標準入力を配列に読み込む
$input = trim(file_get_contents("php://stdin"));
$lines = explode("\n", $input);

// N, K を取得
list($N, $K) = array_map('intval', explode(' ', array_shift($lines)));

$students = [];

foreach ($lines as $line) {
    list($a, $b) = array_map('intval', explode(' ', $line));
    $students[] = ['a' => $a, 'b' => $b];
}

// 体力で昇順ソート
usort($students, function ($s1, $s2) {
    return $s1['a'] - $s2['a'];
});

$maxCount = 0;

// 体力の差がK以下の範囲を全探索
for ($i = 0; $i < $N; $i++) {
    $temp = [];

    for ($j = $i; $j < $N; $j++) {
        if ($students[$j]['a'] - $students[$i]['a'] > $K) break;
        $temp[] = $students[$j];
    }

    // 気力でソート
    usort($temp, function ($s1, $s2) {
        return $s1['b'] - $s2['b'];
    });

    // 気力の差がK以下になる最大人数を探索
    $len = count($temp);
    for ($l = 0; $l < $len; $l++) {
        for ($r = $l; $r < $len; $r++) {
            if ($temp[$r]['b'] - $temp[$l]['b'] > $K) break;
            $maxCount = max($maxCount, $r - $l + 1);
        }
    }
}

echo $maxCount . "\n";