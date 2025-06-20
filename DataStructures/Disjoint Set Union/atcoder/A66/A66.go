package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type UnionFind struct {
	parent []int
	rank   []int
}

func NewUnionFind(n int) *UnionFind {
	uf := &UnionFind{
		parent: make([]int, n+1),
		rank:   make([]int, n+1),
	}
	for i := 1; i <= n; i++ {
		uf.parent[i] = i
	}
	return uf
}

func (uf *UnionFind) find(x int) int {
	if uf.parent[x] != x {
		uf.parent[x] = uf.find(uf.parent[x]) // 経路圧縮
	}
	return uf.parent[x]
}

func (uf *UnionFind) union(x, y int) {
	rootX := uf.find(x)
	rootY := uf.find(y)
	if rootX == rootY {
		return
	}
	if uf.rank[rootX] < uf.rank[rootY] {
		uf.parent[rootX] = rootY
	} else {
		uf.parent[rootY] = rootX
		if uf.rank[rootX] == uf.rank[rootY] {
			uf.rank[rootX]++
		}
	}
}

func (uf *UnionFind) same(x, y int) bool {
	return uf.find(x) == uf.find(y)
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	parts := strings.Split(scanner.Text(), " ")
	N, _ := strconv.Atoi(parts[0])
	Q, _ := strconv.Atoi(parts[1])

	uf := NewUnionFind(N)
	var output []string

	for i := 0; i < Q; i++ {
		scanner.Scan()
		query := strings.Split(scanner.Text(), " ")
		t, _ := strconv.Atoi(query[0])
		u, _ := strconv.Atoi(query[1])
		v, _ := strconv.Atoi(query[2])

		if t == 1 {
			uf.union(u, v)
		} else {
			if uf.same(u, v) {
				output = append(output, "Yes")
			} else {
				output = append(output, "No")
			}
		}
	}

	fmt.Println(strings.Join(output, "\n"))
}
