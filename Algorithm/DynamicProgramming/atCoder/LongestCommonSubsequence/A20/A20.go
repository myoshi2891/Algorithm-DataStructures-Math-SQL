package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

// LCS を求める関数
func longestCommonSubsequence(S, T string) int {
	m, n := len(S), len(T)

	// メモリ削減のため、1次元配列を2つ使用
	prev := make([]int, n+1)
	curr := make([]int, n+1)

	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			if S[i-1] == T[j-1] {
				curr[j] = prev[j-1] + 1
			} else {
				curr[j] = max(prev[j], curr[j-1])
			}
		}
		// prev を curr に更新
		copy(prev, curr)
	}

	return prev[n]
}

// 最大値を求める関数
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)

	// 入力を受け取る
	scanner.Scan()
	S := strings.TrimSpace(scanner.Text())

	scanner.Scan()
	T := strings.TrimSpace(scanner.Text())

	// LCS の長さを出力
	fmt.Println(longestCommonSubsequence(S, T))
}
