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
	firstLine := strings.Split(scanner.Text(), " ")
	N, _ := strconv.Atoi(firstLine[0])
	S, _ := strconv.Atoi(firstLine[1])

	scanner.Scan()
	nums := strings.Split(scanner.Text(), " ")
	A := make([]int, N)
	for i := 0; i < N; i++ {
		A[i], _ = strconv.Atoi(nums[i])
	}

	// DP配列
	dp := make([]bool, S+1)
	dp[0] = true

	for _, a := range A {
		for j := S; j >= a; j-- {
			if dp[j-a] {
				dp[j] = true
			}
		}
	}

	if dp[S] {
		fmt.Println("Yes")
	} else {
		fmt.Println("No")
	}
}
