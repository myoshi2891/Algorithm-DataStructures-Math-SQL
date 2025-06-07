package main

import (
	"bufio"
	"container/heap"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// ------- ヒープ定義 --------
type MinHeap []int

func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i] < h[j] } // 最小ヒープ
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *MinHeap) Push(x any) {
	*h = append(*h, x.(int))
}

func (h *MinHeap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}

// ---------------------------

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	writer := bufio.NewWriter(os.Stdout)
	defer writer.Flush()

	// バッファ拡大（入力が10万行などの場合）
	const maxBufSize = 1024 * 1024
	buf := make([]byte, maxBufSize)
	scanner.Buffer(buf, maxBufSize)

	// クエリ数読み取り
	scanner.Scan()
	Q, _ := strconv.Atoi(scanner.Text())

	h := &MinHeap{}
	heap.Init(h)

	for i := 0; i < Q; i++ {
		scanner.Scan()
		line := scanner.Text()
		tokens := strings.Split(line, " ")

		switch tokens[0] {
		case "1":
			x, _ := strconv.Atoi(tokens[1])
			heap.Push(h, x)
		case "2":
			fmt.Fprintln(writer, (*h)[0])
		case "3":
			heap.Pop(h)
		}
	}
}
