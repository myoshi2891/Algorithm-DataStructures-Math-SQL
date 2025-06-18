<?php

// 最小ヒープクラスの実装
class MinHeap
{
    private array $heap = [];

    public function push(int $dist, int $node): void
    {
        $this->heap[] = [$dist, $node];
        $this->siftUp(count($this->heap) - 1);
    }

    public function pop(): ?array
    {
        if (empty($this->heap)) return null;
        $min = $this->heap[0];
        $last = array_pop($this->heap);
        if (!empty($this->heap)) {
            $this->heap[0] = $last;
            $this->siftDown(0);
        }
        return $min;
    }

    public function isEmpty(): bool
    {
        return empty($this->heap);
    }

    private function siftUp(int $i): void
    {
        while ($i > 0) {
            $p = (int)(($i - 1) / 2);
            if ($this->heap[$p][0] <= $this->heap[$i][0]) break;
            [$this->heap[$p], $this->heap[$i]] = [$this->heap[$i], $this->heap[$p]];
            $i = $p;
        }
    }

    private function siftDown(int $i): void
    {
        $n = count($this->heap);
        while (2 * $i + 1 < $n) {
            $a = 2 * $i + 1;
            $b = 2 * $i + 2;
            $smallest = $a;
            if ($b < $n && $this->heap[$b][0] < $this->heap[$a][0]) $smallest = $b;
            if ($this->heap[$i][0] <= $this->heap[$smallest][0]) break;
            [$this->heap[$i], $this->heap[$smallest]] = [$this->heap[$smallest], $this->heap[$i]];
            $i = $smallest;
        }
    }
}

// 入力
fscanf(STDIN, "%d %d", $N, $M);
$graph = array_fill(0, $N, []);

for ($i = 0; $i < $M; $i++) {
    fscanf(STDIN, "%d %d %d", $a, $b, $c);
    $a--;
    $b--; // 0-indexed に変換
    $graph[$a][] = [$b, $c];
    $graph[$b][] = [$a, $c];
}

// ダイクストラ法
$INF = PHP_INT_MAX;
$dist = array_fill(0, $N, $INF);
$dist[0] = 0;

$heap = new MinHeap();
$heap->push(0, 0);

while (!$heap->isEmpty()) {
    [$d, $u] = $heap->pop();
    if ($d > $dist[$u]) continue;

    foreach ($graph[$u] as [$v, $cost]) {
        if ($dist[$v] > $d + $cost) {
            $dist[$v] = $d + $cost;
            $heap->push($dist[$v], $v);
        }
    }
}

// 出力
foreach ($dist as $d) {
    echo ($d === $INF ? -1 : $d), "\n";
}