package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// 二分探索: A[i] + K 以下の最大のインデックス j を探す
func binarySearch(A []int, left, right, key int) int {
	for left < right {
		mid := (left + right + 1) / 2
		if A[mid] <= key {
			left = mid
		} else {
			right = mid - 1
		}
	}
	return left
}

func main() {
	// 高速な標準入力処理
	reader := bufio.NewReaderSize(os.Stdin, 1_000_000) // 1MB のバッファ確保
	line, _ := reader.ReadString('\n')
	params := strings.Fields(line)
	N, _ := strconv.Atoi(params[0])
	K, _ := strconv.Atoi(params[1])

	// 数列 A の入力
	line, _ = reader.ReadString('\n')
	numsStr := strings.Fields(line)

	A := make([]int, 0, N) // 事前に容量を確保
	for _, s := range numsStr {
		num, _ := strconv.Atoi(s)
		A = append(A, num)
	}

	// 二分探索でペアの数を求める
	var count int64 = 0 // int64 にしてオーバーフローを防ぐ
	for i := 0; i < N; i++ {
		j := binarySearch(A, i, N-1, A[i]+K) // A[i] + K 以下の最大の j
		count += int64(j - i)                // 組み合わせの数
	}

	fmt.Println(count)
}
