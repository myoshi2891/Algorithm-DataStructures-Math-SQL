package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func solve(A []int) int {
	N := len(A)
	dp := make([][]int, N)
	for i := range dp {
		dp[i] = make([]int, N)
		for j := range dp[i] {
			dp[i][j] = -1 // 未計算状態を -1 にする
		}
	}

	var dfs func(l, r int) int
	dfs = func(l, r int) int {
		if l == r {
			return A[l]
		}
		if dp[l][r] != -1 {
			return dp[l][r]
		}

		taroTurn := (r - l + 1) % 2 == N%2

		if taroTurn {
			dp[l][r] = max(dfs(l+1, r), dfs(l, r-1))
		} else {
			dp[l][r] = min(dfs(l+1, r), dfs(l, r-1))
		}
		return dp[l][r]
	}

	return dfs(0, N-1)
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// -------------------------
// 入力の読み取りと実行
// -------------------------
func main() {
	scanner := bufio.NewScanner(os.Stdin)

	// 1行目: N
	scanner.Scan()
	N, _ := strconv.Atoi(scanner.Text())

	// 2行目: A1 A2 ... AN
	scanner.Scan()
	Astr := strings.Split(scanner.Text(), " ")
	A := make([]int, N)
	for i := 0; i < N; i++ {
		A[i], _ = strconv.Atoi(Astr[i])
	}

	result := solve(A)
	fmt.Println(result)
}
