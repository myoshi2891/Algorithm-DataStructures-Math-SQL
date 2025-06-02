<?php
// 標準入力から値を受け取る
fscanf(STDIN, "%d", $N);
$S = trim(fgets(STDIN));

// 判定関数
function canPaintTiles($N, $S) {
    for ($i = 0; $i <= $N - 3; $i++) {
        if ($S[$i] === $S[$i + 1] && $S[$i + 1] === $S[$i + 2]) {
            return "Yes";
        }
    }
    return "No";
}

// 結果を出力
echo canPaintTiles($N, $S) . PHP_EOL;