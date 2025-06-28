import * as fs from 'fs';

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = input[0].split(' ').map(Number);

type Edge = { to: number; cost: number; tree: number };
const graph: Edge[][] = Array.from({ length: N + 1 }, () => []);

for (let i = 1; i <= M; i++) {
    const [a, b, c, d] = input[i].split(' ').map(Number);
    graph[a].push({ to: b, cost: c, tree: d });
    graph[b].push({ to: a, cost: c, tree: d }); // 双方向
}

// 優先度付きキューの自作ヒープ（[距離, -木の数, ノード] の順で比較）
class MinHeap<T> {
    private heap: T[] = [];
    constructor(private compare: (a: T, b: T) => number) {}

    push(value: T): void {
        this.heap.push(value);
        this._siftUp();
    }

    pop(): T | undefined {
        if (this.heap.length === 0) return undefined;
        const top = this.heap[0];
        const last = this.heap.pop()!;
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._siftDown();
        }
        return top;
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    private _siftUp(): void {
        let i = this.heap.length - 1;
        while (i > 0) {
            const p = Math.floor((i - 1) / 2);
            if (this.compare(this.heap[i], this.heap[p]) < 0) {
                [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
                i = p;
            } else break;
        }
    }

    private _siftDown(): void {
        let i = 0;
        const n = this.heap.length;
        while (true) {
            let smallest = i;
            const l = 2 * i + 1,
                r = 2 * i + 2;
            if (l < n && this.compare(this.heap[l], this.heap[smallest]) < 0) smallest = l;
            if (r < n && this.compare(this.heap[r], this.heap[smallest]) < 0) smallest = r;
            if (smallest === i) break;
            [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
            i = smallest;
        }
    }
}

// [距離, -木の数, ノード]
type State = [number, number, number];

const dist: number[] = Array(N + 1).fill(Infinity);
const treeCount: number[] = Array(N + 1).fill(-Infinity);
dist[1] = 0;
treeCount[1] = 0;

const heap = new MinHeap<State>((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0]; // 距離優先
    return a[1] - b[1]; // 木の本数（多い方が良い → -tree 小）
});

heap.push([0, 0, 1]); // [距離, -木の数, ノード]

while (!heap.isEmpty()) {
    const [cost, negTrees, u] = heap.pop()!;
    if (cost > dist[u]) continue;
    if (cost === dist[u] && -negTrees < treeCount[u]) continue;

    for (const { to: v, cost: c, tree: t } of graph[u]) {
        const newCost = cost + c;
        const newTrees = -negTrees + t;
        if (newCost < dist[v] || (newCost === dist[v] && newTrees > treeCount[v])) {
            dist[v] = newCost;
            treeCount[v] = newTrees;
            heap.push([newCost, -newTrees, v]);
        }
    }
}

console.log(`${dist[N]} ${treeCount[N]}`);
