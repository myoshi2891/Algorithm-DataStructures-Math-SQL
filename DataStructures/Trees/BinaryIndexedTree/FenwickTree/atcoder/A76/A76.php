<?php

declare(strict_types=1);

const MOD = 1_000_000_007;

class FenwickTree
{
    private int $n;
    private array $tree;

    public function __construct(int $n)
    {
        $this->n = $n;
        $this->tree = array_fill(0, $n + 2, 0);
    }

    public function add(int $i, int $x): void
    {
        $i++;
        while ($i <= $this->n + 1) {
            $this->tree[$i] = ($this->tree[$i] + $x) % MOD;
            $i += $i & -$i;
        }
    }

    public function sum(int $i): int
    {
        $i++;
        $res = 0;
        while ($i > 0) {
            $res = ($res + $this->tree[$i]) % MOD;
            $i -= $i & -$i;
        }
        return $res;
    }

    public function rangeSum(int $l, int $r): int
    {
        return ($this->sum($r) - $this->sum($l - 1) + MOD) % MOD;
    }
}

function lowerBound(array $arr, int $x): int
{
    $left = 0;
    $right = count($arr);
    while ($left < $right) {
        $mid = intdiv($left + $right, 2);
        if ($arr[$mid] < $x) {
            $left = $mid + 1;
        } else {
            $right = $mid;
        }
    }
    return $left;
}

function upperBound(array $arr, int $x): int
{
    $left = 0;
    $right = count($arr);
    while ($left < $right) {
        $mid = intdiv($left + $right, 2);
        if ($arr[$mid] <= $x) {
            $left = $mid + 1;
        } else {
            $right = $mid;
        }
    }
    return $left;
}

function main(): void
{
    [$N, $W, $L, $R] = array_map('intval', explode(' ', trim(fgets(STDIN))));
    $Xs = array_map('intval', explode(' ', trim(fgets(STDIN))));

    // 圧縮対象: 0, 足場, W
    $positions = array_merge([0], $Xs, [$W]);
    sort($positions);
    $n = count($positions);

    // 位置→インデックスマップ（未使用でもOK）
    $posToIndex = [];
    foreach ($positions as $i => $val) {
        $posToIndex[$val] = $i;
    }

    $dp = array_fill(0, $n, 0);
    $dp[0] = 1;

    $ft = new FenwickTree($n);
    $ft->add(0, 1);

    for ($i = 1; $i < $n; $i++) {
        $cur = $positions[$i];
        $left = $cur - $R;
        $right = $cur - $L;

        $li = lowerBound($positions, $left);
        $ri = upperBound($positions, $right) - 1;

        if ($li <= $ri) {
            $dp[$i] = $ft->rangeSum($li, $ri);
            $ft->add($i, $dp[$i]);
        }
    }

    echo $dp[$n - 1] . PHP_EOL;
}

main();


// 高速化と厳密な型指定を意識しつつ、座標圧縮 + 動的計画法 + Fenwick Tree（BIT） を用いて、制約（最大 15 万件）に対応しています。

// ✅ 解法方針（再掲）
// ジャンプ可能地点：0, 全ての足場 X[i], ゴール地点 W
// 到達可能な方法数：dp[i]（positions[i] に到達する方法の数）
// 区間加算高速化：Fenwick Tree（BIT）で dp[li..ri] を合計
// 各 dp[i] を高速に更新して最終地点の dp を出力

// 📌 型指定まとめ
// 変数・関数	型	用途
// $dp	array<int>	各位置の到達通り数
// FenwickTree::add()	(int, int): void	指定位置に加算
// FenwickTree::sum()	(int): int	前からの累積和
// FenwickTree::rangeSum()	(int, int): int	区間和（高速）
// lowerBound()	(array<int>, int): int	二分探索：最初に x 以上の位置
// upperBound()	(array<int>, int): int	二分探索：最初に x より大きい位置