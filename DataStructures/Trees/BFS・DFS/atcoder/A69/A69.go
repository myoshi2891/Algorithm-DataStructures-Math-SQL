package main

import (
	"bufio"
	"fmt"
	"os"
)

var (
	N       int
	adj     [][]int  // 生徒ごとの希望席リスト
	matchTo []int    // 各席に割り当てられた生徒（-1 は未割り当て）
	visited []bool   // 各DFS中の訪問済みフラグ
)

func dfs(u int) bool {
	for _, v := range adj[u] {
		if visited[v] {
			continue
		}
		visited[v] = true

		if matchTo[v] == -1 || dfs(matchTo[v]) {
			matchTo[v] = u
			return true
		}
	}
	return false
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	fmt.Sscanf(scanner.Text(), "%d", &N)

	adj = make([][]int, N)
	for i := 0; i < N; i++ {
		scanner.Scan()
		line := scanner.Text()
		for j, c := range line {
			if c == '#' {
				adj[i] = append(adj[i], j)
			}
		}
	}

	matchTo = make([]int, N)
	for i := range matchTo {
		matchTo[i] = -1
	}

	result := 0
	for i := 0; i < N; i++ {
		visited = make([]bool, N)
		if dfs(i) {
			result++
		}
	}

	fmt.Println(result)
}
