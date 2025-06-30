package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	sc := bufio.NewScanner(os.Stdin)

	// 1行目: D, N を読み込む
	sc.Scan()
	line := strings.TrimSpace(sc.Text())
	parts := strings.Split(line, " ")
	D, _ := strconv.Atoi(parts[0])
	N, _ := strconv.Atoi(parts[1])

	// 各日の最大労働時間（初期は24）
	maxHours := make([]int, D)
	for i := 0; i < D; i++ {
		maxHours[i] = 24
	}

	// 制約を適用
	for i := 0; i < N; i++ {
		sc.Scan()
		line = strings.TrimSpace(sc.Text())
		parts = strings.Split(line, " ")
		L, _ := strconv.Atoi(parts[0])
		R, _ := strconv.Atoi(parts[1])
		H, _ := strconv.Atoi(parts[2])

		for day := L - 1; day <= R - 1; day++ {
			if maxHours[day] > H {
				maxHours[day] = H
			}
		}
	}

	// 合計を計算
	total := 0
	for _, h := range maxHours {
		total += h
	}
	fmt.Println(total)
}
