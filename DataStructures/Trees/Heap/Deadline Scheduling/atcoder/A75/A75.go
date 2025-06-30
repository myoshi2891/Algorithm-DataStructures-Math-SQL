package main

import (
	"bufio"
	"container/heap"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

// 問題の構造体
type Problem struct {
	T int // 所要時間
	D int // 締切
}

// 最大ヒープの実装
type MaxHeap []int

func (h MaxHeap) Len() int            { return len(h) }
func (h MaxHeap) Less(i, j int) bool  { return h[i] > h[j] } // 逆順で最大ヒープに
func (h MaxHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MaxHeap) Push(x interface{}) { *h = append(*h, x.(int)) }
func (h *MaxHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}

func solve(N int, problems []Problem) int {
	// 締切 D で昇順ソート
	sort.Slice(problems, func(i, j int) bool {
		return problems[i].D < problems[j].D
	})

	totalTime := 0
	h := &MaxHeap{}
	heap.Init(h)

	for _, p := range problems {
		totalTime += p.T
		heap.Push(h, p.T)

		if totalTime > p.D {
			removed := heap.Pop(h).(int)
			totalTime -= removed
		}
	}

	return h.Len()
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	N, _ := strconv.Atoi(scanner.Text())

	var problems []Problem
	for i := 0; i < N; i++ {
		scanner.Scan()
		parts := strings.Fields(scanner.Text())
		T, _ := strconv.Atoi(parts[0])
		D, _ := strconv.Atoi(parts[1])
		problems = append(problems, Problem{T, D})
	}

	result := solve(N, problems)
	fmt.Println(result)
}
