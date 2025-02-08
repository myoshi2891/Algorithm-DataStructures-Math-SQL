package main

import (
	"fmt"
)

func binarySearch(A []int, X int) int {
	left, right := 0, len(A)-1
	for left <= right {
		mid := left + (right-left)/2
		if A[mid] == X {
			return mid + 1 // 1-based index
		} else if A[mid] < X {
			left = mid + 1
		} else {
			right = mid - 1
		}
	}
	return -1 // ありえないケース（Xは必ず存在する制約なので）
}

func main() {
	var N, X int
	fmt.Scan(&N, &X)
	A := make([]int, N)
	for i := 0; i < N; i++ {
		fmt.Scan(&A[i])
	}

	fmt.Println(binarySearch(A, X))
}
