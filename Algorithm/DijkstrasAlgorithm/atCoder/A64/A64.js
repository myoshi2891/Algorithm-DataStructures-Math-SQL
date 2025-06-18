const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');

const [N, M] = input[0].split(' ').map(Number);
const edges = input.slice(1).map((line) => line.split(' ').map(Number));

const graph = Array.from({ length: N }, () => []);
for (let [a, b, c] of edges) {
    a--;
    b--; // 0-indexed
    graph[a].push([b, c]);
    graph[b].push([a, c]);
}

// Priority Queue (Min Heap)
class MinHeap {
    constructor() {
        this.heap = [];
    }

    push(item) {
        this.heap.push(item);
        this._bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.size() === 0) return null;
        const top = this.heap[0];
        const last = this.heap.pop();
        if (this.size() > 0) {
            this.heap[0] = last;
            this._bubbleDown(0);
        }
        return top;
    }

    size() {
        return this.heap.length;
    }

    _bubbleUp(i) {
        while (i > 0) {
            let p = Math.floor((i - 1) / 2);
            if (this.heap[p][0] <= this.heap[i][0]) break;
            [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
            i = p;
        }
    }

    _bubbleDown(i) {
        const n = this.heap.length;
        while (true) {
            let left = 2 * i + 1;
            let right = 2 * i + 2;
            let smallest = i;

            if (left < n && this.heap[left][0] < this.heap[smallest][0]) smallest = left;
            if (right < n && this.heap[right][0] < this.heap[smallest][0]) smallest = right;
            if (smallest === i) break;

            [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
            i = smallest;
        }
    }
}

const dist = Array(N).fill(Infinity);
dist[0] = 0;

const pq = new MinHeap();
pq.push([0, 0]); // [距離, 頂点]

while (pq.size() > 0) {
    const [d, u] = pq.pop();
    if (d > dist[u]) continue;

    for (const [v, cost] of graph[u]) {
        if (dist[v] > d + cost) {
            dist[v] = d + cost;
            pq.push([dist[v], v]);
        }
    }
}

for (let i = 0; i < N; i++) {
    console.log(dist[i] === Infinity ? -1 : dist[i]);
}
