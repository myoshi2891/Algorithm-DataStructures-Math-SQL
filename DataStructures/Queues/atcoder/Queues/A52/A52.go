package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type FastQueue struct {
	data []string
	head int
}

func (q *FastQueue) Enqueue(x string) {
	q.data = append(q.data, x)
}

func (q *FastQueue) Dequeue() {
	q.head++
}

func (q *FastQueue) Front() string {
	return q.data[q.head]
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	var Q int
	fmt.Sscan(scanner.Text(), &Q)

	queue := &FastQueue{}
	var output []string

	for i := 0; i < Q; i++ {
		scanner.Scan()
		line := scanner.Text()
		if strings.HasPrefix(line, "1 ") {
			// クエリ 1: "1 name"
			parts := strings.Split(line, " ")
			queue.Enqueue(parts[1])
		} else if line == "2" {
			// クエリ 2: 出力
			output = append(output, queue.Front())
		} else if line == "3" {
			// クエリ 3: 先頭削除
			queue.Dequeue()
		}
	}

	fmt.Println(strings.Join(output, "\n"))
}
