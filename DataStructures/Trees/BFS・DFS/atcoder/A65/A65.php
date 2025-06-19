<?php

// 入力の読み込み
fscanf(STDIN, "%d", $N);
$A = array_map('intval', explode(' ', trim(fgets(STDIN))));

// 木構造（上司→部下の隣接リスト）を作成
$tree = array_fill(0, $N + 1, []);
for ($i = 0; $i < count($A); $i++) {
    $parent = $A[$i];   // 上司
    $child = $i + 2;     // 社員番号（2〜N）
    $tree[$parent][] = $child;
}

// 部下数を格納する配列
$subordinates = array_fill(0, $N + 1, 0);

// 再帰DFSで部下数をカウント
function dfs($node) {
    global $tree, $subordinates;
    $count = 0;
    foreach ($tree[$node] as $child) {
        $count += 1 + dfs($child);
    }
    $subordinates[$node] = $count;
    return $count;
}

dfs(1); // 社長からスタート

// 結果出力（1〜N）
echo implode(' ', array_slice($subordinates, 1)) . PHP_EOL;