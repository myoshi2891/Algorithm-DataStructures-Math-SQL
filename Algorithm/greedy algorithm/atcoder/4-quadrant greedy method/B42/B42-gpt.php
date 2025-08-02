<!-- 以下は、**PHP 8.2.8** で動作する、正確かつ高速な解法です。
全ケースで正解となる **4象限貪欲法** を使い、関数化 + 型指定付き（PHPDocコメント）で記述しています。

---

## ✅ 実装方針（再確認）

スコアは `|ΣAi| + |ΣBi|`。
カードの選び方によって、最終的な `(ΣA, ΣB)` の長さを最大化すればよいため、

* **4象限の符号パターン** `(±1, ±1)` を使って、
* 各方向に「貢献するカードだけ」を選んで加算、
* 最終的なスコアを求めて、その中の最大を出力します。

---

## ✅ PHP 実装（PHP 8.2.8対応）

```php -->
<?php

/**
 * 与えられたカードの集合に対し、スコア |ΣA| + |ΣB| の最大値を求める。
 *
 * @param array<array{0: int, 1: int}> $cards 各カードの [A, B] ペア配列
 * @return int 最大スコア
 */
function maxScore(array $cards): int {
    $maxScore = 0;

    // 4つの象限に対応する符号の組み合わせ
    $signs = [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
    ];

    foreach ($signs as [$sa, $sb]) {
        $sumA = 0;
        $sumB = 0;

        foreach ($cards as [$a, $b]) {
            $va = $sa * $a;
            $vb = $sb * $b;

            if ($va + $vb > 0) {
                $sumA += $a;
                $sumB += $b;
            }
        }

        $score = abs($sumA) + abs($sumB);
        if ($score > $maxScore) {
            $maxScore = $score;
        }
    }

    return $maxScore;
}

/**
 * 標準入力から読み込み、最大スコアを出力する
 * 処理時間: O(N)
 * メモリ使用量: O(N)
 */
function main(): void {
    $lines = explode("\n", trim(file_get_contents("php://stdin")));
    $n = (int)$lines[0];

    $cards = [];

    for ($i = 1; $i <= $n; $i++) {
        [$a, $b] = array_map('intval', explode(' ', trim($lines[$i])));
        $cards[] = [$a, $b];
    }

    $result = maxScore($cards);
    echo $result . PHP_EOL;
}

main();
// ```

// ---

// ## ✅ 実行例

// 標準入力に以下を与えると：

// ```
// 5
// 2 8
// 4 -5
// 5 -3
// -4 1
// -2 -3
// ```

// 実行結果：

// ```bash
// php solve.php < input.txt
// ```

// 出力：

// ```
// 18
// ```

// ---

// ## ✅ 計算量とメモリ効率

// | 項目        | 値                 |
// | --------- | ----------------- |
// | 時間計算量     | **O(N)**（4回走査）    |
// | 空間計算量     | **O(N)**（カード配列のみ） |
// | 型チェック・安全性 | PHPDocで明示         |

// ---

// ## ✅ 補足（PHP特有の注意点）

// * PHP は静的型を強制しないが、`array<array{int, int}>` のように **PHPDoc で型明示**すると IDE 補完や静的解析での安心感が得られます。
// * 演算コストやメモリ使用は `1e5` 件程度なら十分余裕があります（約2〜3MB）。

// ---

// ご希望があれば、`カードのインデックス出力` や `高速I/O処理（fscanf対応）` なども実装可能です。