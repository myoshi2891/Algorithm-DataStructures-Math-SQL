<?php

declare(strict_types=1);

// 標準入力を読み取る
$input = trim(stream_get_contents(STDIN));
$tokens = preg_split('/\s+/', $input);

// 入力処理
$N = (int)$tokens[0];
$P = [];
$index = 1;

for ($i = 0; $i < $N; $i++) {
    $row = [];
    for ($j = 0; $j < $N; $j++) {
        $row[] = (int)$tokens[$index++];
    }
    $P[] = $row;
}

// 数字kの位置を記録
$rowPos = array_fill(0, $N + 1, 0);
$colPos = array_fill(0, $N + 1, 0);

/**
 * @var int[][] $P
 */
for ($i = 0; $i < $N; $i++) {
    for ($j = 0; $j < $N; $j++) {
        $val = $P[$i][$j];
        if ($val !== 0) {
            $rowPos[$val] = $i;
            $colPos[$val] = $j;
        }
    }
}

$rowPerm = [];
$colPerm = [];

for ($k = 1; $k <= $N; $k++) {
    $rowPerm[] = $rowPos[$k];
    $colPerm[] = $colPos[$k];
}

// ===== Fenwick Tree クラス定義 =====
class FenwickTree
{
    /** @var int[] */
    private array $tree;
    private int $size;

    public function __construct(int $n)
    {
        $this->size = $n + 2;
        $this->tree = array_fill(0, $this->size + 1, 0);
    }

    public function update(int $i): void
    {
        $i++;
        while ($i < $this->size) {
            $this->tree[$i]++;
            $i += $i & -$i;
        }
    }

    public function query(int $i): int
    {
        $i++;
        $res = 0;
        while ($i > 0) {
            $res += $this->tree[$i];
            $i -= $i & -$i;
        }
        return $res;
    }
}

/**
 * 転倒数を数える関数
 * @param int[] $arr
 * @param int $N
 * @return int
 */
function countInversions(array $arr, int $N): int
{
    $bit = new FenwickTree($N);
    $inv = 0;
    for ($i = count($arr) - 1; $i >= 0; $i--) {
        $inv += $bit->query($arr[$i] - 1);
        $bit->update($arr[$i]);
    }
    return $inv;
}

// 行・列それぞれの転倒数を計算
$rowMoves = countInversions($rowPerm, $N);
$colMoves = countInversions($colPerm, $N);

// 出力
echo ($rowMoves + $colMoves) . PHP_EOL;