package main

import (
	"bufio"
	"container/heap"
	"fmt"
	"os"
)

type Edge struct {
	to, cost int
}

type Item struct {
	node, dist int
}

type PriorityQueue []Item

func (pq PriorityQueue) Len() int { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool {
	return pq[i].dist < pq[j].dist
}
func (pq PriorityQueue) Swap(i, j int) {
	pq[i], pq[j] = pq[j], pq[i]
}
func (pq *PriorityQueue) Push(x any) {
	*pq = append(*pq, x.(Item))
}
func (pq *PriorityQueue) Pop() any {
	old := *pq
	n := len(old)
	item := old[n-1]
	*pq = old[:n-1]
	return item
}

const INF = int(1e18)

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanWords)

	readInt := func() int {
		scanner.Scan()
		var x int
		fmt.Sscanf(scanner.Text(), "%d", &x)
		return x
	}

	N := readInt()
	M := readInt()

	graph := make([][]Edge, N)
	for i := 0; i < M; i++ {
		a := readInt() - 1
		b := readInt() - 1
		c := readInt()
		graph[a] = append(graph[a], Edge{b, c})
		graph[b] = append(graph[b], Edge{a, c})
	}

	dist := make([]int, N)
	for i := range dist {
		dist[i] = INF
	}
	dist[0] = 0

	pq := &PriorityQueue{}
	heap.Init(pq)
	heap.Push(pq, Item{0, 0})

	for pq.Len() > 0 {
		cur := heap.Pop(pq).(Item)
		u := cur.node
		d := cur.dist
		if dist[u] < d {
			continue
		}
		for _, e := range graph[u] {
			if dist[e.to] > dist[u]+e.cost {
				dist[e.to] = dist[u] + e.cost
				heap.Push(pq, Item{e.to, dist[e.to]})
			}
		}
	}

	for _, d := range dist {
		if d == INF {
			fmt.Println(-1)
		} else {
			fmt.Println(d)
		}
	}
}
