<?php
// 標準入力から1行読み込む
$line = trim(fgets(STDIN));
list($N, $K) = explode(" ", $line);

// 最短移動回数
$minSteps = 2 * ($N - 1);

// 条件をチェックして出力
if ($K >= $minSteps && ($K - $minSteps) % 2 === 0) {
    echo "Yes\n";
} else {
    echo "No\n";
}