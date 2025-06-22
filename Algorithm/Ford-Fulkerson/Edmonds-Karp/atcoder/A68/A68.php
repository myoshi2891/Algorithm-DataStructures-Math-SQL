<?php

fscanf(STDIN, "%d %d", $N, $M);

// グラフ初期化
$capacity = array_fill(0, $N + 1, array_fill(0, $N + 1, 0));
$graph = array_fill(0, $N + 1, []);

for ($i = 0; $i < $M; $i++) {
    fscanf(STDIN, "%d %d %d", $a, $b, $c);
    $capacity[$a][$b] += $c; // 同じ辺が複数ある場合は加算
    $graph[$a][] = $b;
    $graph[$b][] = $a; // 逆辺も追加（残余グラフ用）
}

// BFSで増加経路を探索
function bfs($s, $t, &$parent, $capacity, $graph)
{
    $visited = array_fill(0, count($graph), false);
    $queue = [$s];
    $visited[$s] = true;
    $parent[$s] = -1;

    while (!empty($queue)) {
        $u = array_shift($queue);
        foreach ($graph[$u] as $v) {
            if (!$visited[$v] && $capacity[$u][$v] > 0) {
                $parent[$v] = $u;
                $visited[$v] = true;
                if ($v == $t) return true;
                $queue[] = $v;
            }
        }
    }

    return false;
}

// 最大流計算（Edmonds-Karp）
function maxFlow($s, $t, &$capacity, $graph)
{
    $flow = 0;
    $parent = [];

    while (bfs($s, $t, $parent, $capacity, $graph)) {
        $pathFlow = PHP_INT_MAX;
        for ($v = $t; $v != $s; $v = $parent[$v]) {
            $u = $parent[$v];
            $pathFlow = min($pathFlow, $capacity[$u][$v]);
        }

        for ($v = $t; $v != $s; $v = $parent[$v]) {
            $u = $parent[$v];
            $capacity[$u][$v] -= $pathFlow;
            $capacity[$v][$u] += $pathFlow;
        }

        $flow += $pathFlow;
    }

    return $flow;
}

echo maxFlow(1, $N, $capacity, $graph) . PHP_EOL;