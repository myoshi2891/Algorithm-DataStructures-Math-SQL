<!-- 以下は、**PHP 8.2.8** を使用して、**Knapsack 2（価値軸DP）** を解くための実装です。

## ✅ 特徴

* **関数分割済み**
* **引数と戻り値の型指定**
* **処理時間・メモリ制約（10秒・1024MiB）を考慮**
* `int` 型は PHP 内部で 64bit まで扱える（W = 1e9 に対応可能）

## ✅ 使用関数一覧と説明

| 関数名               | 説明                | パラメータ・返却値                                                        |
| ----------------- | ----------------- | ---------------------------------------------------------------- |
| `parseInput()`    | 標準入力からデータを取得して構造化 | 戻り値: `array{int, int, array<array{int, int}>}`                   |
| `solveKnapsack()` | DP配列で最大の価値を計算     | 引数: `int $N, int $W, array<array{int,int}> $items`<br>返り値: `int` |
| `main()`          | 全体統括（入出力）         | 戻り値: `void`                                                      |

---

## ✅ PHPコード（PHP 8.2.8）

<?php

/**
 * 標準入力から値を読み込み、品物情報を構造化して返す
 *
 * @return array{int, int, array<array{int, int}>} [N, W, items]
 */
function parseInput(): array {
    $lines = explode("\n", trim(file_get_contents("php://stdin")));
    [$N, $W] = array_map('intval', explode(' ', array_shift($lines)));
    $items = [];

    foreach ($lines as $line) {
        [$w, $v] = array_map('intval', explode(' ', $line));
        $items[] = [$w, $v]; // [重さ, 価値]
    }

    return [$N, $W, $items];
}

/**
 * ナップザック問題を価値軸DPで解き、最大の価値を返す
 *
 * @param int $N 品物数
 * @param int $W ナップサック容量
 * @param array<array{int, int}> $items 品物の [重さ, 価値] の配列
 * @return int 容量W以下で得られる最大の価値
 */
function solveKnapsack(int $N, int $W, array $items): int {
    $maxValue = 0;
    foreach ($items as [$w, $v]) {
        $maxValue += $v;
    }

    $INF = PHP_INT_MAX;
    $dp = array_fill(0, $maxValue + 1, $INF);
    $dp[0] = 0;

    foreach ($items as [$w, $v]) {
        for ($val = $maxValue; $val >= $v; --$val) {
            if ($dp[$val - $v] !== $INF && $dp[$val - $v] + $w <= $W) {
                $dp[$val] = min($dp[$val], $dp[$val - $v] + $w);
            }
        }
    }

    // dp[v] <= W を満たす最大の v を探す
    for ($v = $maxValue; $v >= 0; --$v) {
        if ($dp[$v] <= $W) {
            return $v;
        }
    }

    return 0;
}

/**
 * メイン関数：標準入力を読み取り、解を出力
 *
 * @return void
 */
function main(): void {
    [$N, $W, $items] = parseInput();
    $result = solveKnapsack($N, $W, $items);
    echo $result . PHP_EOL;
}

main();

// ## ✅ 入力例（input.txt）

// ```
// 4 7
// 3 13
// 3 17
// 5 29
// 1 10
// ```

// ### 実行方法

// ```bash
// php main.php < input.txt
// ```

// ## ✅ 計算量・メモリ見積もり

// | 指標     | 値                                    |
// | ------ | ------------------------------------ |
// | 時間計算量  | `O(N × sum_v)` ≈ 100 × 100000 = 10^7 |
// | メモリ使用量 | 約 400 KB（dp配列：100001 × 8バイト）         |
// | 実行時間   | 数百ミリ秒〜1秒以下（十分高速）                     |
// | メモリ制限  | 1024 MiB 制限内に収まる                     |

// ## ✅ 補足

// * PHPは `array` 型が柔軟なので、型アノテーションをコメントで補っています。
// * より厳格な型検査をしたい場合は [Psalm](https://psalm.dev/) のような静的解析ツールも有効です。