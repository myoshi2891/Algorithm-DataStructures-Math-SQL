// **TypeScript** を用いて、実行時間・メモリ効率を考慮した解法です。
// **2次元累積和（2D prefix sum）** を活用して、各クエリを **O(1)** で処理します。

// ### ✅ TypeScript 実装（`fs` 使用）
import * as fs from 'fs';

// 標準入力の読み取り
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
let idx = 0;

const N = Number(input[idx++]);
const SIZE = 1501;

// 座標格子を0初期化（1501×1501）
const grid: number[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

// 点をgridに記録
for (let i = 0; i < N; i++) {
  const [x, y] = input[idx++].split(' ').map(Number);
  grid[x][y]++;
}

// 2次元累積和配列を構築
const prefixSum: number[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

for (let x = 1; x < SIZE; x++) {
  for (let y = 1; y < SIZE; y++) {
    prefixSum[x][y] =
      grid[x][y] +
      prefixSum[x - 1][y] +
      prefixSum[x][y - 1] -
      prefixSum[x - 1][y - 1];
  }
}

const Q = Number(input[idx++]);
const results: number[] = [];

for (let i = 0; i < Q; i++) {
  const [a, b, c, d] = input[idx++].split(' ').map(Number);

  const res =
    prefixSum[c][d] -
    prefixSum[a - 1][d] -
    prefixSum[c][b - 1] +
    prefixSum[a - 1][b - 1];

  results.push(res);
}

// 結果を標準出力
console.log(results.join('\n'));

// ### ✅ 計算量とメモリ

// | 処理     | 計算量                            | 詳細      |
// | ------ | ------------------------------ | ------- |
// | 座標登録   | O(N)                           | N = 10⁵ |
// | 累積和構築  | O(1500²)                       | 定数内に収まる |
// | 各クエリ処理 | O(1) × Q                       | Q = 10⁵ |
// | **合計** | ≈ 10⁵ + 2.25×10⁶ + 10⁵ = 数百万程度 |         |

// **メモリ使用量（最大）**
// `1501 x 1501 x 4バイト x 2配列 ≒ 約18MB` → 制限(1024MiB)の範囲内で問題なし。

// ---

// ### ✅ 実行例（入力）

// ```
// 5
// 1 3
// 2 5
// 3 4
// 2 6
// 3 3
// 3
// 1 3 3 6
// 1 5 2 6
// 1 3 3 5
// ```

// ### ✅ 出力例

// ```
// 5
// 2
// 4
// ```

// ---

// ### 🔍 補足（2D累積和の考え方）

// 与えられた矩形範囲 `[a, c] × [b, d]` の点の数を以下の式で求めます：

// ```ts
// prefixSum[c][d]
// - prefixSum[a-1][d]
// - prefixSum[c][b-1]
// + prefixSum[a-1][b-1]
// ```

// これは inclusion-exclusion によるもので、2D範囲の合計値を O(1) で取得できます。

