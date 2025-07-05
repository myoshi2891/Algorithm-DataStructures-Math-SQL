// 以下は、**Go (Golang)** による高速・省メモリな解法です。
// **2D差分法 + 累積和**で、1回以上塗られたセルの数（=面積）を求めます。

// ## ✅ 問題の制約と目的

// * 入力：`N ≤ 100000`、各長方形は座標 `(A,B)-(C,D)` の軸に平行な矩形
// * 範囲：`0 ≤ A_i < C_i ≤ 1500`, `0 ≤ B_i < D_i ≤ 1500`
// * **出力**：紙が1回以上置かれた2Dグリッド上のマス数（面積）

// ## ✅ Go実装（型明示・メモリ効率重視）

package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

const gridSize int = 1502 // 最大1501に対応するため+1

func main() {
	reader := bufio.NewReaderSize(os.Stdin, 1<<20)
	scanner := bufio.NewScanner(reader)
	scanner.Split(bufio.ScanLines)

	// Read N
	scanner.Scan()
	N, _ := strconv.Atoi(scanner.Text())

	// 2D差分グリッド定義（int16で十分）
	var grid [gridSize][gridSize]int16

	// 入力処理と差分追加（O(N)）
	for i := 0; i < N; i++ {
		scanner.Scan()
		line := scanner.Text()
		fields := strings.Fields(line)
		a, _ := strconv.Atoi(fields[0])
		b, _ := strconv.Atoi(fields[1])
		c, _ := strconv.Atoi(fields[2])
		d, _ := strconv.Atoi(fields[3])

		grid[a][b]++
		grid[c][b]--
		grid[a][d]--
		grid[c][d]++
	}

	// 横方向累積
	for x := 0; x < gridSize; x++ {
		for y := 1; y < gridSize; y++ {
			grid[x][y] += grid[x][y-1]
		}
	}

	// 縦方向累積
	for y := 0; y < gridSize; y++ {
		for x := 1; x < gridSize; x++ {
			grid[x][y] += grid[x-1][y]
		}
	}

	// 面積（1以上のマスをカウント）
	area := 0
	for x := 0; x < 1501; x++ {
		for y := 0; y < 1501; y++ {
			if grid[x][y] > 0 {
				area++
			}
		}
	}

	fmt.Println(area)
}

// ## ✅ 型とメモリ・時間の見積もり

// | 要素       | 内容                                                   |
// | -------- | ---------------------------------------------------- |
// | 配列型      | `var grid [1502][1502]int16`（2バイト×1502×1502 ≈ 4.5MB） |
// | 時間計算量    | `O(N + H×W)`（最大約 2.3×10⁶）                            |
// | 実行時間の見込み | 約 100〜200ms（Goの高速処理能力）                               |
// | メモリ消費    | 約 4.5MB（1024MB 制限の << 1%）                            |

// ---

// ## ✅ 入力例と出力

// **入力**

// ```
// 2
// 1 1 3 3
// 2 2 4 4
// ```

// **出力**

// ```
// 7
// ```

// ## ✅ 解説補足

// * `grid[a][b]++` など、**4点だけ更新**すれば後で累積和を取ることで内部が塗られる。
// * Goでは固定長配列 `[1502][1502]int16` を使うことでGC負荷を最小化しつつ、定数アクセス可能。
// * `bufio.Scanner` を使うことで10万件でも高速に読み取り。

// ### 📌 注意点

// * `gridSize = 1502` にしている理由は、最大座標 `1501` に対して `grid[c][d]++` でオーバーしないようにするためです。
// * 出力は `fmt.Println()` 一発。バッファ不要です。
