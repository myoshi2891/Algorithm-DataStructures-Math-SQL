<!-- 以下は PHP 8.2.8 を用いた解法です。
**制約: N ≤ 100,000、各座標 ≤ 500,000** に対応できるよう、**計算量 O(N log N)**、メモリ効率にも注意しています。

---

## ✅ 解法方針（2次元LIS）

1. `X` 昇順、`Y` 降順にソート
2. `Y` のみ取り出し、\*\*LIS（最長増加部分列）\*\*を `二分探索` によって求める

---

## ✅ PHP 実装（関数分離、型付き）

```php -->
<?php

/**
 * 最大ネスト数を求める関数
 *
 * @param array<int, array{0: int, 1: int}> $boxes - 各箱の [X, Y] を格納した配列
 * @return int - 最大ネスト数
 */
function maxNestingDepth(array $boxes): int {
    // ソート: X 昇順、同じなら Y 降順
    usort($boxes, function ($a, $b) {
        if ($a[0] === $b[0]) {
            return $b[1] <=> $a[1]; // Y 降順
        }
        return $a[0] <=> $b[0];     // X 昇順
    });

    $lis = []; // 最長増加部分列 (Y方向)

    foreach ($boxes as [$x, $y]) {
        $pos = binarySearchLeft($lis, $y);
        if ($pos === count($lis)) {
            $lis[] = $y;
        } else {
            $lis[$pos] = $y;
        }
    }

    return count($lis);
}

/**
 * 二分探索（lower_bound）で挿入位置を探す
 *
 * @param array<int> $arr - 単調増加配列
 * @param int $target - 挿入対象の数
 * @return int - 挿入すべき位置（最左の >= target の位置）
 */
function binarySearchLeft(array $arr, int $target): int {
    $left = 0;
    $right = count($arr);

    while ($left < $right) {
        $mid = intdiv($left + $right, 2);
        if ($arr[$mid] < $target) {
            $left = $mid + 1;
        } else {
            $right = $mid;
        }
    }

    return $left;
}

/**
 * メイン処理：標準入力から読み込み、最大ネスト数を出力
 */
function main(): void {
    $input = file('php://stdin', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $n = (int)$input[0];

    $boxes = [];
    for ($i = 1; $i <= $n; $i++) {
        [$x, $y] = array_map('intval', explode(' ', $input[$i]));
        $boxes[] = [$x, $y];
    }

    $result = maxNestingDepth($boxes);
    echo $result . PHP_EOL;
}

main();
// ```

// ---

// ## ✅ 処理時間・メモリ使用量

// | 項目      | 内容                        |
// | ------- | ------------------------- |
// | 時間計算量   | `O(N log N)` （ソート + LIS）  |
// | 空間計算量   | `O(N)`（LIS用配列 + 入力配列）     |
// | メモリ使用量例 | ≒15〜20MB（`N=100,000` の場合） |
// | 対応最大サイズ | `N ≦ 100,000`             |

// ---

// ## ✅ 入力例

// ```
// 5
// 30 50
// 10 30
// 40 10
// 50 20
// 40 60
// ```

// ### 出力:

// ```
// 3
// ```

// ---

// ## ✅ 解説補足

// * `usort` による `X` 昇順、`Y` 降順ソートで誤ネストを防止
// * `binarySearchLeft` による効率的な LIS 構築
// * PHP 8.2 の型サポート（配列要素のタプル型も docblock で明示）

// ---

// ご希望があれば、ネスト順序の復元や可視化解説も可能です。