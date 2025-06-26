const fs = require('fs');

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = input[0].split(' ').map(Number);
const edges = [];

for (let i = 1; i <= M; i++) {
    const [a, b, c] = input[i].split(' ').map(Number);
    edges.push({ a: a - 1, b: b - 1, cost: c }); // 0-indexed
}

// コストの小さい順にソート
edges.sort((e1, e2) => e1.cost - e2.cost);

// Union-Find 構造体
class UnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }

    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // 経路圧縮
        }
        return this.parent[x];
    }

    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX === rootY) return false;

        // union by rank
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else {
            this.parent[rootY] = rootX;
            if (this.rank[rootX] === this.rank[rootY]) {
                this.rank[rootX]++;
            }
        }
        return true;
    }
}

const uf = new UnionFind(N);
let totalCost = 0;
let edgesUsed = 0;

for (const edge of edges) {
    if (uf.union(edge.a, edge.b)) {
        totalCost += edge.cost;
        edgesUsed++;
        if (edgesUsed === N - 1) break; // MST 完成
    }
}

console.log(totalCost);
