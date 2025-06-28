package main

import (
	"bufio"
	"container/heap"
	"fmt"
	"os"
)

type Edge struct {
	to   int
	cost int
	tree int
}

type Item struct {
	cost  int
	ntree int // -tree（木の多い方を優先するために負にする）
	node  int
}
type PriorityQueue []*Item

func (pq PriorityQueue) Len() int { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool {
	if pq[i].cost != pq[j].cost {
		return pq[i].cost < pq[j].cost
	}
	return pq[i].ntree < pq[j].ntree // 木の本数が多い（ntreeが小さい）方が優先
}
func (pq PriorityQueue) Swap(i, j int) { pq[i], pq[j] = pq[j], pq[i] }
func (pq *PriorityQueue) Push(x any)   { *pq = append(*pq, x.(*Item)) }
func (pq *PriorityQueue) Pop() any {
	old := *pq
	n := len(old)
	item := old[n-1]
	*pq = old[0 : n-1]
	return item
}

func main() {
	sc := bufio.NewScanner(os.Stdin)
	sc.Split(bufio.ScanWords)
	readInt := func() int {
		sc.Scan()
		n := 0
		for _, b := range sc.Bytes() {
			n = n*10 + int(b-'0')
		}
		return n
	}

	N := readInt()
	M := readInt()
	graph := make([][]Edge, N+1)

	for i := 0; i < M; i++ {
		a := readInt()
		b := readInt()
		c := readInt()
		d := readInt()
		graph[a] = append(graph[a], Edge{to: b, cost: c, tree: d})
		graph[b] = append(graph[b], Edge{to: a, cost: c, tree: d})
	}

	const INF = int(1e9)
	dist := make([]int, N+1)
	trees := make([]int, N+1)
	for i := 1; i <= N; i++ {
		dist[i] = INF
		trees[i] = -1
	}
	dist[1] = 0
	trees[1] = 0

	pq := &PriorityQueue{}
	heap.Push(pq, &Item{cost: 0, ntree: 0, node: 1})

	for pq.Len() > 0 {
		item := heap.Pop(pq).(*Item)
		cost, negTrees, u := item.cost, item.ntree, item.node
		curTrees := -negTrees

		if cost > dist[u] || (cost == dist[u] && curTrees < trees[u]) {
			continue
		}

		for _, e := range graph[u] {
			newCost := cost + e.cost
			newTrees := curTrees + e.tree
			if newCost < dist[e.to] || (newCost == dist[e.to] && newTrees > trees[e.to]) {
				dist[e.to] = newCost
				trees[e.to] = newTrees
				heap.Push(pq, &Item{cost: newCost, ntree: -newTrees, node: e.to})
			}
		}
	}

	fmt.Println(dist[N], trees[N])
}
