const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split('\n');
const [N, M] = input[0].split(' ').map(Number);

// グラフ構築
const graph = Array.from({ length: N + 1 }, () => []);
for (let i = 1; i <= M; i++) {
    const [a, b] = input[i].split(' ').map(Number);
    graph[a].push(b);
    graph[b].push(a);
}

// BFS用 初期化
const distance = Array(N + 1).fill(-1);
distance[1] = 0;

const queue = [];
let head = 0;
queue.push(1);

// BFS開始
while (head < queue.length) {
    const current = queue[head++];
    for (const neighbor of graph[current]) {
        if (distance[neighbor] === -1) {
            distance[neighbor] = distance[current] + 1;
            queue.push(neighbor);
        }
    }
}

// 出力
console.log(distance.slice(1).join('\n'));
