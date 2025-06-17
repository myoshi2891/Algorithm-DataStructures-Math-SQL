package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	// 高速入出力設定
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanLines)
	writer := bufio.NewWriter(os.Stdout)
	defer writer.Flush()

	// 入力読み取り
	scanner.Scan()
	parts := strings.Fields(scanner.Text())
	N, _ := strconv.Atoi(parts[0])
	M, _ := strconv.Atoi(parts[1])

	// グラフ構築（隣接リスト）
	graph := make([][]int, N+1)
	for i := 0; i < M; i++ {
		scanner.Scan()
		ab := strings.Fields(scanner.Text())
		a, _ := strconv.Atoi(ab[0])
		b, _ := strconv.Atoi(ab[1])
		graph[a] = append(graph[a], b)
		graph[b] = append(graph[b], a) // 無向グラフ
	}

	// BFS 初期化
	dist := make([]int, N+1)
	for i := range dist {
		dist[i] = -1
	}
	queue := make([]int, 0, N)
	queue = append(queue, 1)
	dist[1] = 0

	// BFS 実行
	for head := 0; head < len(queue); head++ {
		current := queue[head]
		for _, neighbor := range graph[current] {
			if dist[neighbor] == -1 {
				dist[neighbor] = dist[current] + 1
				queue = append(queue, neighbor)
			}
		}
	}

	// 結果出力
	for i := 1; i <= N; i++ {
		fmt.Fprintln(writer, dist[i])
	}
}
