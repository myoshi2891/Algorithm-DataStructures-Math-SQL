const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split("\n");
const [N, M] = input[0].split(" ").map(Number);

const graph = Array.from({ length: N + 1 }, () => []);
for (let i = 1; i <= M; i++) {
  const [a, b, c, d] = input[i].split(" ").map(Number);
  graph[a].push({ to: b, cost: c, tree: d });
  graph[b].push({ to: a, cost: c, tree: d });
}

// ==============================
// 自前の最小ヒープ (Priority Queue)
// ==============================
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(item) {
    this.heap.push(item);
    this._siftUp();
  }

  pop() {
    if (this.heap.length === 0) return null;
    const top = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length !== 0) {
      this.heap[0] = end;
      this._siftDown();
    }
    return top;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  _siftUp() {
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this._compare(this.heap[i], this.heap[p]) < 0) {
        [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
        i = p;
      } else break;
    }
  }

  _siftDown() {
    let i = 0;
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this._compare(this.heap[l], this.heap[smallest]) < 0) smallest = l;
      if (r < n && this._compare(this.heap[r], this.heap[smallest]) < 0) smallest = r;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }

  // 辞書順比較: [距離, -木の本数]
  _compare(a, b) {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1]; // -木の数が小さい = 木の数が多い
  }
}

// ==============================
// Dijkstra with 木の本数管理
// ==============================

const dist = Array(N + 1).fill(Infinity);
const treeCount = Array(N + 1).fill(-Infinity);
dist[1] = 0;
treeCount[1] = 0;

const pq = new MinHeap();
pq.push([0, 0, 1]); // [距離, -木の数, 頂点]

while (!pq.isEmpty()) {
  const [curCost, negTrees, u] = pq.pop();

  if (curCost > dist[u]) continue;
  if (curCost === dist[u] && -negTrees < treeCount[u]) continue;

  for (const { to: v, cost: c, tree: t } of graph[u]) {
    const newCost = curCost + c;
    const newTrees = -negTrees + t;
    if (
      newCost < dist[v] ||
      (newCost === dist[v] && newTrees > treeCount[v])
    ) {
      dist[v] = newCost;
      treeCount[v] = newTrees;
      pq.push([newCost, -newTrees, v]);
    }
  }
}

console.log(`${dist[N]} ${treeCount[N]}`);
