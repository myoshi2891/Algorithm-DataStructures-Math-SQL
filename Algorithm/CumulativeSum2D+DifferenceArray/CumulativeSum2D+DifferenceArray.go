package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	reader := bufio.NewReader(os.Stdin)

	// 入力の読み取り
	line, _ := reader.ReadString('\n')
	parts := strings.Fields(line)
	H, _ := strconv.Atoi(parts[0])
	W, _ := strconv.Atoi(parts[1])
	N, _ := strconv.Atoi(parts[2])

	// (H+2) x (W+2) の差分配列を初期化
	diff := make([][]int, H+2)
	for i := range diff {
		diff[i] = make([]int, W+2)
	}

	// 差分配列に雪の情報を反映
	for i := 0; i < N; i++ {
		line, _ = reader.ReadString('\n')
		parts = strings.Fields(line)
		A, _ := strconv.Atoi(parts[0])
		B, _ := strconv.Atoi(parts[1])
		C, _ := strconv.Atoi(parts[2])
		D, _ := strconv.Atoi(parts[3])

		diff[A][B] += 1
		diff[C+1][B] -= 1
		diff[A][D+1] -= 1
		diff[C+1][D+1] += 1
	}

	// 横方向の累積和を計算
	for i := 1; i <= H; i++ {
		for j := 1; j <= W; j++ {
			diff[i][j] += diff[i][j-1]
		}
	}

	// 縦方向の累積和を計算
	for j := 1; j <= W; j++ {
		for i := 1; i <= H; i++ {
			diff[i][j] += diff[i-1][j]
		}
	}

	// 最終的な積雪量を出力
	writer := bufio.NewWriter(os.Stdout)
	defer writer.Flush()
	for i := 1; i <= H; i++ {
		for j := 1; j <= W; j++ {
			fmt.Fprintf(writer, "%d", diff[i][j])
			if j != W {
				fmt.Fprint(writer, " ")
			}
		}
		fmt.Fprintln(writer)
	}
}
