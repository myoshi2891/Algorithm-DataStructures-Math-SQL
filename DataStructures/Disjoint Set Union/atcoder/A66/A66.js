const fs = require('fs');

const input = fs.readFileSync(0, 'utf8').trim().split('\n');
const [N, Q] = input[0].split(' ').map(Number);

const parent = Array.from({ length: N + 1 }, (_, i) => i);
const rank = Array(N + 1).fill(0);

// Union-Find: Find root with path compression
const find = (x) => {
    if (parent[x] !== x) {
        parent[x] = find(parent[x]);
    }
    return parent[x];
};

// Union-Find: Union by rank
const union = (x, y) => {
    const rootX = find(x);
    const rootY = find(y);
    if (rootX === rootY) return;

    if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
    } else {
        parent[rootY] = rootX;
        if (rank[rootX] === rank[rootY]) {
            rank[rootX]++;
        }
    }
};

const output = [];

for (let i = 1; i <= Q; i++) {
    const [t, u, v] = input[i].split(' ').map(Number);
    if (t === 1) {
        union(u, v);
    } else {
        output.push(find(u) === find(v) ? 'Yes' : 'No');
    }
}

console.log(output.join('\n'));
