package main

import (
	"fmt"
	"sort"
)

func main() {
	// 入力の受け取り
	var N, X int
	fmt.Scan(&N, &X)
	A := make([]int, N)
	for i := 0; i < N; i++ {
		fmt.Scan(&A[i])
	}

	// 二分探索でXの位置を探す
	index := sort.Search(N, func(i int) bool { return A[i] >= X })

	// 1-based indexで出力
	fmt.Println(index + 1)
}
