package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	// 標準入力の準備
	reader := bufio.NewReader(os.Stdin)

	// 1行目: N の読み取り
	line1, _ := reader.ReadString('\n')
	N, err := strconv.Atoi(strings.TrimSpace(line1))
	if err != nil {
		fmt.Fprintln(os.Stderr, "Nの読み取りに失敗しました")
		return
	}

	// 2行目: A1 A2 ... AN の読み取り
	line2, _ := reader.ReadString('\n')
	fields := strings.Fields(line2)

	if len(fields) != N {
		fmt.Fprintln(os.Stderr, "棒の本数が N と一致しません")
		return
	}

	// 長さごとの出現回数を数える（1〜100）
	count := make([]int, 101) // index 1〜100 を使用

	for _, s := range fields {
		val, err := strconv.Atoi(s)
		if err != nil {
			fmt.Fprintln(os.Stderr, "整数変換に失敗しました:", s)
			return
		}
		if val < 1 || val > 100 {
			fmt.Fprintln(os.Stderr, "棒の長さが範囲外です:", val)
			return
		}
		count[val]++
	}

	// 正三角形が作れる組み合わせ数を計算
	result := 0
	for i := 1; i <= 100; i++ {
		c := count[i]
		if c >= 3 {
			result += (c * (c - 1) * (c - 2)) / 6 // C(n, 3)
		}
	}

	// 結果出力
	fmt.Println(result)
}
