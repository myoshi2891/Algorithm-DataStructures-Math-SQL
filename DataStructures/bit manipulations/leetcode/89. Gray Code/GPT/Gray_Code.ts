// ## 1. 問題の分析

// ### 競技プログラミング視点での分析

// * 生成サイズは **M = 2^n**。隣接（末尾と先頭を含む）でちょうど 1bit 差の巡回列が必要。
// * 最速は **公式な Gray 変換**：`G(i) = i ^ (i >> 1)` を `i=0..M-1` に適用。

//   * 一回のループで生成 → **時間 O(M)**、追加メモリ O(1)（結果配列は不可避）。
// * bit 演算は 32bit 整数として実行されるが、`n ≤ 16` なら安全領域。

// ### 業務開発視点での分析

// * **型安全性**：`n` は整数・範囲 `[1, 16]` を満たす前提だが、防御的に実行時ガードを実装。
// * **可読性/保守性**：純関数 `grayCode(n)` に集約し、前処理・本処理を簡潔化。
// * **エラーハンドリング**：

//   * `TypeError` … 整数でない/有限でない
//   * `RangeError` … 範囲外（[1,16]）
//     ※ LeetCode 入力は制約内だが、実務品質として付与。

// ### TypeScript特有の考慮点

// * **型推論**：`const M = 1 << n` と `new Array<number>(M)` で number 単型を維持。
// * **strict mode** 前提：実行時チェックで未定義動作を予防。
// * **readonly** は今回は不要（結果配列を逐次代入で埋めるため）。
// * **コンパイル時最適化**：単純な for ループと数値のみの配列で JIT に優しい形状を維持。

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ                   | 時間計算量       | 空間計算量                       | TS実装コスト | 型安全性 | 可読性 | 備考                 |
// | ----------------------- | ----------- | --------------------------- | ------- | ---- | --- | ------------------ |
// | 方法A：`i ^ (i >> 1)` 直接生成 | **O(2^n)**  | **O(2^n)**（出力）/ **O(1)** 追加 | 低       | 高    | 高   | 最短・最小追加メモリ、実装が最も簡潔 |
// | 方法B：反射（鏡映）法             | O(2^n)      | O(2^n)                      | 中       | 高    | 中   | 段階的に反転コピー＋上位bit付与  |
// | 方法C：DFS バックトラック         | O(2^n·n) 以上 | O(2^n)                      | 低       | 中    | 低   | 制約満たすが最悪遅い、実利に乏しい  |

// ---

// ## 3. 実装方針

// * **選択したアプローチ**：方法A（`G(i) = i ^ (i >> 1)`）
// * **理由**：

//   * **計算量**が最良（単一ループ O(2^n)）
//   * **追加メモリ O(1)**（結果配列以外の一時領域を作らない）
//   * 実装が短く、**バグ混入率が低い**／可読性が高い
// * **TypeScript特有の最適化ポイント**：

//   * 実行時ガードで**型レベルの前提を強化**（整数/範囲チェック）
//   * `new Array<number>(M)` で **単型配列**を維持（JIT/GCに有利）
//   * 高階関数不使用（**for ループ**に限定）で割当コスト削減

// ---

// ## 4. 実装コード（LeetCode 提出想定：ESM/副作用なし/Pure）

// ```ts
/**
 * Return any valid n-bit Gray code sequence of length 2^n.
 * Implements the standard formula: G(i) = i ^ (i >> 1).
 *
 * Constraints: 1 <= n <= 16
 *
 * @param {number} n - Number of bits.
 * @returns {number[]} Gray code sequence (length = 2^n), starting with 0.
 * @throws {TypeError}  If n is not a finite integer.
 * @throws {RangeError} If n is not in [1, 16].
 * @complexity Time: O(2^n) | Space: O(2^n) (output) / O(1) auxiliary
 */
function grayCode(n: number): number[] {
    // --- Runtime validation (defensive; LeetCode入力は制約内想定) ---
    if (!Number.isFinite(n) || Math.trunc(n) !== n) {
        throw new TypeError('n must be a finite integer');
    }
    if (n < 1 || n > 16) {
        throw new RangeError('n must be in [1, 16]');
    }

    // Precompute size and preallocate result array (number-typed, fixed length)
    const M = 1 << n; // safe for n <= 16 (max 65536)
    const res = new Array<number>(M);

    // Single pass generation: G(i) = i ^ (i >> 1)
    for (let i = 0; i < M; i++) {
        // >>> 1 は符号なし右シフトでも良いが、ここでは >> 1 で十分（32bit域）
        // >>> 0 を通せば常に非負の 32bit 整数になる（好みで使用可）。
        res[i] = (i ^ (i >> 1)) >>> 0;
    }

    return res;
}
// ```

// > 補足：LeetCode の TypeScript では **関数定義のみ**が提出対象です（`export`/`import`は通常不要）。ESM 方針はローカル実行方針の明示であり、提出コード自体は関数のままで問題ありません。

// ---

// ## TypeScript 固有の最適化観点（チェックリスト）

// * **strict mode** 前提（`tsconfig.json` で `"strict": true`）
// * **数値単型配列**を維持（`new Array<number>(M)` + 逐次代入）
// * **for ループ**を使用（`map/forEach` のコールバック割当を避ける）
// * **一時オブジェクト生成なし**（GC圧を抑制）
// * **実行時ガード**で未定義挙動を遮断（整数・範囲）
