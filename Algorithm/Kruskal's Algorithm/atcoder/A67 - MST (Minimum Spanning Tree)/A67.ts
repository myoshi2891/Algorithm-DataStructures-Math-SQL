import * as fs from 'fs';

// 標準入力の読み込み
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = input[0].split(' ').map(Number);

// 辺情報をパース
type Edge = { u: number; v: number; cost: number };
const edges: Edge[] = [];

for (let i = 1; i <= M; i++) {
    const [a, b, c] = input[i].split(' ').map(Number);
    edges.push({ u: a - 1, v: b - 1, cost: c }); // 0-indexed
}

// コストの昇順にソート
edges.sort((e1, e2) => e1.cost - e2.cost);

// Union-Find構造体
class UnionFind {
    private parent: number[];
    private rank: number[];

    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }

    find(x: number): number {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // 経路圧縮
        }
        return this.parent[x];
    }

    union(x: number, y: number): boolean {
        const rx = this.find(x);
        const ry = this.find(y);
        if (rx === ry) return false;

        if (this.rank[rx] < this.rank[ry]) {
            this.parent[rx] = ry;
        } else {
            this.parent[ry] = rx;
            if (this.rank[rx] === this.rank[ry]) {
                this.rank[rx]++;
            }
        }
        return true;
    }
}

// Kruskal法で最小全域木構築
const uf = new UnionFind(N);
let totalCost = 0;
let edgesUsed = 0;

for (const edge of edges) {
    if (uf.union(edge.u, edge.v)) {
        totalCost += edge.cost;
        edgesUsed++;
        if (edgesUsed === N - 1) break; // MST完成
    }
}

// 出力
console.log(totalCost);
