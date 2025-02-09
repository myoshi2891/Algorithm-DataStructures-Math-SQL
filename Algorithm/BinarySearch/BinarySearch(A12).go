package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	reader := bufio.NewReader(os.Stdin)
	line, _ := reader.ReadString('\n')
	parts := strings.Fields(line)

	N, _ := strconv.Atoi(parts[0])
	K, _ := strconv.Atoi(parts[1])

	line, _ = reader.ReadString('\n')
	parts = strings.Fields(line)

	A := make([]int, N)
	for i := 0; i < N; i++ {
		A[i], _ = strconv.Atoi(parts[i])
	}

	// 二分探索
	left, right := 1, int(1e9)
	for left < right {
		mid := (left + right) / 2
		sum := 0
		for _, a := range A {
			sum += mid / a
			if sum >= K { // K 枚以上印刷できるなら探索範囲を狭める
				break
			}
		}
		if sum >= K {
			right = mid
		} else {
			left = mid + 1
		}
	}

	fmt.Println(left)
}
