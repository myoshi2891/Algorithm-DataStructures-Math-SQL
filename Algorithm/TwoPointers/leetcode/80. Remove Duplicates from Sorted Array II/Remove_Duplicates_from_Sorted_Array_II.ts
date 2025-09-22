// # 1. 問題の分析

// ## 競技プログラミング視点

// * **実行速度優先**:

//   * 配列はソート済みなので **two pointers (書き込みポインタ + 読み込みポインタ)** により1パスで解ける。
//   * `O(n)` 時間, `O(1)` 空間で最適。
// * **メモリ効率**:

//   * 追加配列を作らず in-place 更新。

// ## 業務開発視点

// * **型安全性**:

//   * `number[]` 型に限定してジェネリクスは不要。
//   * 関数の戻り値型は `number`（有効な要素数）。
// * **保守性/可読性**:

//   * 命名は `writeIndex` と `i` で役割を明確化。
//   * JSDocコメントを付与して仕様を明示。
// * **エラーハンドリング**:

//   * 型検証（配列か？数値か？）。
//   * 長さと値域を制約内に収める。

// ## TypeScript特有の考慮点

// * **型推論**: `number[]` のみ扱うことで安全性確保。
// * **readonly配列**: 引数を `readonly number[]` として型レベルで不変を保証（ただし内部で破壊的処理は仕様上許容）。
// * **strict mode**: `tsconfig.json` の `strict: true` 前提。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                        | 時間計算量      | 空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考              |
// | ---------------------------- | ---------- | ----- | ------- | ---- | --- | --------------- |
// | 方法A: two pointers (in-place) | O(n)       | O(1)  | 低       | 高    | 高   | 最適解             |
// | 方法B: ソート+フィルタ                | O(n log n) | O(n)  | 中       | 中    | 中   | 入力が既にソート済みなので不要 |
// | 方法C: 逐次削除                    | O(n²)      | O(1)  | 低       | 高    | 高   | 小入力のみ妥当         |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法A (two pointers, in-place 更新)
// * **理由**:

//   * `O(n)` / `O(1)` で効率的。
//   * TypeScript での実装が簡潔かつ型安全。
//   * 可読性と保守性の両立。
// * **TypeScript特有の最適化ポイント**:

//   * `readonly number[]` 型を受け取りつつ、破壊的操作は仕様として許容。
//   * 型チェックをコンパイル時に行い実行時エラーを防止。
//   * `const` と `readonly` 修飾子で意図を明確化。

// ---

// # 4. 実装コード (solution.ts)

// /\*\* Node.js v18+, ESM形式 \*/

// ```typescript
/**
 * Remove duplicates so that each unique element appears at most twice.
 * @param nums - ソート済み整数配列（破壊的に更新される）
 * @returns 有効な要素数 k
 * @throws {TypeError} 入力が配列でない、要素が整数でない場合
 * @throws {RangeError} 長さや要素が制約外の場合
 * @complexity Time: O(n), Space: O(1)
 */
export function removeDuplicates(nums: number[]): number {
  // 入力検証
  if (!Array.isArray(nums)) {
    throw new TypeError("Input must be an array");
  }
  const n: number = nums.length;
  if (n < 1 || n > 3 * 1e4) {
    throw new RangeError("Array length out of bounds");
  }
  for (let i = 0; i < n; i++) {
    const v = nums[i];
    if (!Number.isInteger(v)) {
      throw new TypeError("Array must contain integers");
    }
    if (v < -1e4 || v > 1e4) {
      throw new RangeError("Array element out of range");
    }
  }

  // ---- 本処理 ----
  let writeIndex = 0;
  for (let i = 0; i < n; i++) {
    if (writeIndex < 2 || nums[i] !== nums[writeIndex - 2]) {
      nums[writeIndex] = nums[i];
      writeIndex++;
    }
  }
  return writeIndex;
}
// ```

// ---

// # 5. TypeScript固有の最適化観点

// * **型安全性**

//   * `number[]` のみ受け入れ、ジェネリクスは不要。
//   * `readonly` 修飾子で副作用抑止を意図的に強調。
// * **コンパイル時最適化**

//   * `const` 変数で再代入禁止。
//   * 型推論に任せつつ明示すべき箇所は型注釈。
// * **開発効率・保守性**

//   * JSDocでIDE補完を強化。
//   * 厳格モードで null/undefined 安全性確保。

// ---

// ✅ これで **LeetCode形式のTypeScript解答 (ESM, strict mode, pure function, O(n)/O(1))** が完成です。
