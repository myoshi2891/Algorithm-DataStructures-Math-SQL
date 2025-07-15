<!-- 以下に、**PHP 8.2.8** を用いた「最長回文部分列の長さ（Longest Palindromic Subsequence）」を求めるコードを提示します。
**型指定・関数化・処理時間とメモリ効率を考慮**した実装です。

---

## ✅ PHPコード（標準入力＋DPでの最長回文部分列）

<?php

declare(strict_types=1);

/**
 * 与えられた文字列 S に対し、削除のみで構成可能な最長回文部分列の長さを求める。
 *
 * @param string $s 入力文字列（英小文字のみ）
 * @return int 最長回文部分列の長さ
 */
function longestPalindromicSubsequence(string $s): int
{
    $n = strlen($s);

    // dp[i][j] := S[i..j]の最長回文部分列の長さ
    $dp = array_fill(0, $n, array_fill(0, $n, 0));

    // 長さ1の部分列は常に回文（自己一致）
    for ($i = 0; $i < $n; $i++) {
        $dp[$i][$i] = 1;
    }

    // 部分列の長さ2からnまでのDP
    for ($length = 2; $length <= $n; $length++) {
        for ($i = 0; $i <= $n - $length; $i++) {
            $j = $i + $length - 1;

            if ($s[$i] === $s[$j]) {
                $dp[$i][$j] = ($length === 2) ? 2 : $dp[$i + 1][$j - 1] + 2;
            } else {
                $dp[$i][$j] = max($dp[$i + 1][$j], $dp[$i][$j - 1]);
            }
        }
    }

    return $dp[0][$n - 1];
}

// 標準入力からの読み取り処理（複数行）
$input = explode("\n", trim(file_get_contents("php://stdin")));
$n = (int)$input[0];
$s = $input[1];

// 関数呼び出しと出力
$result = longestPalindromicSubsequence($s);
echo $result . PHP_EOL;

// ## ✅ 入力例と出力

// ### 入力：

// ```
// 11
// programming
// ```

// ### 出力：

// ```
// 4
// ```

// ---

// ## ✅ 処理量の見積もり

// | 項目     | 値                           |
// | ------ | --------------------------- |
// | 時間計算量  | O(N²)（最大 1000 × 1000 = 10⁶） |
// | 空間計算量  | O(N²)（1000×1000 要素）≈ 4〜8MB  |
// | メモリ制限  | 1024 MiB → 問題なし             |
// | 実行時間制限 | 1秒 → 通常の PHP 実行でも問題なし       |

// ---

// ## ✅ 型とコメントに関する補足

// * PHP 8.2 では関数の戻り値型 (`int`) や引数型 (`string`) が厳密にサポートされています。
// * `$dp` は二次元配列 `int[][]` で、PHPの動的配列構造を使用。
// * 配列初期化は `array_fill()` を使って高速・省メモリ化。

// ---

// ## ✅ 追加対応可能な事項

// * 実際の回文を**復元して出力する拡張バージョン**
// * メモリ最適化（1次元DP化）※可能だが読みづらくなる

// ご希望があれば続けてご提供可能です。