// 以下は、**JavaScript (Node.js)** を用いた解法です。高速なクエリ応答のために、配列 `A` を **ソートして二分探索**を使い、各 `X` に対して「未満の要素数」を効率よく求めます。

// ## ✅ 方針

// 1. **配列 A を昇順にソート**しておく（O(N log N)）。
// 2. 各クエリ `X` に対して **二分探索**で `A[i] < X` を満たす `i` の数を調べる（O(Q log N)）。
// 3. `fs` モジュールで高速入出力を行う。

// ## ✅ コード
const fs = require("fs");

// 高速入力
const input = fs.readFileSync("/dev/stdin", "utf8").trim().split(/\s+/);

let idx = 0;
const N = parseInt(input[idx++]);
const A = [];

for (let i = 0; i < N; i++) {
  A.push(parseInt(input[idx++]));
}

A.sort((a, b) => a - b); // 昇順ソート

const Q = parseInt(input[idx++]);
const results = [];

for (let q = 0; q < Q; q++) {
  const X = parseInt(input[idx++]);
  results.push(lowerBound(A, X)); // X 未満の個数
}

// 二分探索（lower_bound）：X より小さい要素数
function lowerBound(arr, target) {
  let left = 0;
  let right = arr.length;
  while (left < right) {
    const mid = (left + right) >> 1;
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}

// 出力（高速）
console.log(results.join("\n"));

// ## ✅ 処理時間・メモリの見積り

// * 時間計算量：

//   * `A` のソート：`O(N log N)`
//   * 各クエリに対して `O(log N)` → `Q log N`
//   * 合計：`O(N log N + Q log N)` → 最大で約 `2×10^6` 回程度の操作 → 十分高速（1 秒以内）

// * 空間計算量：

//   * `A` 配列と `results` の保存 → O(N + Q) 要素 → 約 800KB〜1MB 程度
//   * メモリ制限（1024MiB）以内に収まる

// ---

// ## ✅ 入力例 1 の実行結果

// 入力:

// ```
// 15
// 83 31 11 17 32 19 23 37 43 47 53 61 67 5 55
// 5
// 10
// 20
// 30
// 40
// 50
// ```

// 出力:

// ```
// 1
// 4
// 5
// 8
// 10
// ```
