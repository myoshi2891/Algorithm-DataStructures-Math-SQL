<!-- 以下に、**PHP 8.2.8** に対応した解答を提示します。
この解法は、**半分全列挙（Meet-in-the-middle）** を用いて、時間・メモリ制約の範囲で最適に動作します。

## ✅ 解法戦略（再掲）

* 配列を2分割して、それぞれの部分集合和を列挙（最大 $2^{15} = 32,768$ 通り）
* 一方をソートし、もう一方の要素と合わせて **二分探索**で目的の値 `K` を探索


## ✅ PHPコード（PHP 8.2.8対応・型付き風コメント付き）
<?php
declare(strict_types=1);

/**
 * @param array<int> $arr
 * @return array<int>
 */
function getSubsetSums(array $arr): array {
    $n = count($arr);
    $res = [];
    for ($bit = 0; $bit < (1 << $n); $bit++) {
        $sum = 0;
        for ($i = 0; $i < $n; $i++) {
            if ($bit & (1 << $i)) {
                $sum += $arr[$i];
            }
        }
        $res[] = $sum;
    }
    return $res;
}

/**
 * @param array<int> $arr
 * @param int $target
 * @return bool
 */
function binarySearch(array $arr, int $target): bool {
    $left = 0;
    $right = count($arr) - 1;
    while ($left <= $right) {
        $mid = intdiv($left + $right, 2);
        if ($arr[$mid] === $target) {
            return true;
        } elseif ($arr[$mid] < $target) {
            $left = $mid + 1;
        } else {
            $right = $mid - 1;
        }
    }
    return false;
}

function main(): void {
    $input = trim(file_get_contents('php://stdin'));
    $tokens = array_map('intval', preg_split('/\s+/', $input));
    
    $N = $tokens[0];
    $K = $tokens[1];
    $A = array_slice($tokens, 2);
    
    $mid = intdiv($N, 2);
    $left = array_slice($A, 0, $mid);
    $right = array_slice($A, $mid);

    $leftSums = getSubsetSums($left);
    $rightSums = getSubsetSums($right);
    sort($rightSums);

    foreach ($leftSums as $x) {
        $remain = $K - $x;
        if (binarySearch($rightSums, $remain)) {
            echo "Yes\n";
            return;
        }
    }
    echo "No\n";
}

main();

// ## ✅ 入力例

// ```
// 6 30
// 5 1 18 7 2 9
// ```

// ## ✅ 出力例

// ```
// Yes
// ```

// ## ✅ 時間・空間計算量

// | 処理       | 計算量                       |
// | -------- | ------------------------- |
// | 部分集合和列挙  | $O(2^{N/2} \cdot N)$      |
// | ソート      | $O(2^{N/2} \log 2^{N/2})$ |
// | 探索（×ループ） | $O(2^{N/2} \log 2^{N/2})$ |
// | **合計**   | 約 30 万回程度の計算 → 1秒以内OK     |

// * 最大メモリ使用：配列2個 × $2^{15} \approx 32,768$ 要素 → **数百KB** → **1024 MiB制限に収まる**

// ## ✅ 注意点（PHP固有）

// * PHP はデフォルトで大きな整数も扱える（int型は任意精度で扱える環境も多い）
// * `declare(strict_types=1)` で型安全な動作を明示
// * コメントで型注釈を明示（PHP 8.2 でも `array<int>` などの DocBlock を活用）