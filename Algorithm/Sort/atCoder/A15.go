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
	// 高速な入力処理
	reader := bufio.NewReader(os.Stdin)

	// N の読み取り
	line, err := reader.ReadString('\n')
	if err != nil {
		fmt.Fprintln(os.Stderr, "Error reading N")
		os.Exit(1)
	}
	N, err := strconv.Atoi(strings.TrimSpace(line))
	if err != nil {
		fmt.Fprintln(os.Stderr, "Invalid input for N")
		os.Exit(1)
	}

	// 配列Aの読み取り
	line, err = reader.ReadString('\n')
	if err != nil {
		fmt.Fprintln(os.Stderr, "Error reading input array")
		os.Exit(1)
	}
	inputs := strings.Fields(line) // スペースで分割
	if len(inputs) != N {
		fmt.Fprintln(os.Stderr, "Input length does not match N")
		os.Exit(1)
	}

	// 配列Aの作成
	A := make([]int, N)
	for i := 0; i < N; i++ {
		A[i], err = strconv.Atoi(inputs[i])
		if err != nil {
			fmt.Fprintln(os.Stderr, "Invalid number in input:", inputs[i])
			os.Exit(1)
		}
	}

	// ソートのためのコピー
	sortedUniqueA := append([]int{}, A...) // メモリ節約のため `make([]int, N)` を使わない
	sort.Ints(sortedUniqueA)

	// ユニークな値を取得
	uniqueA := sortedUniqueA[:1] // 1つ目の要素をそのまま入れる
	for i := 1; i < len(sortedUniqueA); i++ {
		if sortedUniqueA[i] != sortedUniqueA[i-1] {
			uniqueA = append(uniqueA, sortedUniqueA[i])
		}
	}

	// 値をランキングにマッピング
	rankMap := make(map[int]int, len(uniqueA)) // マップのサイズを事前確保
	for i, v := range uniqueA {
		rankMap[v] = i + 1
	}

	// B を作成（strings.Builder を使用）
	var builder strings.Builder
	for i, v := range A {
		if i > 0 {
			builder.WriteString(" ")
		}
		builder.WriteString(strconv.Itoa(rankMap[v]))
	}

	// 結果を出力
	fmt.Println(builder.String())
}
