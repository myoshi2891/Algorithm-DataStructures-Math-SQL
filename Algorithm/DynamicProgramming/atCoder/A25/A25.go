package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	// 標準入力の高速読み取り
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanLines)

	// H, W 読み取り
	var H, W int
	fmt.Scanf("%d %d", &H, &W)

	// グリッド読み取り
	grid := make([]string, H)
	for i := 0; i < H; i++ {
		scanner.Scan()
		grid[i] = scanner.Text()
	}

	// DPテーブル作成（初期値は0）
	dp := make([][]int64, H)
	for i := 0; i < H; i++ {
		dp[i] = make([]int64, W)
	}

	// スタートが白マスなら1通り
	if grid[0][0] == '.' {
		dp[0][0] = 1
	}

	// DP計算
	for i := 0; i < H; i++ {
		for j := 0; j < W; j++ {
			if grid[i][j] == '#' {
				continue
			}
			if i > 0 && grid[i-1][j] == '.' {
				dp[i][j] += dp[i-1][j]
			}
			if j > 0 && grid[i][j-1] == '.' {
				dp[i][j] += dp[i][j-1]
			}
		}
	}

	// 答え出力
	fmt.Println(dp[H-1][W-1])
}
