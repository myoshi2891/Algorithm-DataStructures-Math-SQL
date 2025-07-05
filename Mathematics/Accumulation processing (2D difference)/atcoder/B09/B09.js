// この問題は **2D平面上の重なりを考慮した長方形の面積の合計** を求めるものです。
// 制約より、`x` および `y` 座標は `0 ≤ A_i, B_i < C_i, D_i ≤ 1500` の範囲に収まるため、\*\*1501×1501の2次元グリッドを用いた累積処理（2D差分）\*\*で高速に処理できます。

// ### ✅ 解法方針（2D差分 + 累積和）:

// 1. 長方形 `(A,B)-(C,D)` をグリッド上に差分配列として記録。
// 2. 最後に累積和を取って、1以上の値が存在するセルをカウント。
// 3. これにより、重なりを重複カウントせず、正確に面積を求められる。

// ### ✅ JavaScript（Node.js + `fs`）実装:
const fs = require("fs");

const input = fs.readFileSync("/dev/stdin", "utf8").trim().split("\n");
const N = parseInt(input[0]);
const gridSize = 1502; // 0-indexedで最大1501まで扱えるように

// 2D差分用グリッド
const grid = Array.from({ length: gridSize }, () => new Int16Array(gridSize));

// 差分を記録
for (let i = 1; i <= N; i++) {
  const [a, b, c, d] = input[i].split(" ").map(Number);
  grid[a][b] += 1;
  grid[c][b] -= 1;
  grid[a][d] -= 1;
  grid[c][d] += 1;
}

// 横方向に累積和
for (let x = 0; x < gridSize; x++) {
  for (let y = 1; y < gridSize; y++) {
    grid[x][y] += grid[x][y - 1];
  }
}

// 縦方向に累積和
for (let y = 0; y < gridSize; y++) {
  for (let x = 1; x < gridSize; x++) {
    grid[x][y] += grid[x - 1][y];
  }
}

// 面積（1以上のセル数）をカウント
let area = 0;
for (let x = 0; x < 1501; x++) {
  for (let y = 0; y < 1501; y++) {
    if (grid[x][y] > 0) area++;
  }
}

console.log(area);

// ### ✅ 実行時間・メモリ使用量の目安

// * **実行時間**: `O(N + H×W)`（≒ 1e5 + 1500×1500 = 約2.3e6） → 非常に高速
// * **メモリ**: 約 `1500 x 1500 x 2byte` = 約 4.5MB → メモリ制限 1024MB に対して余裕あり

// ---

// ### ✅ 入力例テスト

// **入力**

// ```
// 2
// 1 1 3 3
// 2 2 4 4
// ```

// **出力**

// ```
// 7
// ```

// ### ✅ ポイント

// * `Int16Array` 使用でメモリ効率向上
// * 差分更新 → 累積和の2段階処理で高速に重なり面積を正確カウント
