package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
)

type Edge struct {
	u, v, cost int
}

type UnionFind struct {
	parent []int
	rank   []int
}

func NewUnionFind(n int) *UnionFind {
	parent := make([]int, n)
	rank := make([]int, n)
	for i := 0; i < n; i++ {
		parent[i] = i
	}
	return &UnionFind{parent, rank}
}

func (uf *UnionFind) Find(x int) int {
	if uf.parent[x] != x {
		uf.parent[x] = uf.Find(uf.parent[x]) // 経路圧縮
	}
	return uf.parent[x]
}

func (uf *UnionFind) Union(x, y int) bool {
	rx := uf.Find(x)
	ry := uf.Find(y)
	if rx == ry {
		return false
	}
	if uf.rank[rx] < uf.rank[ry] {
		uf.parent[rx] = ry
	} else {
		uf.parent[ry] = rx
		if uf.rank[rx] == uf.rank[ry] {
			uf.rank[rx]++
		}
	}
	return true
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanWords)

	nextInt := func() int {
		scanner.Scan()
		n, _ := strconv.Atoi(scanner.Text())
		return n
	}

	N := nextInt()
	M := nextInt()

	edges := make([]Edge, M)
	for i := 0; i < M; i++ {
		a := nextInt() - 1
		b := nextInt() - 1
		c := nextInt()
		edges[i] = Edge{a, b, c}
	}

	// コスト順にソート
	sort.Slice(edges, func(i, j int) bool {
		return edges[i].cost < edges[j].cost
	})

	uf := NewUnionFind(N)
	total := 0
	count := 0

	for _, e := range edges {
		if uf.Union(e.u, e.v) {
			total += e.cost
			count++
			if count == N-1 {
				break
			}
		}
	}

	fmt.Println(total)
}
