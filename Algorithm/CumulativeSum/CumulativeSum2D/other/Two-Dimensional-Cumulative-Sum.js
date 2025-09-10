// ## 1. 問題

// * 行列サイズ `N × M` の整数行列 `A` が与えられる。
// * `Q` 個のクエリ `(a_i, b_i, c_i, d_i)` が与えられる。
// * 各クエリごとに、長方形領域

//   ```
//   A[a_i..c_i][b_i..d_i]
//   ```

//   内の要素の総和を求めよ。
// * 制約:

//   * `1 ≤ N, M, Q ≤ 10`
//   * `1 ≤ A[i][j] ≤ 100`
//   * `0 ≤ a_i ≤ c_i < N`
//   * `0 ≤ b_i ≤ d_i < M`

// ---

// ## 2. 解析

// ### 2.1 競技プログラミング視点

// * 制約が非常に小さい (`N, M, Q ≤ 10`) → 愚直解法 O(QNM) でも十分通る。
// * しかし「累積和を用いて」と明記されているので **2D累積和 (prefix sum)** が正攻法。
// * 前計算 O(NM)、クエリごと O(1)、合計 O(NM + Q)。

// ### 2.2 業務開発視点

// * 累積和構築を関数化して再利用性を高める。
// * 入力検証を実施（負の添字・範囲外クエリを防ぐ）。
// * 可読性を意識し、数式をコメントで説明。

// ### 2.3 JavaScript特有の考慮

// * V8 の hidden class 崩壊を防ぐため、2D配列は固定長で確保。
// * `Array.from` + `fill` + `map` を活用。
// * 小規模なので GC の影響は無視できる。

// ---

// ## 3. アルゴリズム比較

// | アプローチ             | 時間計算量      | 空間計算量 | JS実装コスト | 可読性 | 備考      |
// | ----------------- | ---------- | ----- | ------- | --- | ------- |
// | クエリごとに二重ループ       | O(QNM)     | O(1)  | 低       | 高   | 制約小なら通る |
// | 行ごとの累積和           | O(NM + NQ) | O(NM) | 中       | 中   | 実装少し簡単  |
// | 2D累積和（prefix sum） | O(NM + Q)  | O(NM) | 中       | 中   | 最速・汎用性  |

// ---

// ## 4. 採用方針

// * **選択したアプローチ**: 2D累積和（prefix sum）
// * **理由**: 明示的に「累積和を用いる」と条件がある。高速で拡張性が高い。
// * **JS特有の最適化ポイント**: 配列を固定長で確保し、オブジェクトより数値配列で計算。

// ---

// ## 5. コード実装（solution.js）

// ```js
const fs = require("fs");
const input = fs.readFileSync("/dev/stdin", "utf8").trim();

/**
 * 長方形領域の和を2D累積和で求める
 *
 * @param {number[][]} matrix - N×M 行列
 * @param {Array<[number, number, number, number]>} queries - クエリ配列 (a,b,c,d)
 * @returns {number[]} - 各クエリの結果
 *
 * @throws {TypeError} - 入力が不正な場合
 * @throws {RangeError} - クエリが範囲外の場合
 *
 * @complexity O(NM + Q) （累積和構築 O(NM)、クエリ処理 O(1)）
 */
function rectangleSum(matrix, queries) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new TypeError("matrix must be a non-empty 2D array");
  }
  const N = matrix.length;
  const M = matrix[0].length;
  if (!matrix.every((row) => Array.isArray(row) && row.length === M)) {
    throw new TypeError("matrix must be rectangular");
  }
  if (!Array.isArray(queries)) {
    throw new TypeError("queries must be an array");
  }

  // 2D累積和構築 (N+1)×(M+1)
  const prefix = Array.from({ length: N + 1 }, () => new Array(M + 1).fill(0));
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      prefix[i + 1][j + 1] =
        matrix[i][j] + prefix[i][j + 1] + prefix[i + 1][j] - prefix[i][j];
    }
  }

  // クエリ処理
  const results = [];
  for (const [a, b, c, d] of queries) {
    if (a < 0 || b < 0 || c >= N || d >= M || a > c || b > d) {
      throw new RangeError("query indices out of range");
    }
    const sum =
      prefix[c + 1][d + 1] - prefix[a][d + 1] - prefix[c + 1][b] + prefix[a][b];
    results.push(sum);
  }
  return results;
}

// ---- 入出力処理 ----
(function main() {
  const lines = input
    .split("\n")
    .filter(Boolean)
    .map((l) => l.trim());
  const [N, M, Q] = lines[0].split(" ").map(Number);

  const matrix = [];
  for (let i = 0; i < N; i++) {
    matrix.push(lines[1 + i].split(" ").map(Number));
  }

  const queries = [];
  for (let i = 0; i < Q; i++) {
    queries.push(lines[1 + N + i].split(" ").map(Number));
  }

  const results = rectangleSum(matrix, queries);
  console.log(results.join("\n"));
})();

module.exports = { rectangleSum };
// ```

// ---

// ✅ これで **`node solution.js < input.txt`** でそのまま実行可能です。
// 関数部分は副作用なしの Pure Function で、テスト時にも直接利用できます。
