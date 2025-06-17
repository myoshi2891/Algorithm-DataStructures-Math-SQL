import * as fs from 'fs';

// 入力読み取り
const input = fs.readFileSync(0, 'utf-8').trim().split('\n');
const [N, M] = input[0].split(' ').map(Number);

// グラフ構築（隣接リスト）
const graph: number[][] = Array.from({ length: N + 1 }, () => []);
for (let i = 1; i <= M; i++) {
    const [a, b] = input[i].split(' ').map(Number);
    graph[a].push(b);
    graph[b].push(a); // 無向グラフなので両方向
}

// BFS 初期化
const dist: number[] = Array(N + 1).fill(-1);
dist[1] = 0;

const queue: number[] = [];
let head = 0;
queue.push(1);

// BFS 実行
while (head < queue.length) {
    const current = queue[head++];

    for (const neighbor of graph[current]) {
        if (dist[neighbor] === -1) {
            dist[neighbor] = dist[current] + 1;
            queue.push(neighbor);
        }
    }
}

// 出力
for (let i = 1; i <= N; i++) {
    console.log(dist[i]);
}
