// 以下は Go 1.20.6 を用いた解法です。
// **制約（N ≤ 100,000）に対応するため、計算量 O(N log N)** のアルゴリズム（2次元LIS）を使用しています。
// ソートと二分探索を使った効率的な処理で、型を明示し、関数分離も行っています。

// ---

// ## ✅ Go 実装（型明示・関数分離）

// ```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

// Box は各箱の構造体。縦と横を持つ。
type Box struct {
	X int // 縦の長さ
	Y int // 横の長さ
}

// maxNestingDepth は最大で何重に箱をネストできるかを求める。
// @param boxes []Box - 各箱の情報
// @return int - 最大ネスト数
func maxNestingDepth(boxes []Box) int {
	// X昇順、Xが同じならY降順でソート
	sort.Slice(boxes, func(i, j int) bool {
		if boxes[i].X == boxes[j].X {
			return boxes[i].Y > boxes[j].Y
		}
		return boxes[i].X < boxes[j].X
	})

	// Y方向のLISを求める（O(N log N)）
	lis := make([]int, 0, len(boxes))

	for _, box := range boxes {
		y := box.Y
		idx := lowerBound(lis, y)
		if idx == len(lis) {
			lis = append(lis, y)
		} else {
			lis[idx] = y
		}
	}

	return len(lis)
}

// lowerBound は slice の中で target 以上の最小のインデックスを返す。
// @param slice []int - 単調増加列
// @param target int - 探す値
// @return int - 最左位置（lower_bound）
func lowerBound(slice []int, target int) int {
	left, right := 0, len(slice)
	for left < right {
		mid := (left + right) / 2
		if slice[mid] < target {
			left = mid + 1
		} else {
			right = mid
		}
	}
	return left
}

// main は標準入力を読み込み、最大ネスト数を出力する。
func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	n, _ := strconv.Atoi(scanner.Text())

	boxes := make([]Box, n)

	for i := 0; i < n && scanner.Scan(); i++ {
		line := scanner.Text()
		parts := strings.Fields(line)
		x, _ := strconv.Atoi(parts[0])
		y, _ := strconv.Atoi(parts[1])
		boxes[i] = Box{X: x, Y: y}
	}

	result := maxNestingDepth(boxes)
	fmt.Println(result)
}

// ## ✅ 計算量とメモリ使用量

// | 項目     | 値                                  |
// | ------ | ---------------------------------- |
// | 時間計算量  | `O(N log N)`（ソート + LIS）            |
// | 空間計算量  | `O(N)`（LIS配列＋入力配列）                 |
// | メモリ使用量 | 約 10〜15MB（N ≒ 100,000 のとき）         |
// | 最大入力対応 | `N ≦ 100,000`、`X,Y ≦ 500,000` まで対応 |

// ---

// ## ✅ 実行例

// ### 入力:

// ```
// 5
// 30 50
// 10 30
// 40 10
// 50 20
// 40 60
// ```

// ### 出力:

// ```
// 3
// ```

// ---

// ## ✅ 解法ポイント

// * `sort.Slice()` で X昇順・Y降順の安定ソート
// * `lowerBound` による Y の LIS 構築（ネスト数＝LISの長さ）
// * Go のスライスを活かした効率的実装

