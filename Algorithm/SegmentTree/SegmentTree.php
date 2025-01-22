<?php
class SegmentTree
{
    private $tree;
    private $n;

    public function __construct($arr)
    {
        $this->n = count($arr);
        $this->tree = array_fill(0, 4 * $this->n, 0);
        $this->build($arr, 0, 0, $this->n - 1);
    }

    // セグメントツリーを構築する
    private function build($arr, $node, $start, $end)
    {
        if ($start == $end) {
            // 葉ノード
            $this->tree[$node] = $arr[$start];
        } else {
            $mid = intdiv($start + $end, 2);
            $leftNode = 2 * $node + 1;
            $rightNode = 2 * $node + 2;

            // 左右の子ノードを構築
            $this->build($arr, $leftNode, $start, $mid);
            $this->build($arr, $rightNode, $mid + 1, $end);

            // 現在のノードの値を設定（最大値）
            $this->tree[$node] = max($this->tree[$leftNode], $this->tree[$rightNode]);
        }
    }

    // 範囲クエリ
    private function query($node, $start, $end, $l, $r)
    {
        if ($r < $start || $l > $end) {
            // クエリ範囲外
            return -PHP_INT_MAX;
        }
        if ($l <= $start && $end <= $r) {
            // 完全にクエリ範囲内
            return $this->tree[$node];
        }

        // 部分的にクエリ範囲に重なる場合
        $mid = intdiv($start + $end, 2);
        $leftQuery = $this->query(2 * $node + 1, $start, $mid, $l, $r);
        $rightQuery = $this->query(2 * $node + 2, $mid + 1, $end, $l, $r);
        return max($leftQuery, $rightQuery);
    }

    // 範囲クエリの呼び出し
    public function rangeQuery($l, $r)
    {
        return $this->query(0, 0, $this->n - 1, $l, $r);
    }
}

// 入力の読み込み
fscanf(STDIN, "%d", $N);
$A = array_map('intval', explode(' ', trim(fgets(STDIN))));
fscanf(STDIN, "%d", $D);

// セグメントツリーの構築
$segTree = new SegmentTree($A);

// クエリの処理
for ($i = 0; $i < $D; $i++) {
    fscanf(STDIN, "%d %d", $L, $R);
    $L--; // 0-based index に変換
    $R--; // 0-based index に変換

    // 左側と右側の最大値を計算
    $maxLeft = $L > 0 ? $segTree->rangeQuery(0, $L - 1) : -PHP_INT_MAX;
    $maxRight = $R < $N - 1 ? $segTree->rangeQuery($R + 1, $N - 1) : -PHP_INT_MAX;

    // 結果を出力
    echo max($maxLeft, $maxRight) . "\n";
}
