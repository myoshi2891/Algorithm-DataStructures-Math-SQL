package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	// 入力準備
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	T, _ := strconv.Atoi(scanner.Text())

	type Triple struct{ P, Q, R int }
	triplets := make([]Triple, T)

	// 入力読み込み
	for i := 0; i < T; i++ {
		scanner.Scan()
		s := strings.Split(scanner.Text(), " ")
		p, _ := strconv.Atoi(s[0])
		q, _ := strconv.Atoi(s[1])
		r, _ := strconv.Atoi(s[2])
		triplets[i] = Triple{p - 1, q - 1, r - 1}
	}

	X := make([]int, 20)
	zeroCount := 20
	result := make([]string, T)

	// 操作実行
	for i, t := range triplets {
		indices := []int{t.P, t.Q, t.R}
		gainA := 0
		gainB := 0

		// 操作Aのスコア変化を確認
		for _, idx := range indices {
			if X[idx] == 0 {
				gainA--
			}
			if X[idx]+1 == 0 {
				gainA++
			}
		}

		// 操作Bのスコア変化を確認
		for _, idx := range indices {
			if X[idx] == 0 {
				gainB--
			}
			if X[idx]-1 == 0 {
				gainB++
			}
		}

		// よりスコアが高い方を選択
		if gainA >= gainB {
			result[i] = "A"
			for _, idx := range indices {
				if X[idx] == 0 {
					zeroCount--
				}
				X[idx]++
				if X[idx] == 0 {
					zeroCount++
				}
			}
		} else {
			result[i] = "B"
			for _, idx := range indices {
				if X[idx] == 0 {
					zeroCount--
				}
				X[idx]--
				if X[idx] == 0 {
					zeroCount++
				}
			}
		}
	}

	// 出力
	for _, op := range result {
		fmt.Println(op)
	}
}
