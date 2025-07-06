<!-- 以下は、**PHP** を用いて「配列 A の中に X 未満の要素がいくつあるか」を効率的に求めるプログラムです。
処理時間とメモリ使用量を意識し、**ソート + 二分探索（lower\_bound）** を用います。

---

## ✅ アルゴリズム概要

1. **配列 A を昇順ソート**：`O(N log N)`
2. 各クエリ `X` に対して **二分探索**（`X` 未満の要素数）を求める：`O(Q log N)`
3. **標準入力**：`fgets()` + `explode()` を使用
4. **型注釈**：PHP 8.2 に準拠（`array<int>` や `int` 型）

---

## ✅ PHP 実装（PHP 8.2, 型付き）

```php -->
<?php

declare(strict_types=1);

// 二分探索: $arr の中で $target より小さい要素の個数を返す
function lower_bound(array $arr, int $target): int {
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

// 入力読み込み（高速）
$stdin = fopen('php://stdin', 'r');
$N = (int)fgets($stdin);
$A = array_map('intval', explode(' ', trim(fgets($stdin))));
sort($A); // 昇順ソート

$Q = (int)fgets($stdin);

// 結果配列
$results = [];

for ($i = 0; $i < $Q; $i++) {
    $X = (int)fgets($stdin);
    $count = lower_bound($A, $X);
    $results[] = $count;
}

// 出力（高速）
echo implode("\n", $results) . "\n";
// ```

// ---

// ## ✅ 入力例の確認

// ### 入力:

// ```
// 5
// 1 3 3 3 1
// 2
// 4
// 3
// ```

// ### 出力:

// ```
// 5
// 2
// ```

// ---

// ## ✅ 処理時間・メモリの見積もり

// ### 時間計算量

// | 処理項目      | 計算量                                |
// | --------- | ---------------------------------- |
// | 配列 A のソート | `O(N log N)`                       |
// | 各クエリの探索   | `O(Q log N)`                       |
// | 合計        | `O(N log N + Q log N)`（≒ 2×10⁶ 以内） |

// ✅ 最大入力 (`N = Q = 10^5`) に対しても **十分高速（1 秒以内）**

// ---

// ### メモリ使用量（推定）

// * `A`: 約 `100,000 × 4B = 約 400 KB`
// * `X` クエリ: 約 `400 KB`
// * `$results`: 最大 `400 KB`
// * その他合わせて：約 **1〜2 MB**

// ✅ 1024 MiB 制限に **十分収まる**

// ---

// ## ✅ 解法まとめ

// | 特徴    | 内容                              |
// | ----- | ------------------------------- |
// | ソート   | `sort($A)` で事前に準備（昇順）           |
// | クエリ応答 | `lower_bound()` で `X` 未満の要素数を返す |
// | 時間効率  | `O(log N)` × Q で高速              |
// | メモリ効率 | 数MB程度で非常に良好                     |

// ---