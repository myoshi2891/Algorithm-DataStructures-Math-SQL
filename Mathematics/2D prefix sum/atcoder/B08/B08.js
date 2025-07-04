// JavaScript（Node.js）で効率的にこの問題を解く実装です。\*\*2次元累積和（2D prefix sum）\*\*を使うことで、各クエリに対して **O(1)** で解答でき、全体で高速に処理できます。

// ### ✅ 解法概要（2次元累積和）
// 1. **入力点をカウントしてグリッドにプロット**（最大1500×1500の2D配列）。
// 2. **2次元累積和テーブル（prefixSum）を構築**。
// 3. 各クエリごとに、**累積和を使って矩形領域内の点数を計算**。

// ### ✅ コード（`fs` 使用）
const fs = require('fs');

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
let idx = 0;

// N: 点の数
const N = parseInt(input[idx++]);
const gridSize = 1501;

// グリッド初期化
const grid = Array.from({ length: gridSize }, () => new Array(gridSize).fill(0));

// 点の入力
for (let i = 0; i < N; i++) {
  const [x, y] = input[idx++].split(' ').map(Number);
  grid[x][y]++;
}

// 2次元累積和を作成
const prefixSum = Array.from({ length: gridSize }, () => new Array(gridSize).fill(0));

for (let x = 1; x < gridSize; x++) {
  for (let y = 1; y < gridSize; y++) {
    prefixSum[x][y] =
      grid[x][y] +
      prefixSum[x - 1][y] +
      prefixSum[x][y - 1] -
      prefixSum[x - 1][y - 1];
  }
}

// Q: クエリ数
const Q = parseInt(input[idx++]);

// クエリ処理
const output = [];

for (let i = 0; i < Q; i++) {
  const [a, b, c, d] = input[idx++].split(' ').map(Number);

  const result =
    prefixSum[c][d] -
    prefixSum[a - 1][d] -
    prefixSum[c][b - 1] +
    prefixSum[a - 1][b - 1];

  output.push(result);
}

// 結果出力
console.log(output.join('\n'));
// ### ✅ 実行時間とメモリ
// * **実行時間**: 入力・累積和構築: `O(N + W * H)`、クエリ処理: `O(Q)`
// * **空間使用**: `O(W * H)` = `O(1500 × 1500)` ≒ 約 9MB（安全）

// ### ✅ 入力例
// ```bash
// $ echo "5
// 1 3
// 2 5
// 3 4
// 2 6
// 3 3
// 3
// 1 3 3 6
// 1 5 2 6
// 1 3 3 5" | node main.js
// ```

// ```
// 5
// 2
// 4
// ```
