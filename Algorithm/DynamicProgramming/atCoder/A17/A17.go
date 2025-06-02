package main

import (
	"fmt"
)

func findShortestPath(N int, A, B []int) []int {
	dp := make([]int, N+1)
	prev := make([]int, N+1)

	const INF = 1 << 30
	for i := range dp {
		dp[i] = INF
	}
	dp[1] = 0

	for i := 2; i <= N; i++ {
		dp[i] = dp[i-1] + A[i]
		prev[i] = i - 1
		if i > 2 {
			alt := dp[i-2] + B[i]
			if alt < dp[i] {
				dp[i] = alt
				prev[i] = i - 2
			}
		}
	}

	// 経路復元（逆順に格納するのを避ける）
	path := make([]int, 0, N)
	for cur := N; cur != 0; cur = prev[cur] {
		path = append(path, cur)
	}

	// 経路を正しい順番に並べ替える
	sz := len(path)
	for i := 0; i < sz/2; i++ {
		path[i], path[sz-1-i] = path[sz-1-i], path[i]
	}

	return path
}

func main() {
	var N int
	fmt.Scan(&N)

	A := make([]int, N+1)
	B := make([]int, N+1)

	for i := 2; i <= N; i++ {
		fmt.Scan(&A[i])
	}
	for i := 3; i <= N; i++ {
		fmt.Scan(&B[i])
	}

	path := findShortestPath(N, A, B)

	fmt.Println(len(path))
	for _, p := range path {
		fmt.Print(p, " ")
	}
	fmt.Println()
}
