// 以下は、**Go 1.20.6** での「カエルの最小コスト移動経路」問題の実装です。

// * **型を明示**
// * **処理時間：O(N)**、**メモリ使用量：O(N)**
// * 経路復元付き
// * 標準入力は `bufio.Scanner` で高速処理

// ---

// ## ✅ Go 実装（`main.go`）

package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

func abs(a int) int {
	if a < 0 {
		return -a
	}
	return a
}

func main() {
	reader := bufio.NewScanner(os.Stdin)
	reader.Split(bufio.ScanWords)

	// 入力ヘルパー関数
	readInt := func() int {
		reader.Scan()
		n, _ := strconv.Atoi(reader.Text())
		return n
	}

	// 入力
	N := readInt()
	h := make([]int, N)
	for i := 0; i < N; i++ {
		h[i] = readInt()
	}

	// DPと経路復元
	dp := make([]int, N)
	prev := make([]int, N)

	const INF int = 1 << 60
	for i := range dp {
		dp[i] = INF
	}
	dp[0] = 0
	prev[0] = -1

	for i := 1; i < N; i++ {
		cost1 := dp[i-1] + abs(h[i]-h[i-1])
		if cost1 < dp[i] {
			dp[i] = cost1
			prev[i] = i - 1
		}
		if i > 1 {
			cost2 := dp[i-2] + abs(h[i]-h[i-2])
			if cost2 < dp[i] {
				dp[i] = cost2
				prev[i] = i - 2
			}
		}
	}

	// 経路復元
	path := []int{}
	for cur := N - 1; cur != -1; cur = prev[cur] {
		path = append(path, cur+1) // 1-indexed
	}

	// 逆順出力
	for i, j := 0, len(path)-1; i < j; i, j = i+1, j-1 {
		path[i], path[j] = path[j], path[i]
	}

	// 出力
	fmt.Println(len(path))
	for i, v := range path {
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(v)
	}
	fmt.Println()
}

// ## ⏱️ 計算量とメモリ使用量

// | 項目      | 内容                          |
// | ------- | --------------------------- |
// | 時間計算量   | O(N)                        |
// | 空間計算量   | O(N) (`dp`, `prev`, `path`) |
// | 最大入力サイズ | `N <= 10^5`                 |
// | メモリ目安   | 数MB（標準制限内：1024MiB）          |

// ---

// ## 📥 入力例

// ```
// 6
// 30 10 60 10 60 50
// ```

// ## 📤 出力例

// ```
// 4
// 1 3 5 6
// ```

// ---

// ## ✅ 実行方法

// ```bash
// go run main.go < input.txt
// ```

// またはビルド後に：

// ```bash
// go build -o frog main.go
// ./frog < input.txt
// ```

// ---

// ## 🧠 ポイントまとめ

// * `dp[i]`：足場 `i+1` に行くまでの最小コスト
// * `prev[i]`：`i+1` にたどり着く直前の足場
// * 経路は `prev` を逆にたどって出力

