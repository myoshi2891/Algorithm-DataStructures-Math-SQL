function minTimeToReachRoomN(N, A, B) {
    let dp = new Array(N + 1).fill(Infinity);
    dp[1] = 0; // スタート地点

    for (let i = 2; i <= N; i++) {
        dp[i] = Math.min(dp[i], dp[i - 1] + A[i - 2]); // i-1 からの移動
        if (i > 2) {
            dp[i] = Math.min(dp[i], dp[i - 2] + B[i - 3]); // i-2 からの移動
        }
    }
    return dp[N];
}

const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
let lines = input.trim().split('\n');
let N = parseInt(lines[0]);
let A = lines[1].split(' ').map(Number);
let B = lines.length > 2 ? lines[2].split(' ').map(Number) : [];

console.log(minTimeToReachRoomN(N, A, B));
