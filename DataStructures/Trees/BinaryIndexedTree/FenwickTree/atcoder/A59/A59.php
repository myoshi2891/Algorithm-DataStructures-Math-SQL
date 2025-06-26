<?php

class FenwickTree
{
    private int $n;
    private array $tree;

    public function __construct(int $n)
    {
        $this->n = $n;
        $this->tree = array_fill(0, $n + 2, 0);
    }

    public function add(int $index, int $value): void
    {
        while ($index <= $this->n) {
            $this->tree[$index] += $value;
            $index += $index & -$index;
        }
    }

    public function sum(int $index): int
    {
        $res = 0;
        while ($index > 0) {
            $res += $this->tree[$index];
            $index -= $index & -$index;
        }
        return $res;
    }

    public function rangeSum(int $l, int $r): int
    {
        return $this->sum($r - 1) - $this->sum($l - 1);
    }
}

$input = stream_get_contents(STDIN);
$tokens = explode("\n", trim($input));
list($N, $Q) = array_map('intval', explode(' ', array_shift($tokens)));

$bit = new FenwickTree($N);
$A = array_fill(0, $N + 1, 0); // 1-indexed
$output = [];

foreach ($tokens as $line) {
    if (trim($line) === '') continue; // 空行スキップ

    $parts = explode(' ', $line);
    $c = intval($parts[0]);

    if ($c === 1) {
        $pos = intval($parts[1]);
        $x = intval($parts[2]);
        $diff = $x - $A[$pos];
        $A[$pos] = $x;
        $bit->add($pos, $diff);
    } elseif ($c === 2) {
        $l = intval($parts[1]);
        $r = intval($parts[2]);
        $output[] = $bit->rangeSum($l, $r);
    }
}

echo implode("\n", $output) . "\n";