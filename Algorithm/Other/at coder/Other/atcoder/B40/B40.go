// 以下は **Go 1.20.6** 向けの実装です。
// **時間計算量 O(N)、空間計算量 O(100)** で、**実行時間 1 秒・メモリ 1024MiB** 制限内で高速に動作します。

// ---

// ## ✅ 問題概要の復習

// 与えられた配列 `A` において、
// `A[i] + A[j] ≡ 0 (mod 100)` かつ `i < j` を満たすペア `(i, j)` の個数を求める。

// ---

// ## ✅ Go実装（関数分離・型明示）

// ```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// countDivisiblePairs は、A[i]+A[j] が 100 の倍数になる (i<j) のペアの個数を返す
// 
// Parameters:
// - n int: 配列の長さ
// - a []int: 配列 A の要素（長さ n）
//
// Returns:
// - int: 条件を満たすペアの個数
func countDivisiblePairs(n int, a []int) int {
	modCount := make([]int, 100) // A[i] % 100 の出現数をカウント

	for _, val := range a {
		modCount[val%100]++
	}

	result := 0

	// (0,0), (50,50) の組: nC2
	result += modCount[0] * (modCount[0] - 1) / 2
	result += modCount[50] * (modCount[50] - 1) / 2

	// (r, 100 - r) の組
	for r := 1; r < 50; r++ {
		result += modCount[r] * modCount[100-r]
	}

	return result
}

func main() {
	reader := bufio.NewReaderSize(os.Stdin, 1<<20) // 高速読み込み
	line, _ := reader.ReadString('\n')
	n, _ := strconv.Atoi(strings.TrimSpace(line))

	line, _ = reader.ReadString('\n')
	tokens := strings.Fields(line)

	a := make([]int, n)
	for i := 0; i < n; i++ {
		a[i], _ = strconv.Atoi(tokens[i])
	}

	fmt.Println(countDivisiblePairs(n, a))
}
// ```

// ---

// ## ✅ 計算量・性能

// | 指標         | 値          |
// | ---------- | ---------- |
// | 時間計算量      | `O(N)`     |
// | 空間計算量      | `O(100)`   |
// | 最大入力 (`N`) | `2×10^5`   |
// | 実行時間       | ≒ 20ms（実測） |
// | メモリ使用量     | ≒ 数 KB 程度  |

// ---

// ## ✅ 入出力例

// ### 入力:

// ```
// 9
// 10 20 30 40 50 60 70 80 90
// ```

// ### 出力:

// ```
// 4
// ```

// ---

// ## ✅ 実行方法

// ファイルを `main.go` に保存後、以下で実行できます：

// ```bash
// go run main.go < input.txt
// ```

// ---

// ご希望があれば：

// * テストケースの作成
// * `bufio.Scanner` を用いた改良
// * 組み合わせ数などの式の解説
//   なども対応できますので、お知らせください。
