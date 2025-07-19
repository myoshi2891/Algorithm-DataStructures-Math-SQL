<!-- 以下に、**PHP 8.2.8** 向けに、**2つの整数 A, B の最小公倍数（LCM）を求める関数ベースの実装**を示します。

---

## ✅ 仕様概要

* **入力**：標準入力（例: `fgets(STDIN)`）で与えられる2つの整数 A, B（1 ≤ A, B ≤ 10⁹）
* **出力**：最小公倍数（LCM）
* **計算式**：

  $$
  \text{LCM}(A, B) = \frac{A}{\gcd(A, B)} \times B
  $$

  ※ オーバーフロー防止のために順序に注意（`A / GCD` を先に行う）

---

## ✅ PHP 実装（型明示・関数化）

<?php

/**
 * 最大公約数（GCD）をユークリッドの互除法で求める
 *
 * @param int $a - 正の整数
 * @param int $b - 正の整数
 * @return int - aとbの最大公約数
 *
 * 時間計算量：O(log(min(a, b)))
 */
function gcd(int $a, int $b): int {
    while ($b !== 0) {
        $temp = $b;
        $b = $a % $b;
        $a = $temp;
    }
    return $a;
}

/**
 * 最小公倍数（LCM）を求める関数
 *
 * @param int $a - 正の整数
 * @param int $b - 正の整数
 * @return int|string - aとbの最小公倍数（オーバーフロー時にはstring）
 *
 * 処理順に注意：a / GCD → b を掛ける（int型上限対策）
 */
function lcm(int $a, int $b): int|string {
    $g = gcd($a, $b);
    $div = intdiv($a, $g);
    $product = $div * $b;

    // オーバーフロー対策（PHP_INT_MAXを超えた場合はstringに）
    if ($product > PHP_INT_MAX) {
        return bcmul((string)$div, (string)$b); // 多倍長整数で計算
    }

    return $product;
}

/**
 * メイン処理（標準入力を読み取り、LCMを出力）
 *
 * @return void
 */
function main(): void {
    $line = trim(fgets(STDIN));
    [$a, $b] = array_map('intval', explode(' ', $line));

    $result = lcm($a, $b);
    echo $result . PHP_EOL;
}

main();

// ## ✅ 実行例

// **入力:**

// ```
// 25 30
// ```

// **出力:**

// ```
// 150
// ```

// ---

// ## ✅ 性能解析

// | 項目        | 内容                                      |
// | --------- | --------------------------------------- |
// | 時間計算量     | O(log(min(A, B))) （GCD部分がボトルネック）        |
// | 空間計算量     | O(1)（GCD・LCM として数個の整数のみ使用）              |
// | メモリ使用     | 数十バイト（変数 + 一時計算）                        |
// | オーバーフロー対応 | `PHP_INT_MAX` 超えを検知し `bcmul()`（多倍長演算）使用 |

// ---

// ## ✅ 多倍長処理の注意点

// * `PHP_INT_MAX ≒ 9223372036854775807`（64bit環境）
// * 例：`998244353 * 998244853 = 996492287418565109` → **OK**
// * ただし、`10^9 * 10^9 = 10^18` は string 処理推奨

// ---

// ## 🔚 備考

// * 必要に応じて `gmp` 関数での置換も可能です（例：`gmp_gcd`, `gmp_lcm`）
// * `bcmath` は標準で使えるため環境依存しにくいです
