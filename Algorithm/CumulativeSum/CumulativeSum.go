package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	// 標準入力を設定
	reader := bufio.NewReader(os.Stdin)

	// N と Q を読み込む
	firstLine, _ := reader.ReadString('\n')
	firstLine = strings.TrimSpace(firstLine)
	nq := strings.Split(firstLine, " ")
	N, _ := strconv.Atoi(nq[0])
	Q, _ := strconv.Atoi(nq[1])

	// 来場者数データを読み込む
	secondLine, _ := reader.ReadString('\n')
	secondLine = strings.TrimSpace(secondLine)
	A := make([]int, N)
	for i, val := range strings.Split(secondLine, " ") {
		A[i], _ = strconv.Atoi(val)
	}

	// 累積和を計算
	prefixSum := make([]int, N+1)
	for i := 1; i <= N; i++ {
		prefixSum[i] = prefixSum[i-1] + A[i-1]
	}

	// 質問を処理
	results := make([]int, Q)
	for i := 0; i < Q; i++ {
		line, _ := reader.ReadString('\n')
		line = strings.TrimSpace(line)
		lr := strings.Split(line, " ")
		L, _ := strconv.Atoi(lr[0])
		R, _ := strconv.Atoi(lr[1])

		// L 日目から R 日目までの合計を計算
		results[i] = prefixSum[R] - prefixSum[L-1]
	}

	// 結果を出力
	for _, result := range results {
		fmt.Println(result)
	}
}
