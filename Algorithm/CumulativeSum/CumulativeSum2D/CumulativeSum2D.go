package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	// 標準入力の準備
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanLines)

	// H, W の読み込み
	scanner.Scan()
	hw := strings.Split(scanner.Text(), " ")
	H, _ := strconv.Atoi(hw[0])
	W, _ := strconv.Atoi(hw[1])

	// グリッドの読み込み
	grid := make([][]int, H+1)
	for i := range grid {
		grid[i] = make([]int, W+1)
	}
	for i := 1; i <= H; i++ {
		scanner.Scan()
		row := strings.Split(scanner.Text(), " ")
		for j := 1; j <= W; j++ {
			grid[i][j], _ = strconv.Atoi(row[j-1])
		}
	}

	// 累積和テーブルの作成
	S := make([][]int, H+1)
	for i := range S {
		S[i] = make([]int, W+1)
	}
	for i := 1; i <= H; i++ {
		for j := 1; j <= W; j++ {
			S[i][j] = grid[i][j] + S[i-1][j] + S[i][j-1] - S[i-1][j-1]
		}
	}

	// クエリの処理
	scanner.Scan()
	Q, _ := strconv.Atoi(scanner.Text())
	results := make([]int, Q)
	for q := 0; q < Q; q++ {
		scanner.Scan()
		query := strings.Split(scanner.Text(), " ")
		A, _ := strconv.Atoi(query[0])
		B, _ := strconv.Atoi(query[1])
		C, _ := strconv.Atoi(query[2])
		D, _ := strconv.Atoi(query[3])

		// 累積和を使った計算
		results[q] = S[C][D] - S[A-1][D] - S[C][B-1] + S[A-1][B-1]
	}

	// 結果の出力
	writer := bufio.NewWriter(os.Stdout)
	defer writer.Flush()
	for _, result := range results {
		fmt.Fprintln(writer, result)
	}
}
