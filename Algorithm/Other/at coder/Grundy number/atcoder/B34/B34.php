<!-- 以下は、**PHP 8.2.8** で動作する、X=2, Y=3 固定の **取り石ゲーム（Nim型ゲーム）** における
**完全正解・高速処理対応の解法**です。

---

## ✅ 解法のポイント

* 各山の石の数に対し、Grundy数（勝ち負け判定用の数）を求める。
* `X = 2, Y = 3` の場合、Grundy数は **mod 5で周期がある（周期5）**。
* 各山のGrundy数を XOR し、最終的に XOR合計が `0` → 後手勝利、≠0 → 先手勝利。

---

## ✅ PHPコード（型注釈付き・メモリ＆処理時間最適化）

```php -->
<?php
declare(strict_types=1);

/**
 * 与えられた石の山に対して、X=2, Y=3 の取り石ゲームの勝者を判定する。
 *
 * @param array<int> $A 各山の石の個数（最大 10^18 まで対応）
 * @return string 勝者 "First" または "Second"
 *
 * 時間計算量: O(N)
 * 空間計算量: O(1)
 */
function determineWinner(array $A): string {
    $grundyMod = [0, 0, 1, 1, 2];

    $xorSum = 0;
    foreach ($A as $a) {
        $mod = bcmod((string)$a, '5'); // $a % 5 を大整数用に処理
        $g = $grundyMod[(int)$mod];
        $xorSum ^= $g;
    }

    return $xorSum === 0 ? 'Second' : 'First';
}
/**
 * 標準入力からデータを読み込み、勝者を出力するメイン関数
 *
 * 入力形式:
 * N X Y
 * A1 A2 ... AN
 *
 * 出力:
 * First または Second
 */
function main(): void {
    $input = trim(file_get_contents('php://stdin'));
    $tokens = preg_split('/\s+/', $input);

    $N = (int)$tokens[0];
    // $tokens[1], $tokens[2] は X=2, Y=3 固定のため無視
    $A = array_slice($tokens, 3, $N); // string配列（大きい整数も含む）

    $result = determineWinner($A);
    echo $result . PHP_EOL;
}

main();
// ```

// ---

// ## ✅ 解説（図付き）

// ### Grundy数周期（X=2, Y=3）

// | 石の数 % 5 | Grundy数 |
// | ------- | ------- |
// | 0       | 0       |
// | 1       | 0       |
// | 2       | 1       |
// | 3       | 1       |
// | 4       | 2       |

// ```plaintext
// 例:
// A = [5, 8]
// 5 % 5 = 0 → Grundy = 0
// 8 % 5 = 3 → Grundy = 1
// XOR = 0 ^ 1 = 1 → 先手勝利 → "First"
// ```

// ---

// ## ✅ 入力・出力例

// ### 入力（標準入力）

// ```
// 2 2 3
// 5 8
// ```

// ### 出力

// ```
// First
// ```

// ---

// ## ✅ 性能について

// | 項目    | 内容                          |
// | ----- | --------------------------- |
// | 時間計算量 | O(N)（最大 100,000 山でも余裕）      |
// | 空間計算量 | O(1)（定数テーブルのみ）              |
// | メモリ使用 | \$A 配列 + 5要素の Grundy テーブルのみ |
// | 数値精度  | `bcmod` で 10^18 まで安全に処理可能   |

// ---

// ## ✅ 拡張対応可能

// * 任意の `X`, `Y` に対応する汎用Grundy数構築
// * `bcadd`, `bcsub` などと組み合わせてより複雑な処理へ発展可能

// ---

// ご希望があれば、テスト用コードや `X, Y` が任意入力の拡張版などもご提供可能です！