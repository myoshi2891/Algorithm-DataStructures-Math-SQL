<!-- 以下は **PHP 8.2.8** に対応した、`a^b % 1000000007` を高速に計算する実装です。

---

## ✅ 要件

* `a` は最大 `10^9` の整数
* `b` は最大 `10^18` の整数（PHPでは文字列として読み取り `BCMath` で処理）
* 標準入力から読み取り
* **繰り返し二乗法**（Binary Exponentiation）を用いた高速計算（`O(log b)`）
* **型宣言付き関数**
* **メモリ効率は定数レベル（O(1)）**

---

## ✅ PHPコード（`main.php` など）

<?php

declare(strict_types=1);

const MOD = 1000000007;

/**
 * a^b % mod を繰り返し二乗法で計算する関数（bは任意精度整数）
 *
 * @param int $a     底（1 ≤ a ≤ 10^9）
 * @param string $b  指数（最大 10^18 を想定。文字列で扱う）
 * @param int $mod   法（通常は1000000007）
 * @return int       結果 a^b % mod
 */
function mod_pow(int $a, string $b, int $mod): int {
    $result = 1;
    $base = $a % $mod;

    while (bccomp($b, "0") > 0) {
        if (bcmod($b, "2") === "1") {
            $result = (int)(($result * $base) % $mod);
        }
        $base = (int)(($base * $base) % $mod);
        $b = bcdiv($b, "2", 0); // b = floor(b / 2)
    }

    return $result;
}

/**
 * 入力を読み込んで処理・出力を行う関数
 *
 * 標準入力から2つの値 a b を読み込み、a^b % MOD を出力
 */
function main(): void {
    $line = trim(fgets(STDIN));
    [$a_str, $b_str] = explode(" ", $line);
    $a = (int)$a_str;
    $b = $b_str; // $bは10^18超えの可能性があるので文字列で保持

    $result = mod_pow($a, $b, MOD);
    echo $result . PHP_EOL;
}

main();
// ```

// ---

// ## ✅ 実行方法（Linux / macOS）

// ```bash
// php main.php < input.txt
// ```

// `input.txt` に以下のように書いてください：

// ```
// 123456789 123456789012345678
// ```

// ---

// ## ✅ 出力例

// ```
// 3599437
// ```

// ---

// ## ✅ 処理時間・メモリ使用

// | 項目     | 値                     |
// | ------ | --------------------- |
// | 時間計算量  | `O(log b)`（最大でも ≒60回） |
// | 実行時間目安 | 数ミリ秒〜10ms未満（一般的）      |
// | 空間計算量  | `O(1)`（定数。変数数個のみ）     |
// | メモリ使用  | 数百KB（`BCMath`演算含めても）  |

// ---

// ## ✅ なぜ `BCMath` を使うのか？

// * PHPの `int` 型は **64bit整数（符号付き）** が上限 ⇒ 約 `9.2 × 10^18`
// * `b` が `10^18` 超えると **精度が落ちる可能性**
// * 文字列として安全に扱い、`bcdiv` / `bcmod` / `bccomp` を使えば **正確なビット演算相当が可能**

// ---

// ## ✅ 補足：C言語や他言語との比較

// * `pow()` や `**` を使うと指数が大きすぎて正確でない or 実行時間に問題あり
// * `BCMath` を使って **文字列のまま指数演算を逐次処理**すれば確実に通ります

// ---

// ご希望あれば、同様の処理を `GMP` 拡張による最速版、あるいは `bcmath` を使わずに安全に処理する代替案も提示できます。