<!-- 以下は、**PHP 8.2.8** に対応した、**部分和問題（Subset Sum with recovery）** の解法です。
Python / TypeScript と同様の **動的計画法 + 経路復元** の方針に基づきます。

---

## ✅ ポイント

* 型を明示しつつ、スパースなDPを `array` で構築
* 経路復元のために `dp[$sum] = [$index, $prev_sum]` を保持
* 処理時間とメモリに配慮（不要な合計値は保持しない）

---

## ✅ PHP 8.2.8 コード（fs不要）

<?php
/**
 * 合計Sとなる部分集合が存在するか判定し、
 * 存在する場合はそのカードのインデックスを1つ返す。
 * 存在しない場合は -1 を出力する。
 *
 * @return void
 */
function main(): void {
    // 入力読み取り
    [$N, $S] = array_map('intval', explode(' ', trim(fgets(STDIN))));
    $A = array_map('intval', explode(' ', trim(fgets(STDIN))));

    /** @var array<int, array{int, int}|null> $dp */
    $dp = [];
    $dp[0] = null; // 0は何も使わずに作れる

    for ($i = 0; $i < $N; $i++) {
        /** @var array<int, array{int, int}> $next */
        $next = $dp;

        foreach ($dp as $s => $val) {
            $newSum = $s + $A[$i];
            if ($newSum <= $S && !isset($next[$newSum])) {
                $next[$newSum] = [$i, $s]; // カード$i を使って newSum を構成
            }
        }

        $dp = $next;
    }

    if (!isset($dp[$S])) {
        echo "-1\n";
        return;
    }

    // 経路復元
    $res = [];
    $curr = $S;

    while ($curr !== 0) {
        [$i, $prev] = $dp[$curr];
        $res[] = $i + 1; // 1-indexed に変換
        $curr = $prev;
    }

    // 出力
    $res = array_reverse($res);
    echo count($res) . "\n";
    echo implode(' ', $res) . "\n";
}

main();
// ```

// ---

// ## ✅ 動作確認例

// ### 入力:

// ```
// 3 7
// 2 2 3
// ```

// ### 出力:

// ```
// 3
// 1 2 3
// ```

// ---

// ## ✅ 時間・メモリ計算量

// | 項目       | 計算量      | 備考             |
// | -------- | -------- | -------------- |
// | 時間計算量    | O(N × S) | 最大約 60万        |
// | 空間計算量    | O(S)     | `dp` 配列はスパース構造 |
// | PHPバージョン | 8.2.8    | タイプヒント使用       |

// ---

// ## ✅ 型の明示について

// PHPではスカラー型を直接 `array` のキーや値に型付けできませんが、PHPDoc で以下のように記述しています：

// ```php
// /** @var array<int, array{int, int}|null> $dp */
// ```

// これは、「`int` をキーとし、値は `[$index, $prev_sum]` のペア、または null」と明示しています。