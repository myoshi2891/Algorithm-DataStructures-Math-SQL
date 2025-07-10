<!-- 以下は、**PHP 8.2.8** での「カエルの最小ジャンプコスト」問題の実装です。
**処理時間・メモリの消費量を最小限に抑える**ため、\*\*動的計画法（DP）＋ 空間最適化（O(1)メモリ）\*\*を採用しています。

---

## ✅ PHP 実装（型明示、O(1)メモリ最適化）
<?php

function main(): void {
    $input = trim(stream_get_contents(STDIN));
    $lines = explode("\n", $input);
    
    /** @var int $N */
    $N = (int)$lines[0];

    /** @var array<int> $h */
    $h = array_map('intval', explode(' ', trim($lines[1])));

    if ($N === 2) {
        echo abs($h[1] - $h[0]) . PHP_EOL;
        return;
    }

    /** @var int $prev2 最小コスト（i-2） */
    $prev2 = 0;

    /** @var int $prev1 最小コスト（i-1） */
    $prev1 = abs($h[1] - $h[0]);

    for ($i = 2; $i < $N; ++$i) {
        /** @var int $cost1 足場 i-1 から来た場合のコスト */
        $cost1 = $prev1 + abs($h[$i] - $h[$i - 1]);

        /** @var int $cost2 足場 i-2 から来た場合のコスト */
        $cost2 = $prev2 + abs($h[$i] - $h[$i - 2]);

        /** @var int $curr 現在の足場 i への最小コスト */
        $curr = min($cost1, $cost2);

        $prev2 = $prev1;
        $prev1 = $curr;
    }

    echo $prev1 . PHP_EOL;
}

main();

// ## ✅ 入出力形式

// 標準入力から以下の形式で与えられます：

// ```
// N
// h1 h2 h3 ... hN
// ```

// ### 例：

// ```
// 6
// 30 10 60 10 60 50
// ```

// 出力：

// ```
// 40
// ```

// ---

// ## ✅ 計算量とメモリ効率

// | 指標    | 値              |
// | ----- | -------------- |
// | 時間計算量 | O(N)           |
// | 空間計算量 | O(1)（定数個の変数のみ） |
// | 入力制約  | 2 ≤ N ≤ 10⁵    |

// ## ✅ 解法のポイント

// * `dp[i]` の代わりに、**直前2ステップ（`prev1`, `prev2`）だけ保持**。
// * `abs()` でジャンプコストを計算。
// * \*\*配列未使用（O(N)）\*\*のバージョンも実装可能。

// ## ✅ O(N) メモリバージョン（DP配列使用）

// 参考用に、メモリを多く使うフルDP版も示します：

// ```php
// $dp = array_fill(0, $N, 0);
// $dp[1] = abs($h[1] - $h[0]);
// for ($i = 2; $i < $N; $i++) {
//     $dp[$i] = min(
//         $dp[$i - 1] + abs($h[$i] - $h[$i - 1]),
//         $dp[$i - 2] + abs($h[$i] - $h[$i - 2])
//     );
// }
// echo $dp[$N - 1] . PHP_EOL;