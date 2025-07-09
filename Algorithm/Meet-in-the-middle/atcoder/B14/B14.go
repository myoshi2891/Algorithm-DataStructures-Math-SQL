// 以下に、**Go (go 1.20.6)** による解答を提示します。
// 制約に対応するために、**半分全列挙（Meet-in-the-middle）** を用いた効率的な実装です。
// 型を明示し、処理時間・メモリ使用量を考慮しています。

// ## ✅ 解法概要

// * 与えられた整数列を **前半・後半に分割**
// * 各部分の **部分集合和を全列挙**（最大 2^15 = 32,768 通り）
// * 一方の部分和リストに対して **二分探索**を使用し、合計が `K` になる組を探索

// ## ✅ Go実装（Go 1.20.6）

package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

// getSubsetSums returns all possible subset sums of arr.
func getSubsetSums(arr []int) []int {
	n := len(arr)
	res := make([]int, 0, 1<<n)
	for bit := 0; bit < (1 << n); bit++ {
		sum := 0
		for i := 0; i < n; i++ {
			if bit&(1<<i) != 0 {
				sum += arr[i]
			}
		}
		res = append(res, sum)
	}
	return res
}

// binarySearch checks if target exists in sorted slice arr.
func binarySearch(arr []int, target int) bool {
	left, right := 0, len(arr)-1
	for left <= right {
		mid := (left + right) / 2
		if arr[mid] == target {
			return true
		} else if arr[mid] < target {
			left = mid + 1
		} else {
			right = mid - 1
		}
	}
	return false
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	header := strings.Fields(scanner.Text())
	N, _ := strconv.Atoi(header[0])
	K, _ := strconv.Atoi(header[1])

	scanner.Scan()
	fields := strings.Fields(scanner.Text())
	A := make([]int, N)
	for i := 0; i < N; i++ {
		A[i], _ = strconv.Atoi(fields[i])
	}

	mid := N / 2
	left := A[:mid]
	right := A[mid:]

	leftSums := getSubsetSums(left)
	rightSums := getSubsetSums(right)
	sort.Ints(rightSums)

	for _, x := range leftSums {
		remain := K - x
		if binarySearch(rightSums, remain) {
			fmt.Println("Yes")
			return
		}
	}
	fmt.Println("No")
}

// ## ✅ 入力例

// ```
// 6 30
// 5 1 18 7 2 9
// ```

// ## ✅ 出力例

// ```
// Yes
// ```

// ---

// ## ✅ 処理時間・空間計算量

// | ステップ       | 計算量（最悪）                  |
// | ---------- | ------------------------ |
// | 部分和全列挙     | $O(2^{15} \cdot N)$      |
// | ソート        | $O(2^{15} \log 2^{15})$  |
// | 二分探索 × ループ | $O(2^{15} \log 2^{15})$  |
// | 合計         | 約 **30万回程度の演算** → 1秒以内 ✅ |

// * メモリ使用量：

//   * `leftSums` + `rightSums`：最大 32,768 × 2 ≒ **65,000 整数** → 約 **260KB**程度
//   * 上限（1024 MiB）に**大きく余裕あり**

// ---

// ## ✅ 特記事項（Go 1.20.6対応）

// * `bufio.Scanner` により高速な入力処理
// * 型安全：明示的な `int` スライス使用
// * 標準ライブラリのみ使用（外部依存なし）
