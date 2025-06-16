const fs = require('fs');

// 入力の読み取り
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = input[0].split(' ').map(Number);

// グラフの初期化（隣接リスト）
const graph = Array.from({ length: N + 1 }, () => []);

for (let i = 1; i <= M; i++) {
    const [a, b] = input[i].split(' ').map(Number);
    graph[a].push(b);
    graph[b].push(a); // 無向グラフなので両方向
}

// DFS を使って連結判定
const visited = Array(N + 1).fill(false);

function dfs(node) {
    visited[node] = true;
    for (const neighbor of graph[node]) {
        if (!visited[neighbor]) {
            dfs(neighbor);
        }
    }
}

// 頂点1から探索開始
dfs(1);

// 頂点1～N がすべて訪問されていれば連結
const isConnected = visited.slice(1).every((v) => v);

console.log(isConnected ? 'The graph is connected.' : 'The graph is not connected.');
