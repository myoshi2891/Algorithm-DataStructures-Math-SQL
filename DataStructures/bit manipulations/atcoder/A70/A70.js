const fs = require('fs');

function main(input) {
    const lines = input.trim().split('\n');
    const [N, M] = lines[0].split(' ').map(Number);
    const A = lines[1].split(' ').map(Number);

    // 初期状態をビットで表現
    let startState = 0;
    for (let i = 0; i < N; i++) {
        if (A[i] === 1) startState |= 1 << i;
    }

    // 目標状態（すべてON）
    const goalState = (1 << N) - 1;

    // 各操作をビットマスクに変換
    const ops = [];
    for (let i = 0; i < M; i++) {
        const [x, y, z] = lines[2 + i].split(' ').map((n) => parseInt(n) - 1); // 0-indexed
        let mask = (1 << x) | (1 << y) | (1 << z);
        ops.push(mask);
    }

    // BFS
    const visited = new Array(1 << N).fill(false);
    const queue = [[startState, 0]];
    visited[startState] = true;

    while (queue.length > 0) {
        const [state, steps] = queue.shift();

        if (state === goalState) {
            console.log(steps);
            return;
        }

        for (const op of ops) {
            const nextState = state ^ op;
            if (!visited[nextState]) {
                visited[nextState] = true;
                queue.push([nextState, steps + 1]);
            }
        }
    }

    // 到達不能
    console.log(-1);
}

// ファイル入力処理
main(fs.readFileSync('/dev/stdin', 'utf8'));
