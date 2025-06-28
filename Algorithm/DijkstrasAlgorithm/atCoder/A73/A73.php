<?php

fscanf(STDIN, "%d %d", $N, $M);

// グラフ構築
$graph = array_fill(0, $N + 1, []);
for ($i = 0; $i < $M; $i++) {
    fscanf(STDIN, "%d %d %d %d", $a, $b, $c, $d);
    $graph[$a][] = [$b, $c, $d]; // [to, cost, tree]
    $graph[$b][] = [$a, $c, $d];
}

// 最短距離・木の数
$dist = array_fill(0, $N + 1, INF);
$trees = array_fill(0, $N + 1, -INF);
$dist[1] = 0;
$trees[1] = 0;

// 優先度付きキュー（SplPriorityQueue 使用）
class PQ extends SplPriorityQueue
{
    public function compare($a, $b): int
    {
        // 辞書順：(距離が小) → (木が多)
        if ($a[0] === $b[0]) {
            return $b[1] <=> $a[1]; // 木の数多い方が優先
        }
        return $b[0] <=> $a[0]; // 距離小さい方が優先
    }
}

$pq = new PQ();
$pq->insert([0, 0, 1], [0, 0]); // [距離, -木の数, ノード], 優先度

while (!$pq->isEmpty()) {
    [$cost, $negTree, $u] = $pq->extract();
    $tree = -$negTree;

    if ($cost > $dist[$u]) continue;
    if ($cost === $dist[$u] && $tree < $trees[$u]) continue;

    foreach ($graph[$u] as [$v, $c, $t]) {
        $newCost = $cost + $c;
        $newTree = $tree + $t;

        if (
            $newCost < $dist[$v] ||
            ($newCost === $dist[$v] && $newTree > $trees[$v])
        ) {
            $dist[$v] = $newCost;
            $trees[$v] = $newTree;
            $pq->insert([$newCost, -$newTree, $v], [$newCost, -$newTree]);
        }
    }
}

echo $dist[$N] . " " . $trees[$N] . "\n";