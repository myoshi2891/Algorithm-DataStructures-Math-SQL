// # 1. 問題の分析

// ## 競技プログラミング視点での分析

// * 生成すべき配列長は **M = 2^n**。各連続要素（最後と最初を含む）が **1bit** だけ異なる巡回列（Gray code）。
// * 代表解は **i ⊕ (i >> 1)** により `i=0..M-1` を一発生成（辞書式 Gray code）。
//   これで隣接ペアは常に 1bit 差となり、先頭 0 と末尾も 1bit 差を満たす。

// ## 業務開発視点での分析

// * **保守性/可読性**：`grayCode(n)` という単機能・副作用なしの純関数に集約。
// * **例外方針**：`TypeError`（非整数/非数）、`RangeError`（制約 1 ≤ n ≤ 16 を外れる）を早期に投げる。
// * **命名**：`M` を総要素数、`res` を結果配列として固定。コメントは最小限かつ要点のみ。

// ## JavaScript特有の考慮点

// * **V8最適化**：

//   * 配列を **事前確保（new Array(M))** → pushの形状変化を避け hidden class を安定化。
//   * 単純な `for` ループ（クロージャ/高階関数の割当コストを回避）。
// * **GC対策**：一時オブジェクト生成なし。数値のみの単型配列を維持。
// * **bit演算**：`n ≤ 16` なので `1 << n` は安全（32bit 範囲内）。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                      | 時間計算量     | 空間計算量    | JS実装コスト | 可読性 | 備考                              |
// | -------------------------- | --------- | -------- | ------- | --- | ------------------------------- |
// | 方法A：ビット式 `i ^ (i>>1)` 直接生成 | **O(M)**  | **O(M)** | 低       | 中   | 最速・最小メモリ（必要配列のみ）。隣接1bit差を自明に満たす |
// | 方法B：反転鏡映法（反射して上位bit付与）     | O(M)      | O(M)     | 中       | 高   | 各段で既列を反転コピーし上位bitセット            |
// | 方法C：バックトラック（1bit差制約でDFS）   | O(M·n) 以上 | O(M)     | 低       | 低   | 実装は簡単だが最悪遅い、枝刈りが必要              |

// ※ M = 2^n

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**：方法A（ビット式 `i ^ (i>>1)`）
// * **理由**：

//   * **計算量**：単一ループ **O(M)** で最短。
//   * **メモリ**：結果配列のみ **O(M)**。
//   * **実装効率**：一行で Gray 値が得られ、V8 に優しい単純 for＋事前確保。
// * **JS特有の最適化ポイント**：

//   * `const M = 1 << n; const res = new Array(M);` で固定長・単型を維持。
//   * ホットパス外で入力検証を完了し、ループは純粋算術のみ。

// ---

// # 4. コード実装（solution.js）

// ```js
"use strict";

/**
 * Generate n-bit Gray code sequence.
 * Pure function: no side effects.
 *
 * @param {number} n - Number of bits (integer in [1, 16]).
 * @returns {number[]} Gray code sequence of length 2^n.
 * @throws {TypeError}  If n is not a finite integer.
 * @throws {RangeError} If n is out of allowed range [1, 16].
 *
 * @description
 * Constructs Gray codes via the standard formula: G(i) = i ^ (i >> 1),
 * for i = 0..(2^n - 1).
 *
 * @complexity Time O(2^n), Space O(2^n)
 */
function grayCode(n) {
  // --- Input validation (fast fail, outside of hot path) ---
  if (typeof n !== "number" || !Number.isFinite(n) || (n | 0) !== n) {
    throw new TypeError("n must be a finite integer");
  }
  if (n < 1 || n > 16) {
    throw new RangeError("n must be in [1, 16]");
  }

  // --- Precompute size and preallocate result array ---
  const M = 1 << n; // safe for n <= 16 (<= 65536)
  const res = new Array(M);

  // --- Single pass: Gray value via i ^ (i >> 1) ---
  for (let i = 0; i < M; i++) {
    res[i] = (i ^ (i >>> 1)) >>> 0; // >>>0 to keep unsigned 32-bit (not required, but stable)
  }

  return res;
}

module.exports = { grayCode };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ループは **for** を使用（`map/forEach` は避ける）。
// * 配列は **事前確保**＋**単型（number のみ）** を維持。
// * 一時オブジェクトやクロージャを作らない。
// * 例外系はホットパス外で早期チェック。
// * bit演算は 32bit 整数に収まる範囲で実施（本件は `n ≤ 16` で安全）。
