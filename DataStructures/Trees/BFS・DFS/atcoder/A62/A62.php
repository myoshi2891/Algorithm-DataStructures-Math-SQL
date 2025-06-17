<?php
fscanf(STDIN, "%d %d", $N, $M);

// 隣接リストを初期化
$graph = array_fill(1, $N, []);
$visited = array_fill(1, $N, false);

// 辺情報を読み込む
for ($i = 0; $i < $M; $i++) {
    fscanf(STDIN, "%d %d", $a, $b);
    $graph[$a][] = $b;
    $graph[$b][] = $a; // 無向グラフなので逆方向も追加
}

// DFS定義（再帰）
function dfs($v, &$graph, &$visited)
{
    $visited[$v] = true;
    foreach ($graph[$v] as $neighbor) {
        if (!$visited[$neighbor]) {
            dfs($neighbor, $graph, $visited);
        }
    }
}

// 頂点1からDFS開始
dfs(1, $graph, $visited);

// 連結判定
if (in_array(false, $visited, true)) {
    echo "The graph is not connected.\n";
} else {
    echo "The graph is connected.\n";
}