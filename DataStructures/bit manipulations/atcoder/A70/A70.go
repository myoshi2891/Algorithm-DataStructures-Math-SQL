package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	parts := strings.Fields(scanner.Text())
	N, _ := strconv.Atoi(parts[0])
	M, _ := strconv.Atoi(parts[1])

	// 初期状態の読み込み
	scanner.Scan()
	A := strings.Fields(scanner.Text())
	startState := 0
	for i := 0; i < N; i++ {
		val, _ := strconv.Atoi(A[i])
		if val == 1 {
			startState |= (1 << i)
		}
	}

	// 目標状態（すべてON）
	goalState := (1 << N) - 1

	// 操作の読み込み（ビットマスク）
	ops := make([]int, M)
	for i := 0; i < M; i++ {
		scanner.Scan()
		op := strings.Fields(scanner.Text())
		x, _ := strconv.Atoi(op[0])
		y, _ := strconv.Atoi(op[1])
		z, _ := strconv.Atoi(op[2])
		mask := (1 << (x - 1)) | (1 << (y - 1)) | (1 << (z - 1))
		ops[i] = mask
	}

	// BFS
	const MAX = 1 << 10 // 最大 2^10 = 1024 状態
	visited := make([]bool, MAX)
	type state struct {
		val   int
		steps int
	}
	queue := []state{{startState, 0}}
	visited[startState] = true

	for len(queue) > 0 {
		curr := queue[0]
		queue = queue[1:]

		if curr.val == goalState {
			fmt.Println(curr.steps)
			return
		}

		for _, op := range ops {
			next := curr.val ^ op
			if !visited[next] {
				visited[next] = true
				queue = append(queue, state{next, curr.steps + 1})
			}
		}
	}

	// 到達不可能
	fmt.Println(-1)
}
