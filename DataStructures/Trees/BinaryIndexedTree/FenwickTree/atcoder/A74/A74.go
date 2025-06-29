package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

type FenwickTree struct {
	n    int
	data []int
}

func NewFenwickTree(n int) *FenwickTree {
	return &FenwickTree{
		n:    n + 2,
		data: make([]int, n+3),
	}
}

func (ft *FenwickTree) Update(i int) {
	i++
	for i < ft.n {
		ft.data[i]++
		i += i & -i
	}
}

func (ft *FenwickTree) Query(i int) int {
	i++
	res := 0
	for i > 0 {
		res += ft.data[i]
		i -= i & -i
	}
	return res
}

func CountInversions(arr []int, N int) int {
	ft := NewFenwickTree(N)
	inv := 0
	for i := len(arr) - 1; i >= 0; i-- {
		inv += ft.Query(arr[i] - 1)
		ft.Update(arr[i])
	}
	return inv
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanWords)

	nextInt := func() int {
		scanner.Scan()
		v, _ := strconv.Atoi(scanner.Text())
		return v
	}

	N := nextInt()
	grid := make([][]int, N)
	for i := 0; i < N; i++ {
		grid[i] = make([]int, N)
		for j := 0; j < N; j++ {
			grid[i][j] = nextInt()
		}
	}

	rowPos := make([]int, N+1)
	colPos := make([]int, N+1)

	// 位置記録
	for i := 0; i < N; i++ {
		for j := 0; j < N; j++ {
			val := grid[i][j]
			if val != 0 {
				rowPos[val] = i
				colPos[val] = j
			}
		}
	}

	rowPerm := make([]int, N)
	colPerm := make([]int, N)
	for k := 1; k <= N; k++ {
		rowPerm[k-1] = rowPos[k]
		colPerm[k-1] = colPos[k]
	}

	rowMoves := CountInversions(rowPerm, N)
	colMoves := CountInversions(colPerm, N)

	fmt.Println(rowMoves + colMoves)
}
