package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

var (
	tree        [][]int
	subordinates []int
)

func dfs(node int) int {
	count := 0
	for _, child := range tree[node] {
		count += 1 + dfs(child)
	}
	subordinates[node] = count
	return count
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanWords)

	// 入力読み取り
	scanner.Scan()
	N, _ := strconv.Atoi(scanner.Text())

	tree = make([][]int, N+1)        // 1-indexed
	subordinates = make([]int, N+1)  // 結果格納用

	for i := 2; i <= N; i++ {
		scanner.Scan()
		a, _ := strconv.Atoi(scanner.Text())
		tree[a] = append(tree[a], i)
	}

	dfs(1) // 社長からDFS開始

	// 結果出力
	for i := 1; i <= N; i++ {
		fmt.Print(subordinates[i])
		if i < N {
			fmt.Print(" ")
		}
	}
	fmt.Println()
}
