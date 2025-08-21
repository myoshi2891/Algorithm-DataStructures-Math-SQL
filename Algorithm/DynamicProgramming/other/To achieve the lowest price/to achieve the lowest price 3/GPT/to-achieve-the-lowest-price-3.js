// Node.js v16.17.1
// 八百屋のりんご購入最適化問題
// 標準入力から n, x, a, y, b を受け取り、りんごを n 個以上手に入れる最小金額を計算する。
// 入力形式: n x a y b
//
// パラメータ
// n: number -> 必要なりんごの個数
// x: number -> パック1の個数
// a: number -> パック1の価格
// y: number -> パック2の個数
// b: number -> パック2の価格
//
// 戻り値
// number -> n個以上のりんごを手に入れるための最小金額
//
// 計算量: O(n + y) （最大2000程度なので十分高速）
// メモリ: O(n + y) （整数配列を1本持つだけ）

const fs = require('fs');

function minAppleCost(n, x, a, y, b) {
    // DP: dp[i] = i個のりんごを得るための最小コスト
    // サイズは n + max(x, y) まで確保して、n以上のケースも対応
    const maxApples = n + Math.max(x, y);
    const INF = Number.MAX_SAFE_INTEGER;
    const dp = new Array(maxApples + 1).fill(INF);
    dp[0] = 0;

    for (let i = 0; i <= maxApples; i++) {
        if (dp[i] === INF) continue;
        if (i + x <= maxApples) {
            dp[i + x] = Math.min(dp[i + x], dp[i] + a);
        }
        if (i + y <= maxApples) {
            dp[i + y] = Math.min(dp[i + y], dp[i] + b);
        }
    }

    // n個以上の中で最小のコストを探す
    let ans = INF;
    for (let i = n; i <= maxApples; i++) {
        ans = Math.min(ans, dp[i]);
    }
    return ans;
}

// 標準入力の処理
(function main() {
    const input = fs.readFileSync(0, 'utf8').trim().split(' ').map(Number);
    const [n, x, a, y, b] = input;
    const result = minAppleCost(n, x, a, y, b);
    console.log(result);
})();
