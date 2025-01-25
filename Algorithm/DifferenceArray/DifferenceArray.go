package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	// 標準入力の読み込み
	reader := bufio.NewReader(os.Stdin)
	line, _ := reader.ReadString('\n')
	line = strings.TrimSpace(line)

	// D, N の取得
	D, _ := strconv.Atoi(line)
	line, _ = reader.ReadString('\n')
	N, _ := strconv.Atoi(strings.TrimSpace(line))

	// 差分配列の作成
	diff := make([]int, D+2)

	// 入力の読み込みと差分配列の更新
	for i := 0; i < N; i++ {
		line, _ := reader.ReadString('\n')
		parts := strings.Split(strings.TrimSpace(line), " ")
		L, _ := strconv.Atoi(parts[0])
		R, _ := strconv.Atoi(parts[1])

		diff[L] += 1
		if R+1 <= D {
			diff[R+1] -= 1
		}
	}

	// 累積和で各日の出席者数を計算
	attendance := make([]int, D)
	current := 0
	for i := 1; i <= D; i++ {
		current += diff[i]
		attendance[i-1] = current
	}

	// 結果を出力
	writer := bufio.NewWriter(os.Stdout)
	defer writer.Flush()
	for _, a := range attendance {
		fmt.Fprintln(writer, a)
	}
}
