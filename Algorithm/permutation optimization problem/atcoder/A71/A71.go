package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)

	// 1行目: N
	scanner.Scan()
	N, _ := strconv.Atoi(scanner.Text())

	// 2行目: 難易度 A
	scanner.Scan()
	A := parseLine(scanner.Text(), N)

	// 3行目: 気温 B
	scanner.Scan()
	B := parseLine(scanner.Text(), N)

	// 難易度 A は降順
	sort.Slice(A, func(i, j int) bool { return A[i] > A[j] })

	// 気温 B は昇順
	sort.Ints(B)

	// 最小労力を計算
	total := 0
	for i := 0; i < N; i++ {
		total += A[i] * B[i]
	}

	fmt.Println(total)
}

func parseLine(line string, N int) []int {
	tokens := strings.Fields(line)
	result := make([]int, N)
	for i := 0; i < N; i++ {
		num, _ := strconv.Atoi(tokens[i])
		result[i] = num
	}
	return result
}
