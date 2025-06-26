import * as fs from 'fs';

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const N = Number(input[0]);
const C = input.slice(1);

const adj: number[][] = Array.from({ length: N }, () => []);
for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
        if (C[i][j] === '#') adj[i].push(j);
    }
}

const matchTo: number[] = Array(N).fill(-1);
const visited: boolean[] = Array(N).fill(false);

function dfs(u: number): boolean {
    for (const v of adj[u]) {
        if (visited[v]) continue;
        visited[v] = true;
        if (matchTo[v] === -1 || dfs(matchTo[v])) {
            matchTo[v] = u;
            return true;
        }
    }
    return false;
}

let result = 0;
for (let i = 0; i < N; i++) {
    visited.fill(false);
    if (dfs(i)) result++;
}

console.log(result);
