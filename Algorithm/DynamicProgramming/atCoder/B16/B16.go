// 以下は、**Go 1.20.6** を用いた「カエルの最小ジャンプコスト」問題の解法です。
// **実行時間とメモリの消費量を最小限に抑える**ため、\*\*動的計画法（DP）+ 空間最適化（O(1) メモリ）\*\*を使用します。

// ## ✅ Go 実装（型明示・最小メモリ・高速）

package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func main() {
	reader := bufio.NewReader(os.Stdin)

	// 1行目：N
	line1, _ := reader.ReadString('\n')
	N, _ := strconv.Atoi(strings.TrimSpace(line1))

	// 2行目：h[0]～h[N-1]
	line2, _ := reader.ReadString('\n')
	hStr := strings.Fields(line2)
	h := make([]int, N)
	for i := 0; i < N; i++ {
		h[i], _ = strconv.Atoi(hStr[i])
	}

	if N == 2 {
		fmt.Println(abs(h[1] - h[0]))
		return
	}

	var prev2 int = 0                             // dp[i-2]
	var prev1 int = abs(h[1] - h[0])              // dp[i-1]

	for i := 2; i < N; i++ {
		cost1 := prev1 + abs(h[i]-h[i-1])
		cost2 := prev2 + abs(h[i]-h[i-2])
		curr := min(cost1, cost2)
		prev2 = prev1
		prev1 = curr
	}

	fmt.Println(prev1)
}

func abs(a int) int {
	if a < 0 {
		return -a
	}
	return a
}

// ## ✅ 入出力例

// 入力（標準入力）:

// ```
// 6
// 30 10 60 10 60 50
// ```

// 出力:

// ```
// 40
// ```

// ---

// ## ✅ 計算量・メモリ量

// | 指標    | 値               |
// | ----- | --------------- |
// | 時間計算量 | `O(N)`          |
// | 空間計算量 | `O(1)`（定数メモリのみ） |
// | 入力制約  | `2 ≤ N ≤ 10^5`  |

// ---

// ## ✅ ポイントまとめ

// * **配列 `dp[]` を使わず**に、`prev1`, `prev2` の2つだけで更新する。
// * `abs()` でジャンプコストを計算。
// * `min()` 関数で2通りのジャンプを比較。

// ---

// ## ✅ フルDP版（O(N)メモリ）も参考に：

// ```go
// dp := make([]int, N)
// dp[0] = 0
// dp[1] = abs(h[1] - h[0])
// for i := 2; i < N; i++ {
// 	dp[i] = min(
// 		dp[i-1]+abs(h[i]-h[i-1]),
// 		dp[i-2]+abs(h[i]-h[i-2]),
// 	)
// }
// fmt.Println(dp[N-1])
// ```

