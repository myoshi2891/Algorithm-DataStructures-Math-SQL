function shortestPath(N, A, B) {
    // dp配列の初期化 (十分大きな値で初期化)
    let dp = Array(N + 1).fill(Infinity);
    let prev = Array(N + 1).fill(-1); // 経路復元用

    // 初期状態
    dp[1] = 0;

    // DP配列を埋める
    for (let i = 2; i <= N; i++) {
        if (dp[i] > dp[i - 1] + A[i - 2]) {
            dp[i] = dp[i - 1] + A[i - 2];
            prev[i] = i - 1;
        }
        if (i >= 3 && dp[i] > dp[i - 2] + B[i - 3]) {
            dp[i] = dp[i - 2] + B[i - 3];
            prev[i] = i - 2;
        }
    }

    // 経路復元
    let path = [];
    for (let i = N; i !== -1; i = prev[i]) {
        path.push(i);
    }
    path.reverse();

    // 出力
    console.log(path.length);
    console.log(path.join(' '));
}

// 標準入力の処理
const fs = require('fs');

const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();

let lines = input.trim().split('\n');
let N = parseInt(lines[0], 10);
let A = lines[1].split(' ').map(Number);
let B = lines[2].split(' ').map(Number);

shortestPath(N, A, B);
