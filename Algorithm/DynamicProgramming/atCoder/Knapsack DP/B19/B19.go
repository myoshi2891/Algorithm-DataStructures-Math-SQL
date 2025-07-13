// 以下は、**Go 1.20.6** における `Knapsack 2（価値軸DP）` の実装です。
// **型の明示・関数の分割・処理時間とメモリの効率を考慮**した構成になっています。

// ## ✅ 構成と特徴

// | 関数名               | 役割           | 引数 / 返却値                     |
// | ----------------- | ------------ | ---------------------------- |
// | `parseInput()`    | 入力をパース       | `() → (int, int, [][2]int)`  |
// | `solveKnapsack()` | DPにより最大価値を計算 | `(int, int, [][2]int) → int` |
// | `main()`          | 入出力をまとめて呼び出す | `なし`                         |

// ## ✅ Go 実装（`Go 1.20.6` 準拠、コメント付き）

package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
)

// parseInput は標準入力から N, W, items を読み取って返します。
// 戻り値: (品物数, 容量W, 品物リスト(重さ, 価値))
func parseInput() (int, int, [][2]int) {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	header := strings.Fields(scanner.Text())
	N, _ := strconv.Atoi(header[0])
	W, _ := strconv.Atoi(header[1])

	items := make([][2]int, N)
	for i := 0; i < N && scanner.Scan(); i++ {
		parts := strings.Fields(scanner.Text())
		w, _ := strconv.Atoi(parts[0])
		v, _ := strconv.Atoi(parts[1])
		items[i] = [2]int{w, v}
	}
	return N, W, items
}

// solveKnapsack は価値軸DPにより、重さ制限W以下で得られる最大価値を計算します。
// 引数: 品物数N、容量W、品物(重さ, 価値)
// 戻り値: 最大の価値
func solveKnapsack(N int, W int, items [][2]int) int {
	// 最大の価値合計を取得（DP配列サイズの上限）
	maxValue := 0
	for _, item := range items {
		maxValue += item[1]
	}

	const INF = math.MaxInt64
	dp := make([]int, maxValue+1)
	for i := range dp {
		dp[i] = INF
	}
	dp[0] = 0

	for _, item := range items {
		w, v := item[0], item[1]
		for val := maxValue; val >= v; val-- {
			if dp[val-v] != INF && dp[val-v]+w < dp[val] {
				dp[val] = dp[val-v] + w
			}
		}
	}

	// dp[v] <= W となる最大の v を探す
	for v := maxValue; v >= 0; v-- {
		if dp[v] <= W {
			return v
		}
	}
	return 0
}

func main() {
	N, W, items := parseInput()
	result := solveKnapsack(N, W, items)
	fmt.Println(result)
}
// ## ✅ 入力例（例: input.txt）

// ```
// 4 7
// 3 13
// 3 17
// 5 29
// 1 10
// ```

// ### 実行方法：

// ```bash
// go run main.go < input.txt
// ```

// ---

// ## ✅ 計算量・メモリ見積り

// | 項目     | 内容                                |
// | ------ | --------------------------------- |
// | 計算量    | `O(N × sum_v)` = `1e7` 程度         |
// | メモリ使用量 | `dp[]` 約 `100000 × 8byte ≒ 800KB` |
// | 実行時間目安 | 数百ms〜1秒以内                         |
// | 制限     | 時間：10秒 / メモリ：1024MiB              |

// ---

// ## ✅ Go の注意点

// * `math.MaxInt64` を使って `INF` を表現
// * `dp` は 64bit int のスライス（int は通常 64bit）
// * 入力は `bufio.Scanner` + `strings.Fields` で高速処理

// ---

// ## ✅ 拡張可能な内容

// * 選んだ品物の復元
// * メモリ圧縮（必要なら複数スライス併用）
// * 時間軸DP（Wが小さいときに有効）
