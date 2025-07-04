<!-- 以下は、指定された問題に対する **PHP による高速実装**です。
入力制約（最大 100,000 点・クエリ、座標範囲 1〜1500）を考慮し、**2次元累積和（2D prefix sum）** を使って時間・メモリを最適化しています。

---

## ✅ 解法概要（再確認）

* 点の分布を `grid[x][y]` にカウント。
* `prefix[x][y]` に左上から `(x, y)` までの点の個数の累積和を構築。
* クエリに対し、**矩形和を O(1)** で計算。
## ✅ PHP 実装（型明示 + 最適化）
<?php

function readInts(): array {
    return array_map('intval', explode(' ', trim(fgets(STDIN))));
}

function main(): void {
    $SIZE = 1501;

    /** @var int $N */
    $N = intval(trim(fgets(STDIN)));

    // 初期化: 点の存在を記録する2Dグリッド
    /** @var int[][] $grid */
    $grid = array_fill(0, $SIZE, array_fill(0, $SIZE, 0));

    for ($i = 0; $i < $N; $i++) {
        [$x, $y] = readInts();
        $grid[$x][$y]++;
    }

    // 累積和構築: prefix[x][y] は (1,1)〜(x,y) の矩形内の点数
    /** @var int[][] $prefix */
    $prefix = array_fill(0, $SIZE, array_fill(0, $SIZE, 0));

    for ($x = 1; $x < $SIZE; $x++) {
        for ($y = 1; $y < $SIZE; $y++) {
            $prefix[$x][$y] = $grid[$x][$y]
                            + $prefix[$x - 1][$y]
                            + $prefix[$x][$y - 1]
                            - $prefix[$x - 1][$y - 1];
        }
    }

    // クエリ処理
    /** @var int $Q */
    $Q = intval(trim(fgets(STDIN)));

    $output = [];

    for ($i = 0; $i < $Q; $i++) {
        [$a, $b, $c, $d] = readInts();

        $count = $prefix[$c][$d]
               - $prefix[$a - 1][$d]
               - $prefix[$c][$b - 1]
               + $prefix[$a - 1][$b - 1];

        $output[] = $count;
    }

    echo implode("\n", $output) . "\n";
}

main();

// ## ✅ 型解説（PHP 8.2対応）

// | 変数        | 型         | 説明      |
// | --------- | --------- | ------- |
// | `$N, $Q`  | `int`     | 点数、クエリ数 |
// | `$grid`   | `int[][]` | 点の数カウント |
// | `$prefix` | `int[][]` | 2次元累積和  |
// | `$output` | `int[]`   | 各クエリの答え |

// ---

// ## ✅ 実行例（入力）

// ```bash
// $ php main.php
// ```

// ```
// 5
// 1 3
// 2 5
// 3 4
// 2 6
// 3 3
// 3
// 1 3 3 6
// 1 5 2 6
// 1 3 3 5
// ```

// ### 出力

// ```
// 5
// 2
// 4
// ```

// ---

// ## ✅ 実行時間・メモリ分析

// ### 時間計算量

// | 処理     | 時間       |
// | ------ | -------- |
// | 入力     | O(N + Q) |
// | グリッド構築 | O(N)     |
// | 累積和構築  | O(1500²) |
// | クエリ処理  | O(Q)     |

// → 合計 約 3百万ステップ程度。PHP でも余裕で **5秒以内**。

// ### メモリ使用量

// * `grid`, `prefix`: `1501 × 1501 × 4byte × 2 ≒ 約18MB`
// * クエリ・結果出力等を含めても **30MB未満**
// * 制限：1024 MiB 内に余裕で収まる

// ---

// ## ✅ 補足

// * `fgets(STDIN)` + `explode` を使って、**高速な入力処理**を実現。
// * 2次元累積和の使い方は Python や TypeScript と同じです。

// ---

// ご希望であれば、**PHPでも2D累積和の図解やクエリ処理の可視化**も提供できます！必要ですか？