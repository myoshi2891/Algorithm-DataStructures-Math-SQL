// 以下は、**Go 1.20.6** を用いて、**各生徒の正解数**を求めるプログラムです。
// 制約（最大 20 万件）を考慮し、**時間・メモリ効率を意識**した実装にしています。

// ---

// ## ✅ 解法のポイント

// * 生徒ごとに「**誤答回数**」をカウント（`[]int` の配列）。
// * 各生徒の **正解数 = M - 誤答回数** を O(1) で計算。
// * 入力サイズが大きいため、**`bufio.Scanner` + `strconv.Atoi`** を使用。

// ---

// ## ✅ Goコード（`main.go`）

// ```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

/*
calculateCorrectAnswers は各生徒の正解数を計算する関数

Parameters:
- n int: 生徒の人数 (1 <= n <= 200000)
- m int: 問題数 (1 <= m <= 200000)
- a []int: 各問題で誤答した生徒の番号（1-indexed, 長さm）

Returns:
- []int: 各生徒の正解数（インデックス0が1番目の生徒に対応）
*/
func calculateCorrectAnswers(n int, m int, a []int) []int {
	wrongCounts := make([]int, n)

	for _, student := range a {
		wrongCounts[student-1]++
	}

	correctAnswers := make([]int, n)
	for i := 0; i < n; i++ {
		correctAnswers[i] = m - wrongCounts[i]
	}
	return correctAnswers
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanWords)

	// readInt は bufio.Scanner から整数を読むためのヘルパー
	readInt := func() int {
		scanner.Scan()
		v, _ := strconv.Atoi(scanner.Text())
		return v
	}

	// 入力の読み取り
	n := readInt()
	m := readInt()

	a := make([]int, m)
	for i := 0; i < m; i++ {
		a[i] = readInt()
	}

	// 正解数を計算
	result := calculateCorrectAnswers(n, m, a)

	// 出力
	writer := bufio.NewWriter(os.Stdout)
	defer writer.Flush()

	for _, val := range result {
		fmt.Fprintln(writer, val)
	}
}

// ## ✅ 入力例（input.txt）

// ```
// 4 6
// 1 4 1 4 2 1
// ```

// ### 実行方法：

// ```bash
// go run main.go < input.txt
// ```

// ### 出力：

// ```
// 3
// 5
// 6
// 4
// ```

// ---

// ## ✅ 処理時間・メモリの分析

// | 処理      | 時間計算量        | 空間計算量        |
// | ------- | ------------ | ------------ |
// | 入力読み込み  | O(M)         | O(M)         |
// | 誤答数カウント | O(M)         | O(N)         |
// | 正解数計算   | O(N)         | O(N)         |
// | 出力処理    | O(N)         | O(1)         |
// | **合計**  | **O(N + M)** | **O(N + M)** |

// * 入力最大時：200,000 件 → メモリ：整数1つ 8バイト → 約 1.6MB 程度

// ---

// ## ✅ 型の明示

// * `func calculateCorrectAnswers(n int, m int, a []int) []int`
// * スライス（`[]int`）は Go における動的配列であり、サイズ制約にも柔軟。
// * `make([]int, n)` によりゼロ初期化された整数配列を使用。

// ---

// ご希望があれば、**処理時間・メモリ使用量の計測**（`runtime` パッケージや `time.Now()`）を使ったプロファイリング付き実装も可能です。
