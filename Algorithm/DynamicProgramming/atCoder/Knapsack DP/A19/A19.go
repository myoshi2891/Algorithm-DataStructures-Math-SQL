package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	var N, W int
	fmt.Sscanf(scanner.Text(), "%d %d", &N, &W)

	weights := make([]int, N)
	values := make([]int, N)

	for i := 0; i < N; i++ {
		scanner.Scan()
		fmt.Sscanf(scanner.Text(), "%d %d", &weights[i], &values[i])
	}

	// DPテーブル
	dp := make([]int, W+1)

	// 0/1ナップサック DP
	for i := 0; i < N; i++ {
		w, v := weights[i], values[i]
		for j := W; j >= w; j-- {
			dp[j] = max(dp[j], dp[j-w]+v)
		}
	}

	// 答えは dp[W]
	fmt.Println(dp[W])
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
