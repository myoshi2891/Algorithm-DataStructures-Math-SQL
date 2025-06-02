package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	// 標準入力の読み込み
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	N, _ := strconv.Atoi(scanner.Text())

	PA := make([][2]int, N)
	for i := 0; i < N; i++ {
		scanner.Scan()
		parts := strings.Split(scanner.Text(), " ")
		P, _ := strconv.Atoi(parts[0])
		A, _ := strconv.Atoi(parts[1])
		PA[i] = [2]int{P - 1, A} // 0-index に変換
	}

	// DPテーブルの作成
	dp := make([][]int, N)
	for i := range dp {
		dp[i] = make([]int, N)
	}

	// 区間 DP の計算
	for di := 0; di < N; di++ { // 区間の長さ
		for i := 0; i+di < N; i++ {
			j := i + di

			// 左端のブロックを削除する場合
			if i > 0 {
				pl, al := PA[i-1][0], PA[i-1][1]
				scoreL := 0
				if i <= pl && pl <= j {
					scoreL = al
				}
				dp[i-1][j] = max(dp[i-1][j], dp[i][j]+scoreL)
			}

			// 右端のブロックを削除する場合
			if j < N-1 {
				pr, ar := PA[j+1][0], PA[j+1][1]
				scoreR := 0
				if i <= pr && pr <= j {
					scoreR = ar
				}
				dp[i][j+1] = max(dp[i][j+1], dp[i][j]+scoreR)
			}
		}
	}

	// 結果の出力
	fmt.Println(dp[0][N-1])
}

// 最大値を求める関数
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
