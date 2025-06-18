import * as fs from 'fs';

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = input[0].split(' ').map(Number);

const graph: [number, number][][] = Array.from({ length: N }, () => []);

for (let i = 1; i <= M; i++) {
    const [a, b, c] = input[i].split(' ').map(Number);
    graph[a - 1].push([b - 1, c]);
    graph[b - 1].push([a - 1, c]);
}

class MinHeap {
    private heap: [number, number][] = [];

    push(item: [number, number]) {
        this.heap.push(item);
        this.bubbleUp(this.heap.length - 1);
    }

    pop(): [number, number] | undefined {
        if (this.heap.length === 0) return undefined;
        const top = this.heap[0];
        const end = this.heap.pop()!;
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.bubbleDown(0);
        }
        return top;
    }

    private bubbleUp(index: number) {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (this.heap[parent][0] <= this.heap[index][0]) break;
            [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
            index = parent;
        }
    }

    private bubbleDown(index: number) {
        const length = this.heap.length;
        while (true) {
            let smallest = index;
            const left = 2 * index + 1;
            const right = 2 * index + 2;

            if (left < length && this.heap[left][0] < this.heap[smallest][0]) smallest = left;
            if (right < length && this.heap[right][0] < this.heap[smallest][0]) smallest = right;

            if (smallest === index) break;
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }

    size(): number {
        return this.heap.length;
    }
}

const dist: number[] = Array(N).fill(Infinity);
dist[0] = 0;

const pq = new MinHeap();
pq.push([0, 0]); // [距離, 頂点]

while (pq.size() > 0) {
    const [currentDist, u] = pq.pop()!;
    if (currentDist > dist[u]) continue;

    for (const [v, cost] of graph[u]) {
        const newDist = currentDist + cost;
        if (newDist < dist[v]) {
            dist[v] = newDist;
            pq.push([newDist, v]);
        }
    }
}

for (const d of dist) {
    console.log(d === Infinity ? -1 : d);
}
