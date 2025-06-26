import * as fs from 'fs';

// 入力読み込み
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = input[0].split(' ').map(Number);

// グラフ構築
const graph: number[][] = Array.from({ length: N + 1 }, () => []);
const capacity: number[][] = Array.from({ length: N + 1 }, () => Array(N + 1).fill(0));

for (let i = 1; i <= M; i++) {
    const [a, b, c] = input[i].split(' ').map(Number);
    graph[a].push(b);
    graph[b].push(a); // 逆辺（残余グラフ）
    capacity[a][b] += c; // 同じ辺が複数来たら加算
}

// BFSで増加経路を探す
function bfs(level: number[], parent: number[], source: number, sink: number): boolean {
    level.fill(-1);
    level[source] = 0;

    const queue: number[] = [source];
    while (queue.length > 0) {
        const current = queue.shift()!;
        for (const next of graph[current]) {
            if (level[next] === -1 && capacity[current][next] > 0) {
                level[next] = level[current] + 1;
                parent[next] = current;
                if (next === sink) return true;
                queue.push(next);
            }
        }
    }
    return false;
}

// 最大流計算
function maxFlow(source: number, sink: number): number {
    let flow = 0;
    const parent = Array(N + 1).fill(-1);
    const level = Array(N + 1).fill(-1);

    while (bfs(level, parent, source, sink)) {
        // 最小容量を計算
        let pathFlow = Infinity;
        for (let v = sink; v !== source; v = parent[v]) {
            const u = parent[v];
            pathFlow = Math.min(pathFlow, capacity[u][v]);
        }

        // 残余容量更新（forward/backward）
        for (let v = sink; v !== source; v = parent[v]) {
            const u = parent[v];
            capacity[u][v] -= pathFlow;
            capacity[v][u] += pathFlow;
        }

        flow += pathFlow;
    }

    return flow;
}

// 実行
console.log(maxFlow(1, N));
