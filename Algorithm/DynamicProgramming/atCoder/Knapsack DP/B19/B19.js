// 以下は、Node.js 18.16.1 環境で `fs` モジュールを使って解く、\*\*「Knapsack 2（DP with value）」\*\*問題の解法です。

// この問題では `W ≤ 10^9` と非常に大きいので、「重さ」を軸にしたDPではメモリが足りません。代わりに **価値を軸にしたDP（value-based DP）** を使います。

// ---

// ### ✅ 解法の概要（価値DP）

// * `dp[v] = w`: 価値の合計が `v` のときの最小重さ `w`
// * 初期値: `dp[0] = 0`, それ以外は `Infinity`
// * 全ての品物に対して `dp` を更新
// * 最終的に、`dp[v] <= W` となる最大の `v` を答えとする

// ---

// ### ✅ 実装（コメント付き、`fs`使用）

// ```javascript
// Node.js (v18.16.1) 用
const fs = require('fs');

// 入力の読み取り
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, W] = input[0].split(' ').map(Number);
const items = input.slice(1).map((line) => {
    const [w, v] = line.split(' ').map(Number);
    return { w, v };
});

// 最大価値の合計（各価値最大1000 × N）
const maxValue = items.reduce((sum, item) => sum + item.v, 0);

// dp[v] := 価値の合計がvのときの最小重量（初期はInfinity）
const dp = new Array(maxValue + 1).fill(Infinity);
dp[0] = 0; // 価値0のときの重量は0

// 品物を1つずつ見てDPを更新
for (let i = 0; i < N; i++) {
    const { w, v } = items[i];

    // 逆順に更新することで「1つの品物を1回だけ使う」制約を守る
    for (let value = maxValue; value >= v; value--) {
        if (dp[value - v] + w <= W) {
            dp[value] = Math.min(dp[value], dp[value - v] + w);
        }
    }
}

// dp[v] <= W を満たす最大の v を探す
let result = 0;
for (let v = 0; v <= maxValue; v++) {
    if (dp[v] <= W) {
        result = v;
    }
}

console.log(result);

/*
返却値: console.log(result)
 - 条件を満たす中で最大の価値合計 v を出力します。
 - 計算量: O(N * maxValue) ≈ 100 × 100000 = 1e7（制限内）
 - メモリ: 約 maxValue 分（数MB程度）
*/

// ### ✅ 実行時間・メモリ見積り

// * **計算量**: `O(N * sum_v)` = `100 × 100000` = `1e7`（高速）
// * **メモリ使用量**: `dp[]` = 約 `100001 × 4bytes` ≒ 約400KB（問題の上限1GBの範囲内）

// ### ✅ 備考

// * 「Wが大きすぎる」＝重さでDP配列を作るのは不適
// * 品物の**価値を基準**にDPするのが典型解
// * `O(N×価値合計)` なので、今回のように **価値 ≤ 1000 × N** のとき有効
