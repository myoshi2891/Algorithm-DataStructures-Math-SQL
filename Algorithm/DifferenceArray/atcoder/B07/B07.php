<!-- この問題は最大で `T = 500000`, `N = 500000` と大きいため、**差分配列（いもす法）+ 累積和**を使って高速に処理します。

## ✅ PHPコード（型付き + 高速対応） -->

<?php

declare(strict_types=1);

/**
 * メイン処理関数
 */
function main(): void {
    $stdin = fopen('php://stdin', 'r');
    if ($stdin === false) {
        throw new RuntimeException("Failed to open stdin.");
    }

    /** @var int $T 営業終了時間 */
    $T = (int)fgets($stdin);
    /** @var int $N 従業員数 */
    $N = (int)fgets($stdin);

    /** @var array<int> $cnt 差分配列 */
    $cnt = array_fill(0, $T + 1, 0);

    // 差分配列への反映
    for ($i = 0; $i < $N; $i++) {
        $line = fgets($stdin);
        if ($line === false) {
            throw new RuntimeException("Failed to read line.");
        }
        [$L, $R] = array_map('intval', explode(' ', trim($line)));
        $cnt[$L] += 1;
        $cnt[$R] -= 1;
    }

    // 累積和と出力
    $current = 0;
    for ($t = 0; $t < $T; $t++) {
        $current += $cnt[$t];
        echo $current . "\n";
    }

    fclose($stdin);
}

main();

// ## 📥 入力例

// ```
// 10
// 7
// 0 3
// 2 4
// 1 3
// 0 3
// 5 6
// 5 6
// 5 6
// ```

// ## 📤 出力例

// ```
// 2
// 3
// 4
// 1
// 0
// 3
// 0
// 0
// 0
// 0
// ```

// ## 🧠 解説

// ### 主な変数と型

// | 変数名        | 型            | 内容            |
// | ---------- | ------------ | ------------- |
// | `$T`       | `int`        | 営業終了時刻（閉店時刻）  |
// | `$N`       | `int`        | 従業員数          |
// | `$cnt`     | `array<int>` | 差分配列（サイズ T+1） |
// | `$current` | `int`        | 累積和で現在店内にいる人数 |
// | `$stdin`   | `resource`   | 標準入力リソース      |

// ## 🧮 計算量

// * 差分更新：O(N)
// * 累積和：O(T)
// * 合計：**O(N + T)**（最大でも 1,000,000 程度）→ 制約内で余裕

// ## ✅ 実行方法

// ローカルでテストする場合：

// ```bash
// php main.php < input.txt
// ```