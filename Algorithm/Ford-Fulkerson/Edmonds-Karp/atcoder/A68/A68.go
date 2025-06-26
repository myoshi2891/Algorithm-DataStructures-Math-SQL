package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

const INF = 1 << 30

func main() {
	reader := bufio.NewReader(os.Stdin)

	// 1行目: N, M
	line, _ := reader.ReadString('\n')
	parts := strings.Fields(line)
	N, _ := strconv.Atoi(parts[0])
	M, _ := strconv.Atoi(parts[1])

	// グラフ構築
	capacity := make([][]int, N+1)
	for i := range capacity {
		capacity[i] = make([]int, N+1)
	}

	graph := make([][]int, N+1)

	for i := 0; i < M; i++ {
		line, _ := reader.ReadString('\n')
		parts := strings.Fields(line)
		a, _ := strconv.Atoi(parts[0])
		b, _ := strconv.Atoi(parts[1])
		c, _ := strconv.Atoi(parts[2])

		capacity[a][b] += c
		graph[a] = append(graph[a], b)
		graph[b] = append(graph[b], a) // 逆辺も追加（残余グラフ）
	}

	fmt.Println(maxFlow(1, N, capacity, graph))
}

func bfs(s, t int, parent []int, capacity [][]int, graph [][]int) bool {
	N := len(capacity) - 1
	visited := make([]bool, N+1)
	queue := []int{s}
	visited[s] = true
	parent[s] = -1

	for len(queue) > 0 {
		u := queue[0]
		queue = queue[1:]

		for _, v := range graph[u] {
			if !visited[v] && capacity[u][v] > 0 {
				parent[v] = u
				visited[v] = true
				if v == t {
					return true
				}
				queue = append(queue, v)
			}
		}
	}
	return false
}

func maxFlow(s, t int, capacity [][]int, graph [][]int) int {
	flow := 0
	parent := make([]int, len(capacity))

	for bfs(s, t, parent, capacity, graph) {
		pathFlow := INF
		v := t
		for v != s {
			u := parent[v]
			if capacity[u][v] < pathFlow {
				pathFlow = capacity[u][v]
			}
			v = u
		}

		v = t
		for v != s {
			u := parent[v]
			capacity[u][v] -= pathFlow
			capacity[v][u] += pathFlow
			v = u
		}

		flow += pathFlow
	}
	return flow
}
