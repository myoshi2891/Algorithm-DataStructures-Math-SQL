<?php
// 標準入力から値を取得
fscanf(STDIN, "%d %d", $N, $X);
$A = explode(" ", trim(fgets(STDIN)));

// 二分探索法を実装
function binarySearch($A, $X)
{
    $left = 0;
    $right = count($A) - 1;

    while ($left <= $right) {
        $mid = intval(($left + $right) / 2);

        if ($A[$mid] == $X) {
            return $mid + 1; // 1始まりのインデックスを返す
        } elseif ($A[$mid] < $X) {
            $left = $mid + 1;
        } else {
            $right = $mid - 1;
        }
    }

    return -1; // Xが必ず存在する前提なのでここには到達しない
}

// 二分探索を呼び出し
$result = binarySearch($A, $X);

// 結果を出力
echo $result . PHP_EOL;
