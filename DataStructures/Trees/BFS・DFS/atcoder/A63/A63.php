<?php

// 標準入力から取得
fscanf(STDIN, "%d %d", $N, $M);

// グラフの隣接リストを構築
$graph = array_fill(0, $N + 1, []);
for ($i = 0; $i < $M; $i++) {
    fscanf(STDIN, "%d %d", $a, $b);
    $graph[$a][] = $b;
    $graph[$b][] = $a;
}

// BFS 初期化
$dist = array_fill(0, $N + 1, -1);
$dist[1] = 0;
$queue = [1];
$head = 0;

// 幅優先探索
while ($head < count($queue)) {
    $current = $queue[$head++];
    foreach ($graph[$current] as $neighbor) {
        if ($dist[$neighbor] === -1) {
            $dist[$neighbor] = $dist[$current] + 1;
            $queue[] = $neighbor;
        }
    }
}

// 出力
for ($i = 1; $i <= $N; $i++) {
    echo $dist[$i] . "\n";
}