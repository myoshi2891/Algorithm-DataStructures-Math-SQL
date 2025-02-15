package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func canAchieveK(N, K int, A, B, C, D []int) {
	AB_set := make(map[int]bool)

	// A と B の全ペアの和を計算し、マップに格納
	for i := 0; i < N; i++ {
		for j := 0; j < N; j++ {
			AB_set[A[i]+B[j]] = true
		}
	}

	// C と D の全ペアの和を計算し、K - sum_cd が AB_set に存在するか確認
	for i := 0; i < N; i++ {
		for j := 0; j < N; j++ {
			if AB_set[K-(C[i]+D[j])] {
				fmt.Println("Yes")
				return
			}
		}
	}

	fmt.Println("No")
}

// 標準入力を受け取り、処理を実行
func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	parts := strings.Split(scanner.Text(), " ")
	N, _ := strconv.Atoi(parts[0])
	K, _ := strconv.Atoi(parts[1])

	A := readIntArray(scanner)
	B := readIntArray(scanner)
	C := readIntArray(scanner)
	D := readIntArray(scanner)

	canAchieveK(N, K, A, B, C, D)
}

// 標準入力から整数の配列を読み取る関数
func readIntArray(scanner *bufio.Scanner) []int {
	scanner.Scan()
	parts := strings.Split(scanner.Text(), " ")
	arr := make([]int, len(parts))
	for i, s := range parts {
		arr[i], _ = strconv.Atoi(s)
	}
	return arr
}
