<!-- 以下は、**PHP 8.2.8** を用いた「最大収益を得るスケジューリング問題」の解答です。
**貪欲法 + 最大ヒープ（優先度付きキュー）** により、\*\*満点解法（O(N log N + D log N)）\*\*を実現しています。

---

## ✅ 処理の概要

* 各仕事を「開始可能日ごと」に分類
* 各日 `d=1` ～ `D` まで順に、開始可能な仕事をヒープに追加
* 毎日、報酬最大の仕事を1つ選んで実行（最大ヒープから pop）

---

## ✅ PHP 実装（型指定付き、関数分離）

```php -->
<?php
declare(strict_types=1);

/**
 * 最大報酬を計算する関数
 *
 * @param int $n 仕事の数
 * @param int $d 就業可能日数
 * @param array<int, array{0: int, 1: int}> $jobs 各仕事の情報（開始日, 報酬）
 * @return int 最大報酬
 */
function getMaxEarnings(int $n, int $d, array $jobs): int {
    // 各日ごとに開始可能な仕事を分類
    $jobByDay = array_fill(0, $d + 1, []);
    foreach ($jobs as [$x, $y]) {
        if ($x <= $d) {
            $jobByDay[$x][] = $y;
        }
    }

    $maxHeap = new SplMaxHeap(); // 最大ヒープ
    $total = 0;

    for ($day = 1; $day <= $d; $day++) {
        // 今日から可能な仕事を追加
        foreach ($jobByDay[$day] as $reward) {
            $maxHeap->insert($reward);
        }

        // 最大報酬の仕事を選ぶ
        if (!$maxHeap->isEmpty()) {
            $total += $maxHeap->extract();
        }
    }

    return $total;
}

/**
 * 標準入力からデータを読み込んで、最大収益を出力するメイン関数
 */
function main(): void {
    $input = stream_get_contents(STDIN);
    $lines = explode("\n", trim($input));
    [$n, $d] = array_map('intval', explode(' ', $lines[0]));

    $jobs = [];
    for ($i = 1; $i <= $n; $i++) {
        [$x, $y] = array_map('intval', explode(' ', $lines[$i]));
        $jobs[] = [$x, $y];
    }

    $result = getMaxEarnings($n, $d, $jobs);
    echo $result . PHP_EOL;
}

main();
// ```

// ---

// ## ✅ 入力例

// ```text
// 5 4
// 1 1
// 2 4
// 2 3
// 3 4
// 4 2
// ```

// ### ✅ 出力

// ```
// 12
// ```

// ---

// ## ✅ 時間・メモリの分析

// | 処理内容      | 時間計算量              | 空間計算量        |
// | --------- | ------------------ | ------------ |
// | 仕事分類      | O(N)               | O(N + D)     |
// | ヒープ操作（挿入） | O(N log N)         | O(N)         |
// | ヒープ操作（抽出） | O(D log N)         | O(N)         |
// | 合計        | **O(N log N + D)** | **O(N + D)** |

// ---

// ## ✅ 使用技術

// * `SplMaxHeap`：PHPの標準ライブラリで最大ヒープ（優先度付きキュー）を簡潔に実装
// * `array_fill`：各日付ごとの仕事をまとめる
// * `declare(strict_types=1)`：型安全を確保

// ---

// ## ✅ 注意点（実行環境）

// * 標準入力読み取りには `stream_get_contents(STDIN)` を使用
// * CLI実行時は、`php yourscript.php < input.txt` の形式で使えます

// ---

// 必要であれば、**このPHPコードの図解付きステップ解説**も可能です。ご希望があればお知らせください。