// 以下は、**Go言語** を使って「配列 A の中で X より小さい要素がいくつあるか」を求めるプログラムです。
// 高速処理のため、**ソート + 二分探索** を用いています。

// ---

// ## ✅ アルゴリズムの概要

// * `sort.Ints(A)` で昇順にソート（前処理）: `O(N log N)`
// * `sort.Search()` を使って各クエリに対する `X` 未満の個数を高速取得: `O(Q log N)`
// * 入力は `bufio.Scanner`、出力は `bufio.Writer` で高速処理

// ---

// ## ✅ Go 実装（型明示 + コメント付き）

// ```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
)

func main() {
	// 高速入出力設定
	reader := bufio.NewScanner(os.Stdin)
	reader.Split(bufio.ScanWords)
	writer := bufio.NewWriter(os.Stdout)
	defer writer.Flush()

	// 整数読み取り関数
	readInt := func() int {
		reader.Scan()
		val, _ := strconv.Atoi(reader.Text())
		return val
	}

	// 入力 N
	var N int = readInt()
	A := make([]int, N)
	for i := 0; i < N; i++ {
		A[i] = readInt()
	}

	// ソート（前処理）: O(N log N)
	sort.Ints(A)

	// 入力 Q
	var Q int = readInt()
	for i := 0; i < Q; i++ {
		X := readInt()
		// 二分探索（X未満の要素数）
		count := sort.Search(len(A), func(i int) bool {
			return A[i] >= X
		})
		fmt.Fprintln(writer, count)
	}
}
// ```

// ---

// ## ✅ 処理時間とメモリ使用量

// ### 時間計算量

// | 処理内容       | 時間計算量                |
// | ---------- | -------------------- |
// | ソート処理      | O(N log N)           |
// | クエリ Q 回の探索 | O(Q log N)           |
// | 合計         | O(N log N + Q log N) |

// → 最大 `N, Q = 100000` でも `2 × 10⁶` 操作以下 → **1 秒以内で処理可能**

// ---

// ### メモリ使用量（推定）

// | 要素     | 概要              | メモリ使用量（概算）         |
// | ------ | --------------- | ------------------ |
// | 配列 `A` | `[]int`, 最大10⁵個 | 約 0.8 MB（8バイト×10⁵） |
// | 出力     | `Writer` バッファなど | 数 KB〜数十 KB 程度      |
// | 合計     | 入力/出力含めて数 MB 程度 | ✅ 1024 MiB 制限に余裕あり |

// ---

// ## ✅ 入力例と出力

// ### 入力

// ```
// 5
// 1 3 3 3 1
// 2
// 4
// 3
// ```

// ### 出力

// ```
// 5
// 2
// ```

// ---

// ## ✅ 解法の特徴まとめ

// | 項目     | 内容                               |
// | ------ | -------------------------------- |
// | ソート    | `sort.Ints()`（O(N log N)）        |
// | 探索     | `sort.Search()` で二分探索（X未満）       |
// | 入出力高速化 | `bufio.Scanner` + `bufio.Writer` |
// | 実行時間   | 最大で 1 秒未満                        |
// | メモリ    | 数 MB 以下                          |

