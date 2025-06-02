<?php

function longestCommonSubsequence($S, $T) {
    $m = strlen($S);
    $n = strlen($T);

    // DPテーブルの作成 (1D 配列を2つ)
    $prev = array_fill(0, $n + 1, 0);
    $curr = array_fill(0, $n + 1, 0);

    for ($i = 1; $i <= $m; $i++) {
        for ($j = 1; $j <= $n; $j++) {
            if ($S[$i - 1] === $T[$j - 1]) {
                $curr[$j] = $prev[$j - 1] + 1;
            } else {
                $curr[$j] = max($prev[$j], $curr[$j - 1]);
            }
        }
        // 計算が終わったら prev を curr に更新
        $prev = $curr;
    }

    return $prev[$n];
}

// 標準入力からデータを取得
$S = trim(fgets(STDIN));
$T = trim(fgets(STDIN));

// 結果を出力
echo longestCommonSubsequence($S, $T) . PHP_EOL;

?>