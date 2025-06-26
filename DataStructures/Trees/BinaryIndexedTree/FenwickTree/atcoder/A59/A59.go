package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type FenwickTree struct {
	n    int
	tree []int
}

func NewFenwickTree(size int) *FenwickTree {
	return &FenwickTree{
		n:    size,
		tree: make([]int, size+1), // 1-indexed
	}
}

func (f *FenwickTree) Add(index, value int) {
	for index <= f.n {
		f.tree[index] += value
		index += index & -index
	}
}

func (f *FenwickTree) Sum(index int) int {
	res := 0
	for index > 0 {
		res += f.tree[index]
		index -= index & -index
	}
	return res
}

func (f *FenwickTree) RangeSum(l, r int) int {
	return f.Sum(r-1) - f.Sum(l-1)
}

func main() {
	reader := bufio.NewReader(os.Stdin)
	scanner := bufio.NewScanner(reader)
	scanner.Split(bufio.ScanLines)

	// 最初の行: N Q
	scanner.Scan()
	parts := strings.Fields(scanner.Text())
	N, _ := strconv.Atoi(parts[0])
	Q, _ := strconv.Atoi(parts[1])

	ft := NewFenwickTree(N)
	A := make([]int, N+1) // 1-indexed

	writer := bufio.NewWriter(os.Stdout)
	defer writer.Flush()

	for i := 0; i < Q && scanner.Scan(); i++ {
		line := scanner.Text()
		query := strings.Fields(line)

		if query[0] == "1" {
			pos, _ := strconv.Atoi(query[1])
			x, _ := strconv.Atoi(query[2])
			diff := x - A[pos]
			A[pos] = x
			ft.Add(pos, diff)
		} else if query[0] == "2" {
			l, _ := strconv.Atoi(query[1])
			r, _ := strconv.Atoi(query[2])
			sum := ft.RangeSum(l, r)
			fmt.Fprintln(writer, sum)
		}
	}
}
