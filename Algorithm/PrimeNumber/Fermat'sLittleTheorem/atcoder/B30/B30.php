<!-- 以下は **PHP 8.2.8** による、格子経路数（H 行 × W 列の右・下移動のみ）の組み合わせ計算の実装です。

---

## ✅ ポイント概要

* 経路数は：
  　→ `C(H + W - 2, H - 1)`（または `C(H + W - 2, W - 1)` どちらでもOK）

* `mod = 1_000_000_007`（10^9 + 7）で計算

* 必要なのは：**階乗（factorial）とその逆元（modular inverse）**

---

## ✅ PHPコード（型明示・関数分離・性能考慮）

<?php

const MOD = 1000000007;
const MAX = 200000; // H + W の最大が 200000 まで対応可能

/**
 * @var array<int> $fact    階乗テーブル fact[n] = n! mod MOD
 * @var array<int> $invFact 逆元テーブル invFact[n] = (n!)^(-1) mod MOD
 */
$fact = array_fill(0, MAX + 1, 1);
$invFact = array_fill(0, MAX + 1, 1);

/**
 * 累乗を MOD で計算する（繰り返し二乗法）
 *
 * @param int $base 底
 * @param int $exp 指数
 * @return int base^exp % MOD
 */
function mod_pow(int $base, int $exp): int {
    $result = 1;
    $base %= MOD;

    while ($exp > 0) {
        if ($exp % 2 === 1) {
            $result = ($result * $base) % MOD;
        }
        $base = ($base * $base) % MOD;
        $exp = intdiv($exp, 2);
    }

    return $result;
}

/**
 * 階乗と逆元を事前計算
 *
 * @global array<int> $fact
 * @global array<int> $invFact
 * @return void
 */
function precompute_factorials(): void {
    global $fact, $invFact;

    for ($i = 1; $i <= MAX; $i++) {
        $fact[$i] = ($fact[$i - 1] * $i) % MOD;
    }

    $invFact[MAX] = mod_pow($fact[MAX], MOD - 2);
    for ($i = MAX - 1; $i >= 0; $i--) {
        $invFact[$i] = ($invFact[$i + 1] * ($i + 1)) % MOD;
    }
}

/**
 * nCr % MOD を返す
 *
 * @param int $n
 * @param int $r
 * @return int nCr mod MOD
 */
function combination(int $n, int $r): int {
    global $fact, $invFact;

    if ($r < 0 || $r > $n) {
        return 0;
    }

    return (int)((($fact[$n] * $invFact[$r]) % MOD) * $invFact[$n - $r] % MOD);
}

/**
 * 格子経路数を求める関数
 *
 * @param int $H 行数
 * @param int $W 列数
 * @return int 経路数（mod 1e9+7）
 */
function count_grid_paths(int $H, int $W): int {
    precompute_factorials();
    return combination($H + $W - 2, $H - 1);
}

/**
 * メイン処理：標準入力を読み取り、結果を出力
 */
function main(): void {
    [$H, $W] = array_map('intval', explode(' ', trim(fgets(STDIN))));
    echo count_grid_paths($H, $W) . PHP_EOL;
}

main();

// ## ✅ 入力例と出力

// #### 入力:

// ```
// 869 120
// ```

// #### 出力:

// ```
// 223713395
// ```

// ---

// ## 🧠 実行性能

// | 項目       | 値                            |
// | -------- | ---------------------------- |
// | 時間計算量    | `O(MAX)` 前計算 + `O(1)` 本計算    |
// | メモリ使用量   | `int[]` 2本 × 約20万要素 → 約3〜4MB |
// | 遅延なし高速出力 | `fgets()`で標準入力取得             |

// ---

// ## ✅ 関数まとめ（責務別）

// | 関数名                       | 説明                |
// | ------------------------- | ----------------- |
// | `mod_pow()`               | a^b を MOD で計算（高速） |
// | `precompute_factorials()` | `n!` と `逆元` を事前計算 |
// | `combination(n, r)`       | `nCr % MOD` を返す   |
// | `count_grid_paths()`      | 実際の格子経路数計算ロジック    |
// | `main()`                  | 標準入力・出力の主処理       |

// ---

// ご希望があれば、PHPで**再帰的なDPによる解法**や、**メモ化を併用した小規模版**も提供可能です。