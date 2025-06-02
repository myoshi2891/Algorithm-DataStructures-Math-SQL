<?php
// 標準入力から取得
fscanf(STDIN, "%d %d", $H, $W);

// グリッド読み込み
$grid = [];
for ($i = 0; $i < $H; $i++) {
    $grid[$i] = trim(fgets(STDIN));
}

// DP配列の初期化
$dp = array_fill(0, $H, array_fill(0, $W, 0));

// スタート地点が白なら1通り
if ($grid[0][0] === '.') {
    $dp[0][0] = 1;
}

// DP処理
for ($i = 0; $i < $H; $i++) {
    for ($j = 0; $j < $W; $j++) {
        if ($grid[$i][$j] === '#') continue;

        // 上から来る
        if ($i > 0 && $grid[$i - 1][$j] === '.') {
            $dp[$i][$j] += $dp[$i - 1][$j];
        }

        // 左から来る
        if ($j > 0 && $grid[$i][$j - 1] === '.') {
            $dp[$i][$j] += $dp[$i][$j - 1];
        }
    }
}

// 結果出力
echo $dp[$H - 1][$W - 1] . PHP_EOL;
?>