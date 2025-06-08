package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	Q, _ := strconv.Atoi(scanner.Text())

	scores := make(map[string]int)
	var output []string

	for i := 0; i < Q; i++ {
		scanner.Scan()
		parts := strings.Fields(scanner.Text())

		if parts[0] == "1" {
			// クエリ1: 生徒 x に y 点を登録
			name := parts[1]
			score, _ := strconv.Atoi(parts[2])
			scores[name] = score
		} else if parts[0] == "2" {
			// クエリ2: 生徒 x の点数を出力
			name := parts[1]
			output = append(output, strconv.Itoa(scores[name]))
		}
	}

	fmt.Println(strings.Join(output, "\n"))
}
