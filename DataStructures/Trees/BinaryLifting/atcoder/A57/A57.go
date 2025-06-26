package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

const LOG = 30 // 2^30 > 1e9

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanWords)

	// ユーティリティ：次の整数を読み込む
	nextInt := func() int {
		scanner.Scan()
		n, _ := strconv.Atoi(scanner.Text())
		return n
	}

	N := nextInt()
	Q := nextInt()

	A := make([]int, N)
	for i := 0; i < N; i++ {
		A[i] = nextInt() - 1 // 0-indexed
	}

	// doubling[k][i]: i番の穴から2^k日後にいる穴
	doubling := make([][]int, LOG)
	for k := 0; k < LOG; k++ {
		doubling[k] = make([]int, N)
	}

	// 初期化（1日後）
	for i := 0; i < N; i++ {
		doubling[0][i] = A[i]
	}

	// ダブリングテーブル作成
	for k := 1; k < LOG; k++ {
		for i := 0; i < N; i++ {
			doubling[k][i] = doubling[k-1][doubling[k-1][i]]
		}
	}

	writer := bufio.NewWriter(os.Stdout)
	defer writer.Flush()

	// クエリ処理
	for q := 0; q < Q; q++ {
		x := nextInt() - 1
		y := nextInt()

		for k := 0; k < LOG; k++ {
			if (y>>k)&1 == 1 {
				x = doubling[k][x]
			}
		}
		fmt.Fprintln(writer, x+1) // 1-indexedで出力
	}
}
