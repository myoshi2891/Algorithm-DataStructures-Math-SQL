<!-- 以下は、**PHP 8.2.8** において、クイズ大会で各生徒の最終正解数を求めるプログラムです。

* 処理時間：`O(N + M)`
* メモリ消費：`O(N)`（生徒数に比例）
* 型の明示とパフォーマンスに注意して関数化

---

## ✅ 実装コード（PHP 8.2.8）

```php -->
<?php
declare(strict_types=1);

/**
 * 生徒ごとの正解数を計算する関数
 *
 * @param int $n 生徒の人数 (1 <= $n <= 200000)
 * @param int $m 問題数 (1 <= $m <= 200000)
 * @param array<int> $a 各問題で間違えた生徒番号（1-indexed）
 * @return array<int> 各生徒の正解数（インデックス: 0ベース）
 */
function calculateCorrectAnswers(int $n, int $m, array $a): array
{
    // 各生徒の間違えた回数を初期化
    $wrongCounts = array_fill(0, $n, 0);

    // 間違えた生徒をカウント
    foreach ($a as $student) {
        $index = $student - 1; // 1-indexed → 0-indexed
        $wrongCounts[$index]++;
    }

    // 各生徒の正解数を計算（M - 間違えた回数）
    $correctAnswers = [];
    for ($i = 0; $i < $n; $i++) {
        $correctAnswers[] = $m - $wrongCounts[$i];
    }

    return $correctAnswers;
}

/**
 * メイン関数：標準入力を読み込み、各生徒の正解数を出力する
 */
function main(): void
{
    // 高速読み取り
    [$n, $m] = array_map('intval', explode(' ', trim(fgets(STDIN))));

    $a = [];
    while (count($a) < $m && $line = fgets(STDIN)) {
        $a = array_merge($a, array_map('intval', explode(' ', trim($line))));
    }

    $result = calculateCorrectAnswers($n, $m, $a);

    foreach ($result as $correct) {
        echo $correct . PHP_EOL;
    }
}

main();

// ## ✅ 入力例

// ```
// 4 6
// 1 4 1 4 2 1
// ```

// ### 実行コマンド

// ```bash
// php main.php < input.txt
// ```

// ### 出力結果

// ```
// 3
// 5
// 6
// 4
// ```

// ---

// ## ✅ 処理時間・メモリ計算

// | 処理                  | 時間計算量        | 空間計算量    |
// | ------------------- | ------------ | -------- |
// | `wrongCounts` 初期化   | O(N)         | O(N)     |
// | 誤答カウント (`foreach`)  | O(M)         | O(1)     |
// | 正解数計算 (`for`)       | O(N)         | O(N)     |
// | 出力 (`foreach echo`) | O(N)         | O(1)     |
// | **合計**              | **O(N + M)** | **O(N)** |

// ---

// ## ✅ 型注釈と注意点（PHP 8.2）

// * `declare(strict_types=1)` により全型チェックを強制
// * `array<int>` 型を使い、配列の内容の型を明示
// * `main()` や `calculateCorrectAnswers()` の返却・引数型をすべて明示
// * `fgets()` からの読み取りは `trim()` + `explode()` で空行や余計な改行にも対応

// ---

// ## ✅ 補足

// 実行時間・メモリ使用量をより詳細に追跡したい場合は、以下の関数が有効です：

// ```php
// echo memory_get_usage(true) . PHP_EOL;
// echo hrtime(true) . PHP_EOL;
// ```

// ご希望あれば、ベンチマーク付きバージョンも提供できます。