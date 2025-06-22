const fs = require('fs');

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = input[0].split(' ').map(Number);

const graph = Array.from({ length: N + 1 }, () => []); // 隣接リスト
const capacity = Array.from({ length: N + 1 }, () => Array(N + 1).fill(0));

// グラフ構築
for (let i = 1; i <= M; i++) {
    const [a, b, c] = input[i].split(' ').map(Number);
    graph[a].push(b);
    graph[b].push(a); // 逆辺も必要（残余グラフ）
    capacity[a][b] += c;
}

function bfs(level, parent, source, sink) {
    level.fill(-1);
    level[source] = 0;
    const queue = [source];

    while (queue.length > 0) {
        const current = queue.shift();

        for (const next of graph[current]) {
            if (level[next] === -1 && capacity[current][next] > 0) {
                level[next] = level[current] + 1;
                parent[next] = current;
                queue.push(next);
                if (next === sink) return true;
            }
        }
    }
    return false;
}

function maxFlow(source, sink) {
    let flow = 0;
    const parent = Array(N + 1);
    const level = Array(N + 1);

    while (bfs(level, parent, source, sink)) {
        // 最小容量を見つける
        let pathFlow = Infinity;
        let v = sink;
        while (v !== source) {
            const u = parent[v];
            pathFlow = Math.min(pathFlow, capacity[u][v]);
            v = u;
        }

        // 容量を減らす・増やす（残余グラフ更新）
        v = sink;
        while (v !== source) {
            const u = parent[v];
            capacity[u][v] -= pathFlow;
            capacity[v][u] += pathFlow;
            v = u;
        }

        flow += pathFlow;
    }

    return flow;
}

console.log(maxFlow(1, N));
