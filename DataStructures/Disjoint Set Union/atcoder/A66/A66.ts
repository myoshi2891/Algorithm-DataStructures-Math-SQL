import * as fs from 'fs';

const input = fs.readFileSync(0, 'utf8').trim().split('\n');
const [N, Q] = input[0].split(' ').map(Number);

// Union-Find データ構造
class UnionFind {
    parent: number[];
    rank: number[];

    constructor(size: number) {
        this.parent = Array.from({ length: size + 1 }, (_, i) => i);
        this.rank = Array(size + 1).fill(0);
    }

    find(x: number): number {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }

    union(x: number, y: number): void {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX === rootY) return;

        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else {
            this.parent[rootY] = rootX;
            if (this.rank[rootX] === this.rank[rootY]) {
                this.rank[rootX]++;
            }
        }
    }

    same(x: number, y: number): boolean {
        return this.find(x) === this.find(y);
    }
}

const uf = new UnionFind(N);
const output: string[] = [];

for (let i = 1; i <= Q; i++) {
    const [t, u, v] = input[i].split(' ').map(Number);
    if (t === 1) {
        uf.union(u, v);
    } else {
        output.push(uf.same(u, v) ? 'Yes' : 'No');
    }
}

console.log(output.join('\n'));
