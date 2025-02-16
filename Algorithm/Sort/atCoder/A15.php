<?php
// 標準入力から取得
fscanf(STDIN, "%d", $N);
$A = explode(" ", trim(fgets(STDIN)));

// 配列をコピーしてソート
$sorted = array_unique($A); // 重複を削除
sort($sorted); // 昇順ソート

// 座標圧縮用のマップを作成
$compressMap = [];
foreach ($sorted as $index => $value) {
    $compressMap[$value] = $index + 1; // 1-based index にする
}

// 結果を作成
$B = array_map(fn($x) => $compressMap[$x], $A);

// 出力
echo implode(" ", $B) . PHP_EOL;
?>