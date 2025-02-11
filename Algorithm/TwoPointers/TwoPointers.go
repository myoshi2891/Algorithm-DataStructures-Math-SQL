package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	reader := bufio.NewReaderSize(os.Stdin, 1_000_000) // 1MB バッファを設定
	line, _ := reader.ReadString('\n')
	params := strings.Fields(line)
	N, _ := strconv.Atoi(params[0])
	K, _ := strconv.Atoi(params[1])

	line, _ = reader.ReadString('\n')
	numsStr := strings.Fields(line)
	A := make([]int, N)
	for i := 0; i < N; i++ {
		A[i], _ = strconv.Atoi(numsStr[i])
	}

	// 尺取り法で計算
	count := 0
	j := 0
	for i := 0; i < N; i++ {
		for j < N && A[j]-A[i] <= K {
			j++
		}
		count += (j - i - 1)
	}

	fmt.Println(count)
}

