<!-- 以下に、**型を明示した PHP 解法**を提示します。
この問題は高速な区間処理が必要なので、\*\*累積和（prefix sum）\*\*を用いて高速化します。

## ✅ PHP（型明示あり）完全解法

<?php

declare(strict_types=1);

/**
 * @param int $N
 * @param array<int> $A
 * @param array<array{int, int}> $queries
 * @return array<string>
 */
function solveLottery(int $N, array $A, array $queries): array {
    // 累積和 acc[i] = A[0] ~ A[i-1] の 1 の数（0-indexed）
    $acc = array_fill(0, $N + 1, 0); // int[]

    for ($i = 0; $i < $N; $i++) {
        $acc[$i + 1] = $acc[$i] + $A[$i];
    }

    $results = []; // array<string>

    foreach ($queries as [$L, $R]) {
        $ones = $acc[$R] - $acc[$L - 1];
        $total = $R - $L + 1;
        $zeros = $total - $ones;

        if ($ones > $zeros) {
            $results[] = "win";
        } elseif ($zeros > $ones) {
            $results[] = "lose";
        } else {
            $results[] = "draw";
        }
    }

    return $results;
}

// 標準入力処理
$lines = explode("\n", trim(file_get_contents("php://stdin")));

$N = (int)$lines[0];
$A = array_map('intval', explode(' ', $lines[1]));

$Q = (int)$lines[2];
$queries = []; // array<array{int, int}>
for ($i = 0; $i < $Q; $i++) {
    [$L, $R] = array_map('intval', explode(' ', $lines[3 + $i]));
    $queries[] = [$L, $R];
}

$results = solveLottery($N, $A, $queries);
echo implode("\n", $results) . "\n";

// ## ✅ 使用例（input）

// 7
// 0 1 1 0 1 0 0
// 3
// 2 5
// 2 7
// 5 7
// ```

// ## ✅ 実行

// ```bash
// php solution.php < input.txt
// ```

// ## ✅ 出力

// ```
// win
// draw
// lose
// ```

// ---

// ## ✅ 型注釈についての補足

// | 項目                  | 型                        | 意味                                     |
// | ------------------- | ------------------------ | -------------------------------------- |
// | `$N`                | `int`                    | くじの回数                                  |
// | `$A`                | `array<int>`             | くじ結果（0 または 1）                          |
// | `$queries`          | `array<array{int, int}>` | 区間クエリ `(L, R)` のリスト                    |
// | `solveLottery` の戻り値 | `array<string>`          | 各クエリに対する結果：`"win"`, `"lose"`, `"draw"` |

// ## ✅ 処理の流れまとめ

// 1. `$acc[i]` にアタリ（=1）の累積和を格納
// 2. 各クエリ `(L, R)` に対して `acc[R] - acc[L-1]` でアタリ数を高速取得
// 3. アタリ・ハズレを比較して出力

// ## ✅ 計算量

// * 累積和構築：`O(N)`
// * 各クエリ処理：`O(1)`
// * 合計：`O(N + Q)` → 最大 20万でも十分高速