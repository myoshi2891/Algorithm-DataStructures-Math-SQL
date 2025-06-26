import * as fs from 'fs';

function main(input: string): void {
    const lines = input.trim().split('\n');
    const [N, M] = lines[0].split(' ').map(Number);
    const A = lines[1].split(' ').map(Number);

    // 初期状態をビットで表現（0: OFF, 1: ON）
    let startState = 0;
    for (let i = 0; i < N; i++) {
        if (A[i] === 1) startState |= 1 << i;
    }

    // 目標状態（すべてON）
    const goalState = (1 << N) - 1;

    // 操作をビットマスクで表現
    const ops: number[] = [];
    for (let i = 0; i < M; i++) {
        const [x, y, z] = lines[2 + i].split(' ').map((n) => parseInt(n, 10) - 1); // 0-indexed
        const mask = (1 << x) | (1 << y) | (1 << z);
        ops.push(mask);
    }

    // BFSのための初期化
    const visited = new Array(1 << N).fill(false);
    const queue: [number, number][] = [[startState, 0]];
    visited[startState] = true;

    while (queue.length > 0) {
        const [state, steps] = queue.shift()!;

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

    // ゴールに到達できなかった
    console.log(-1);
}

// 標準入力の読み込みと実行
main(fs.readFileSync('/dev/stdin', 'utf8'));
