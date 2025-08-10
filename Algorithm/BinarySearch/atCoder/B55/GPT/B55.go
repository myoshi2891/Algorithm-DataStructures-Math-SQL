// では、Go 1.20.6 用に型を明示しつつ、処理時間・メモリ消費にも配慮したコードを作ります。
// 配列は昇順を保ったまま挿入するため、**二分探索**を使って高速に位置を特定します。

// ---

// ### Go 実装コード

// ```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"time"
	"runtime"
)

/*
lowerBound は昇順スライス arr において、x を挿入すべき位置（最初に x 以上となる位置）を返します。
@param arr []int64  - 昇順ソートされた整数スライス
@param x   int64    - 探索対象の値
@return    int      - 挿入すべきインデックス
*/
func lowerBound(arr []int64, x int64) int {
	return sort.Search(len(arr), func(i int) bool { return arr[i] >= x })
}

/*
processQueries はクエリを処理し、タイプ 2 の結果を返します。
@param Q       int             - クエリの総数
@param queries [][2]int64      - クエリの配列
@return        []int64         - タイプ2クエリに対する結果
*/
func processQueries(Q int, queries [][2]int64) []int64 {
	cards := make([]int64, 0, Q) // メモリ効率のため容量を事前確保
	output := make([]int64, 0, Q)

	for _, query := range queries {
		t := query[0]
		x := query[1]
		if t == 1 {
			pos := lowerBound(cards, x)
			// 挿入
			cards = append(cards, 0)
			copy(cards[pos+1:], cards[pos:])
			cards[pos] = x
		} else {
			if len(cards) == 0 {
				output = append(output, -1)
				continue
			}
			pos := lowerBound(cards, x)
			minDiff := int64(1_000_000_000_0) // 十分大きい整数で初期化
			if pos < len(cards) {
				diff := cards[pos] - x
				if diff < 0 {
					diff = -diff
				}
				if diff < minDiff {
					minDiff = diff
				}
			}
			if pos > 0 {
				diff := cards[pos-1] - x
				if diff < 0 {
					diff = -diff
				}
				if diff < minDiff {
					minDiff = diff
				}
			}
			output = append(output, minDiff)
		}
	}
	return output
}

func main() {
	startTime := time.Now()

	// メモリ測定開始
	var mStart, mEnd runtime.MemStats
	runtime.ReadMemStats(&mStart)

	reader := bufio.NewReaderSize(os.Stdin, 1<<20)
	writer := bufio.NewWriterSize(os.Stdout, 1<<20)
	defer writer.Flush()

	var Q int
	fmt.Fscan(reader, &Q)

	queries := make([][2]int64, Q)
	for i := 0; i < Q; i++ {
		fmt.Fscan(reader, &queries[i][0], &queries[i][1])
	}

	result := processQueries(Q, queries)
	for _, val := range result {
		fmt.Fprintln(writer, val)
	}

	// メモリ測定終了
	runtime.ReadMemStats(&mEnd)
	elapsed := time.Since(startTime)

	// stderr に出力
	fmt.Fprintf(os.Stderr, "Execution time: %v\n", elapsed)
	fmt.Fprintf(os.Stderr, "Memory used: %.3f MB (peak: %.3f MB)\n",
		float64(mEnd.Alloc-mStart.Alloc)/1024.0/1024.0,
		float64(mEnd.TotalAlloc)/1024.0/1024.0)
}
// ```

// ---

// ### 実装ポイント

// 1. **二分探索 (`lowerBound`)**
//    Go の `sort.Search` を使って O(log N) で挿入位置を特定します。

// 2. **昇順維持**
//    配列を右にシフトして挿入します。Go のスライスはメモリ連続領域なのでこの部分は O(N) になりますが、二分探索で位置特定は高速です。

// 3. **型明示**
//    全ての数値を `int64` に統一し、返却値・引数も明確に型を指定。

// 4. **計測**

//    * 実行時間: `time.Now()` と `Since()`
//    * メモリ: `runtime.ReadMemStats`

