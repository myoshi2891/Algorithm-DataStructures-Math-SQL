<?php

fscanf(STDIN, "%d %d", $N, $Q);

// Union-Find クラス定義
class UnionFind
{
    private array $parent;
    private array $rank;

    public function __construct(int $n)
    {
        $this->parent = range(0, $n);  // 1-indexed
        $this->rank = array_fill(0, $n + 1, 0);
    }

    public function find(int $x): int
    {
        if ($this->parent[$x] !== $x) {
            $this->parent[$x] = $this->find($this->parent[$x]);  // 経路圧縮
        }
        return $this->parent[$x];
    }

    public function union(int $x, int $y): void
    {
        $rx = $this->find($x);
        $ry = $this->find($y);
        if ($rx === $ry) return;

        if ($this->rank[$rx] < $this->rank[$ry]) {
            $this->parent[$rx] = $ry;
        } else {
            $this->parent[$ry] = $rx;
            if ($this->rank[$rx] === $this->rank[$ry]) {
                $this->rank[$rx]++;
            }
        }
    }

    public function same(int $x, int $y): bool
    {
        return $this->find($x) === $this->find($y);
    }
}

$uf = new UnionFind($N);
$output = [];

for ($i = 0; $i < $Q; $i++) {
    fscanf(STDIN, "%d %d %d", $t, $u, $v);
    if ($t === 1) {
        $uf->union($u, $v);
    } else {
        $output[] = $uf->same($u, $v) ? "Yes" : "No";
    }
}

echo implode("\n", $output) . "\n";