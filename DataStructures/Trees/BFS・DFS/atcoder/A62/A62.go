package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

var (
	graph   [][]int
	visited []bool
)

func dfs(v int) {
	visited[v] = true
	for _, neighbor := range graph[v] {
		if !visited[neighbor] {
			dfs(neighbor)
		}
	}
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	parts := strings.Fields(scanner.Text())
	N, _ := strconv.Atoi(parts[0])
	M, _ := strconv.Atoi(parts[1])

	// 初期化
	graph = make([][]int, N+1)
	visited = make([]bool, N+1)

	// 辺の読み取り
	for i := 0; i < M; i++ {
		scanner.Scan()
		parts = strings.Fields(scanner.Text())
		a, _ := strconv.Atoi(parts[0])
		b, _ := strconv.Atoi(parts[1])
		graph[a] = append(graph[a], b)
		graph[b] = append(graph[b], a) // 無向グラフなので両方向
	}

	// DFSで連結成分を探索（頂点1から）
	dfs(1)

	// 判定
	allVisited := true
	for i := 1; i <= N; i++ {
		if !visited[i] {
			allVisited = false
			break
		}
	}

	if allVisited {
		fmt.Println("The graph is connected.")
	} else {
		fmt.Println("The graph is not connected.")
	}
}
