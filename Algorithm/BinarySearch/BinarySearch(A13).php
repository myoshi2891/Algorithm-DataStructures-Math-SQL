<?php
function binarySearch($arr, $low, $high, $key)
{
    while ($low < $high) {
        $mid = intdiv($low + $high + 1, 2); // 上側に偏らせる
        if ($arr[$mid] <= $key) {
            $low = $mid; // 範囲を上げる
        } else {
            $high = $mid - 1; // 範囲を下げる
        }
    }
    return $low;
}

fscanf(STDIN, "%d %d", $N, $K);
$A = array_map('intval', explode(" ", trim(fgets(STDIN))));

$count = 0;

for ($i = 0; $i < $N; $i++) {
    $j = binarySearch($A, $i, $N - 1, $A[$i] + $K);
    $count += ($j - $i);
}

echo $count . PHP_EOL;
