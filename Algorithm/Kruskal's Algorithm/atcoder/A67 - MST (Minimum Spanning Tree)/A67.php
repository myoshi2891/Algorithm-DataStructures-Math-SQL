<?php

fscanf(STDIN, "%d %d", $N, $M);
$edges = [];

for ($i = 0; $i < $M; $i++) {
    fscanf(STDIN, "%d %d %d", $a, $b, $c);
    // 0-indexed に変換
    $edges[] = [$c, $a - 1, $b - 1];
}

// 重みで昇順にソート
usort($edges, fn($e1, $e2) => $e1[0] <=> $e2[0]);

// Union-Find 構造体
class UnionFind {
    private array $parent;
    private array $rank;

    public function __construct(int $n) {
        $this->parent = range(0, $n - 1);
        $this->rank = array_fill(0, $n, 0);
    }

    public function find(int $x): int {
        if ($this->parent[$x] !== $x) {
            $this->parent[$x] = $this->find($this->parent[$x]); // 経路圧縮
        }
        return $this->parent[$x];
    }

    public function union(int $x, int $y): bool {
        $rx = $this->find($x);
        $ry = $this->find($y);
        if ($rx === $ry) return false;

        if ($this->rank[$rx] < $this->rank[$ry]) {
            $this->parent[$rx] = $ry;
        } else {
            $this->parent[$ry] = $rx;
            if ($this->rank[$rx] === $this->rank[$ry]) {
                $this->rank[$rx]++;
            }
        }
        return true;
    }
}

$uf = new UnionFind($N);
$total = 0;
$count = 0;

foreach ($edges as [$cost, $u, $v]) {
    if ($uf->union($u, $v)) {
        $total += $cost;
        $count++;
        if ($count === $N - 1) break;
    }
}

echo $total . PHP_EOL;