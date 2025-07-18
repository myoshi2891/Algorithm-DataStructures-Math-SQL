package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

const MAX = 300000

func main() {
	// 標準入力を高速に処理するためのScannerとWriter
	scanner := bufio.NewScanner(os.Stdin)
	writer := bufio.NewWriter(os.Stdout)
	defer writer.Flush()

	// 最初の行（Q）
	scanner.Scan()
	Q, _ := strconv.Atoi(scanner.Text())

	// 素数判定用のスライス
	isPrime := make([]bool, MAX+1)
	for i := 2; i <= MAX; i++ {
		isPrime[i] = true
	}

	// エラトステネスの篩
	for i := 2; i*i <= MAX; i++ {
		if isPrime[i] {
			for j := i * i; j <= MAX; j += i {
				isPrime[j] = false
			}
		}
	}

	// 各クエリに対して判定・出力
	for i := 0; i < Q; i++ {
		scanner.Scan()
		x, _ := strconv.Atoi(scanner.Text())
		if isPrime[x] {
			fmt.Fprintln(writer, "Yes")
		} else {
			fmt.Fprintln(writer, "No")
		}
	}
}
