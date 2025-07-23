<!-- 以下は、**PHP 8.2.8** を用いた実装です。
`1 以上 N 以下の整数のうち、3, 5, 7 のいずれかで割り切れる数の個数` を高速に求めるため、**包除原理**を用いた定数時間解法となっています。

---

## ✅ 解法：包除原理（Inclusion-Exclusion）

集合 A: 3で割り切れる数
集合 B: 5で割り切れる数
集合 C: 7で割り切れる数

```text
|A ∪ B ∪ C| = |A| + |B| + |C| - |A ∩ B| - |A ∩ C| - |B ∩ C| + |A ∩ B ∩ C|
```

---

## ✅ PHP 実装（型明示 + コメント付き）

```php -->
<?php

/**
 * N 以下の整数のうち、3,5,7 のいずれかで割り切れる個数を返す
 *
 * @param int|string $N 1以上10^12以下の整数（10^12 を超える可能性を考慮し string も許容）
 * @return string 条件を満たす個数（大きな値のため string で返す）
 */
function countMultiplesOf3or5or7(int|string $N): string {
    // 任意精度整数に変換（bcmath 使用）
    $N = (string)$N;

    // 小さな関数：floor(N / x)
    $div = function(string $x) use ($N): string {
        return bcdiv($N, $x, 0); // 0桁 → floor動作
    };

    // Inclusion-Exclusion
    $result = bcadd(bcadd($div("3"), $div("5")), $div("7")); // +A+B+C
    $result = bcsub($result, $div(bcmul("3", "5")));         // -AB
    $result = bcsub($result, $div(bcmul("3", "7")));         // -AC
    $result = bcsub($result, $div(bcmul("5", "7")));         // -BC
    $result = bcadd($result, $div(bcmul("105", "1")));       // +ABC

    return $result;
}

// 標準入力から N を取得
$N = trim(fgets(STDIN));
echo countMultiplesOf3or5or7($N) . PHP_EOL;

// ## ✅ 実行方法

// ```bash
// php main.php < input.txt
// ```

// ---

// ## ✅ 入力例と出力例

// #### 入力:

// ```
// 10
// ```

// #### 出力:

// ```
// 6
// ```

// ---

// ## ✅ 実行時間・メモリ消費量

// | 項目         | 内容                               |
// | ---------- | -------------------------------- |
// | **計算量**    | O(1)（bcmath の除算・加算のみ）            |
// | **実行時間**   | 約 0.1 ～ 1.0 ms（bcmath使用のため少し遅め）  |
// | **メモリ使用量** | 非常に小さい（約 1KB 未満）                 |
// | **精度**     | `bcmath` により任意精度対応 (`N ≤ 10^12`) |

// ---

// ## ✅ 注意点

// * `int` 型は 64bit 環境であっても `10^12` に対し桁数制限があるため、**`bcmath` 拡張**を使って任意精度計算を行っています。
// * 返却型は **`string`** です（bcmathの仕様上）。

// ---

// ご希望があれば、`gmp` 拡張での高速版や、逐次的なループによるナイーブ解法もご提示できます。