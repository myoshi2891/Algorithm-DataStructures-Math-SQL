import * as fs from 'fs';

// 入力読み取り
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = input[0].split(' ').map(Number);

// グラフ（隣接リスト）作成
const graph: number[][] = Array.from({ length: N + 1 }, () => []);
for (let i = 1; i <= M; i++) {
    const [a, b] = input[i].split(' ').map(Number);
    graph[a].push(b);
    graph[b].push(a); // 無向グラフなので両方向
}

// 訪問記録用
const visited: boolean[] = Array(N + 1).fill(false);

// 深さ優先探索（DFS）
function dfs(node: number): void {
    visited[node] = true;
    for (const neighbor of graph[node]) {
        if (!visited[neighbor]) {
            dfs(neighbor);
        }
    }
}

// 頂点1から探索開始
dfs(1);

// 訪問していないノードがあるか確認
const isConnected = visited.slice(1).every((v) => v);

// 出力
console.log(isConnected ? 'The graph is connected.' : 'The graph is not connected.');
