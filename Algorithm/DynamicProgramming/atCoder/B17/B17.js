
// * `fs` を使って標準入力を読み込み、
// * 最小コスト経路の復元付きで出力し、
// * 実行時間・メモリ効率に注意した構成です。

// ---

// ### ✅ コード（`index.js`）

// ```javascript
const fs = require("fs");

const input = fs.readFileSync("/dev/stdin", "utf8").trim().split("\n");
const N = parseInt(input[0]);
const h = input[1].split(" ").map(Number);

const dp = new Array(N).fill(Infinity);
const prev = new Array(N).fill(-1);

// 初期化
dp[0] = 0;

for (let i = 1; i < N; i++) {
  const cost1 = dp[i - 1] + Math.abs(h[i] - h[i - 1]);
  if (cost1 < dp[i]) {
    dp[i] = cost1;
    prev[i] = i - 1;
  }
  if (i > 1) {
    const cost2 = dp[i - 2] + Math.abs(h[i] - h[i - 2]);
    if (cost2 < dp[i]) {
      dp[i] = cost2;
      prev[i] = i - 2;
    }
  }
}

// 経路復元
const path = [];
let current = N - 1;
while (current !== -1) {
  path.push(current + 1); // 足場番号に変換（1-indexed）
  current = prev[current];
}
path.reverse();

// 出力
console.log(path.length);
console.log(path.join(" "));

// ### 💡 解説

// * `dp[i]`: 足場 `i+1` に到達する最小コスト。
// * `prev[i]`: 最小コストで `i` に来たときの直前の足場インデックス。
// * 計算量：`O(N)`
// * メモリ：`O(N)`（配列2本）

// ---

// ### 🧪 入力例1の動作確認

// 入力:

// ```
// 4
// 10 30 40 20
// ```

// 出力（例の1つ）:

// ```
// 3
// 1 2 4
// ```

// ---

// ### ⏱️ 実行時間・メモリ効率

// * `N = 100000` でも高速（`O(N)`）
// * 使用メモリ：`~1MB`程度（`dp`, `prev` 各100,000）

// ---
