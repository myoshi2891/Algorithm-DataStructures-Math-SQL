const fs = require('fs');

// 入力の取得
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\n');
const N = Number(input[0]);
const PA = input.slice(1).map((line) => line.split(' ').map(Number));

// DPテーブルの初期化
const dp = Array.from({ length: N }, () => Array(N).fill(0));

// 区間 DP の計算
for (let width = 0; width < N; width++) {
    for (let left = 0; left + width < N; left++) {
        const right = left + width;

        // 左端を拡張する場合
        if (left > 0) {
            const [P, A] = PA[left - 1];
            const score = left <= P - 1 && P - 1 <= right ? A : 0;
            dp[left - 1][right] = Math.max(dp[left - 1][right], dp[left][right] + score);
        }

        // 右端を拡張する場合
        if (right < N - 1) {
            const [P, A] = PA[right + 1];
            const score = left <= P - 1 && P - 1 <= right ? A : 0;
            dp[left][right + 1] = Math.max(dp[left][right + 1], dp[left][right] + score);
        }
    }
}

// 最大スコアの出力
console.log(dp[0][N - 1]);
