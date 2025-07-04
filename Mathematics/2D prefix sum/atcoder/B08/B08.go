// 以下は、問題に対する **Go (Golang)** の解法です。
// 制約（点数・クエリ最大10⁵、座標範囲1500）を踏まえ、**2次元累積和（2D prefix sum）** を使って高速にクエリ処理を行います。
// 型を明示し、**実行時間とメモリ使用量を考慮**した設計です。

// ## ✅ 解法概要（再確認）

// * 入力された点を `grid[x][y]` にカウント。
// * `prefix[x][y]` に (1,1)〜(x,y) の点数累積和を構築。
// * 各クエリで矩形 `[a,c] × [b,d]` の点数を O(1) で取得。

// ## ✅ Go 実装（型明示・最適化済）

package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

const SIZE = 1501

func main() {
	reader := bufio.NewReaderSize(os.Stdin, 1<<20) // 1MB buffer
	writer := bufio.NewWriter(os.Stdout)
	defer writer.Flush()

	// 数値の読み取り関数
	readInt := func() int {
		line, _ := reader.ReadString('\n')
		val, _ := strconv.Atoi(strings.TrimSpace(line))
		return val
	}

	readInts := func() []int {
		line, _ := reader.ReadString('\n')
		fields := strings.Fields(line)
		res := make([]int, len(fields))
		for i, s := range fields {
			res[i], _ = strconv.Atoi(s)
		}
		return res
	}

	// 点の数
	var N int = readInt()

	// grid[x][y]: 各点のカウント
	var grid [SIZE][SIZE]int

	for i := 0; i < N; i++ {
		p := readInts()
		x, y := p[0], p[1]
		grid[x][y]++
	}

	// 2次元累積和の構築
	var prefix [SIZE][SIZE]int

	for x := 1; x < SIZE; x++ {
		for y := 1; y < SIZE; y++ {
			prefix[x][y] = grid[x][y] +
				prefix[x-1][y] +
				prefix[x][y-1] -
				prefix[x-1][y-1]
		}
	}

	// クエリ数
	var Q int = readInt()

	for i := 0; i < Q; i++ {
		p := readInts()
		a, b, c, d := p[0], p[1], p[2], p[3]

		count := prefix[c][d] -
			prefix[a-1][d] -
			prefix[c][b-1] +
			prefix[a-1][b-1]

		fmt.Fprintln(writer, count)
	}
}

// ## ✅ 実行例

// ### 入力

// ```
// 5
// 1 3
// 2 5
// 3 4
// 2 6
// 3 3
// 3
// 1 3 3 6
// 1 5 2 6
// 1 3 3 5
// ```

// ### 出力

// ```
// 5
// 2
// 4
// ```

// ---

// ## ✅ 型と構造体の解説

// | 変数           | 型                 | 説明            |
// | ------------ | ----------------- | ------------- |
// | `grid`       | `[1501][1501]int` | 点の存在をカウント     |
// | `prefix`     | `[1501][1501]int` | 2D累積和         |
// | `readInt()`  | `func() int`      | 1行読み取り & 整数変換 |
// | `readInts()` | `func() []int`    | 複数整数を1行で読み取り  |

// ---

// ## ✅ 計算量

// | 処理内容   | 時間計算量        |
// | ------ | ------------ |
// | グリッド構築 | O(N)         |
// | 累積和構築  | O(1500×1500) |
// | クエリ処理  | O(Q)         |
// | **合計** | ≈ 数百万オーダー    |

// → **Go の処理性能なら 5 秒以内で十分対応可能**

// ## ✅ メモリ消費量

// * `grid` + `prefix`: `1501×1501×4バイト×2 ≒ 約18MB`
// * 制限（1024MiB）の **2%以下** に収まる。

// ## ✅ 補足

// * `bufio.Reader` を使って **高速な標準入力読み取り**。
// * `fmt.Fprintln(writer, ...)` により、**高速な出力**を実現。
// * 全体を **配列ベース（\[SIZE]\[SIZE]int）で確保済み**なので、メモリの再確保もなく非常に高速。
