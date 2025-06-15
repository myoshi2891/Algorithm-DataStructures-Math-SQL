package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	// 入力準備
	reader := bufio.NewReader(os.Stdin)
	scanner := bufio.NewScanner(reader)
	scanner.Split(bufio.ScanLines)

	// 1行目：N, M
	scanner.Scan()
	firstLine := strings.Fields(scanner.Text())
	N, _ := strconv.Atoi(firstLine[0])
	M, _ := strconv.Atoi(firstLine[1])

	// 隣接リストの初期化（1-based index）
	graph := make([][]int, N+1)

	// M 行分の辺を読み取ってグラフに追加
	for i := 0; i < M; i++ {
		scanner.Scan()
		edge := strings.Fields(scanner.Text())
		a, _ := strconv.Atoi(edge[0])
		b, _ := strconv.Atoi(edge[1])
		graph[a] = append(graph[a], b)
		graph[b] = append(graph[b], a) // 無向グラフなので逆方向も
	}

	// 各頂点の隣接リストを出力
	for i := 1; i <= N; i++ {
		// 出力文字列構築
		adj := make([]string, len(graph[i]))
		for j, v := range graph[i] {
			adj[j] = strconv.Itoa(v)
		}
		fmt.Printf("%d: {%s}\n", i, strings.Join(adj, ", "))
	}
}
