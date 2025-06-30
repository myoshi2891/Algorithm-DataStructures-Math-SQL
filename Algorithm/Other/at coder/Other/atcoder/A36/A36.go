package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	var N, K int

	// 標準入力を読み込む
	scanner := bufio.NewScanner(os.Stdin)
	if scanner.Scan() {
		fmt.Sscanf(scanner.Text(), "%d %d", &N, &K)
	}

	minSteps := 2 * (N - 1)

	if K >= minSteps && (K-minSteps)%2 == 0 {
		fmt.Println("Yes")
	} else {
		fmt.Println("No")
	}
}
