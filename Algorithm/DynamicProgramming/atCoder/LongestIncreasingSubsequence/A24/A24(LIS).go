package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanWords)

	// 数値を読む関数
	readInt := func() int {
		scanner.Scan()
		n, _ := strconv.Atoi(scanner.Text())
		return n
	}

	// 入力の読み込み
	N := readInt()
	A := make([]int, N)
	for i := 0; i < N; i++ {
		A[i] = readInt()
	}

	// LIS（最長増加部分列）を構築
	dp := []int{}
	for _, a := range A {
		i := sort.Search(len(dp), func(i int) bool {
			return dp[i] >= a
		})
		if i == len(dp) {
			dp = append(dp, a)
		} else {
			dp[i] = a
		}
	}

	// 答えの出力
	fmt.Println(len(dp))
}
