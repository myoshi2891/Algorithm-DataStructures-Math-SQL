package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type State struct {
	bitmask int
	steps   int
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	firstLine := strings.Fields(scanner.Text())
	N, _ := strconv.Atoi(firstLine[0])
	M, _ := strconv.Atoi(firstLine[1])

	coupons := make([]int, M)

	for i := 0; i < M; i++ {
		scanner.Scan()
		line := strings.Fields(scanner.Text())
		bit := 0
		for j := 0; j < N; j++ {
			val, _ := strconv.Atoi(line[j])
			if val == 1 {
				bit |= 1 << j
			}
		}
		coupons[i] = bit
	}

	goal := (1 << N) - 1
	visited := make([]bool, 1<<N)

	queue := []State{{bitmask: 0, steps: 0}}
	visited[0] = true

	for len(queue) > 0 {
		current := queue[0]
		queue = queue[1:]

		if current.bitmask == goal {
			fmt.Println(current.steps)
			return
		}

		for _, coupon := range coupons {
			next := current.bitmask | coupon
			if !visited[next] {
				visited[next] = true
				queue = append(queue, State{bitmask: next, steps: current.steps + 1})
			}
		}
	}

	fmt.Println(-1)
}
