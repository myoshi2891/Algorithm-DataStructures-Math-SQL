// 1. 問題の分析
//    **競技プログラミング視点**

// * 各行を「ヒストグラムの高さ配列」に変換し、各行ごとに「Largest Rectangle in Histogram（単調増加スタック）」で最大長方形を求めるのが最速（O(R*C)）。
// * 行ごとに高さ配列を上書き更新すれば追加メモリは O(C) に抑えられる。

// **業務開発視点**

// * 関数を `maximalRectangle`（純粋関数）に集約し、ヒストグラム計算部分をローカル関数で分離して保守性を確保。
// * 例外は早期バリデーションで `TypeError` / `RangeError` を明確に投げる。

// **JavaScript特有の考慮点**

// * V8向けに数値単型配列（`heights`）を固定長で再利用、`for` ループ主体で実装。
// * スタックは単一 `Array<number>` を使い `push/pop` のみ（`shift/unshift` は使わない）。
// * 使い捨てオブジェクトを作らず、クロージャも最小限（ローカル関数1つ）。

// ---

// 2. アルゴリズムアプローチ比較

// | アプローチ                        | 時間計算量           | 空間計算量  | JS実装コスト | 可読性 | 備考            |
// | ---------------------------- | --------------- | ------ | ------- | --- | ------------- |
// | 方法A（採用）: 行ごとのヒストグラム + 単調スタック | O(R*C)          | O(C)   | 低       | 中   | 最速・定番、V8フレンドリ |
// | 方法B: 各セルから拡張（DPで左右境界＋高さ）     | O(R*C)          | O(R*C) | 中       | 中   | 実装長め・メモリ多め    |
// | 方法C: 各セルを起点に幅/高さを全探索         | O(R*C*min(R,C)) | O(1)   | 低       | 高   | 小規模のみ妥当       |

// ---

// 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（行ごとのヒストグラム + 単調増加スタック）
// * **理由**: 制約最大（200×200）に対し余裕の O(R*C)・追加メモリ O(C)。実装が短くバグが少ない。
// * **JS最適化ポイント**:

//   * `for (let i=0; i<n; i++)` のインデックス走査。
//   * `heights` と `stack` を再利用して GC 圧を軽減。
//   * センチネル値は配列末尾を走査時に `j===cols?0:heights[j]` で擬似化し、余計な配列連結を回避。

// ---

// 4. コード実装（solution.js）

// ```javascript
"use strict";
// Module: CommonJS（ローカル実行・CI想定）
// 外部ライブラリ: 不使用（Node標準のみ）

/**
 * Maximal Rectangle - LeetCode 85（純粋関数）
 * 与えられた '0'/'1' 文字からなる行列において、1のみから成る最大長方形の面積を返す。
 *
 * @param {string[][]} matrix - R x C の2次元配列。各要素は '0' または '1'（文字）。
 * @returns {number} 面積（最大長方形のセル数）
 * @throws {TypeError} 行列/要素の型が不正な場合
 * @throws {RangeError} 行数/列数が制約 (1..200) を外れる場合、または列長が不揃いの場合
 *
 * @complexity Time O(R*C), Space O(C)
 */
function maximalRectangle(matrix) {
  // ========= 入力検証（軽量＆早期） =========
  if (!Array.isArray(matrix)) {
    throw new TypeError("matrix must be a 2D array");
  }
  const rows = matrix.length;
  if (!(rows >= 1 && rows <= 200)) {
    throw new RangeError("rows must be within [1, 200]");
  }
  if (!Array.isArray(matrix[0])) {
    throw new TypeError("matrix must be a 2D array (array of arrays)");
  }
  const cols = matrix[0].length;
  if (!(cols >= 1 && cols <= 200)) {
    throw new RangeError("cols must be within [1, 200]");
  }
  // 列長・要素型の検証
  for (let i = 0; i < rows; i++) {
    const row = matrix[i];
    if (!Array.isArray(row) || row.length !== cols) {
      throw new RangeError("All rows must be arrays of identical length");
    }
    for (let j = 0; j < cols; j++) {
      const v = row[j];
      // 問題の仕様に合わせ '0' / '1' のみを受け付ける（堅牢性のため明示チェック）
      if (typeof v !== "string" || (v !== "0" && v !== "1")) {
        throw new TypeError("matrix[i][j] must be '0' or '1' (string)");
      }
    }
  }

  // ========= 本処理 =========
  // heights[j]: 現在の行を底とした、列jの連続1の高さ
  const heights = new Array(cols).fill(0);
  const stack = new Array(cols); // 単調増加スタック（index格納）: 再利用してGC削減
  let maxArea = 0;

  // ヒストグラムの最大長方形を O(C) で求めるローカル関数
  /**
   * @param {number[]} h - 長さcolsの非負整数配列
   * @returns {number} - 最大長方形
   */
  function largestRectangleInHistogram(h) {
    let top = -1; // stack の top を手動管理（高速化）
    let best = 0;

    // j===cols のとき高さ0のセンチネルとして処理
    for (let j = 0; j <= cols; j++) {
      const cur = j === cols ? 0 : h[j];
      // 現在高さがスタック上端より小さければ確定計算
      while (top >= 0 && cur < h[stack[top]]) {
        const height = h[stack[top--]];
        const leftLessIndex = top >= 0 ? stack[top] : -1;
        const width = j - leftLessIndex - 1;
        const area = height * width;
        if (area > best) best = area;
      }
      // 単調性を保つように現在位置を積む
      stack[++top] = j;
    }
    return best;
  }

  // 各行を底にしてヒストグラム更新 → 面積更新
  for (let i = 0; i < rows; i++) {
    const row = matrix[i];
    for (let j = 0; j < cols; j++) {
      // '1' なら高さ+1、'0' ならリセット
      heights[j] = row[j] === "1" ? heights[j] + 1 : 0;
    }
    const area = largestRectangleInHistogram(heights);
    if (area > maxArea) maxArea = area;
  }

  return maxArea;
}

module.exports = maximalRectangle;

// ローカル実行（任意）: `node solution.js` で簡易デモ
if (require.main === module) {
  const demo = [
    ["1", "0", "1", "0", "0"],
    ["1", "0", "1", "1", "1"],
    ["1", "1", "1", "1", "1"],
    ["1", "0", "0", "1", "0"],
  ];
  console.log(maximalRectangle(demo)); // 6
}
// ```

// ---

// 5. 追加メモ（JS最適化チェックリスト）

// * ループは `for` 基本。`forEach/map` は未使用。
// * 一時配列は `heights` と `stack` のみで再利用。
// * 配列は単型（数値）を維持、hidden class を安定化。
// * 例外はホットパス外（先頭の入力検証）で早期に投げる。
// * センチネル用に配列拡張せず、ループ境界で `0` を擬似挿入。
// * 関数分割は最小限（主要ロジックはローカル関数1つ）でインライン展開に近い形。
