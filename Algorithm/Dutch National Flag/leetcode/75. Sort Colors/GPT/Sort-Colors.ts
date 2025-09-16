// ## 1. 問題の分析

// ### 競技プログラミング視点

// * **実行速度最優先**

//   * sort禁止 → O(n) 時間で O(1) 空間の Dutch National Flag アルゴリズムが最適。
//   * 1パスで `low`, `mid`, `high` ポインタを管理しながらインプレース交換。
// * **メモリ効率**

//   * 補助配列は不要。変数は固定数のみ。

// ### 業務開発視点

// * **型安全性・保守性・可読性**

//   * 入力が number 配列であることを型システムで保証。
//   * 実行時チェックも追加して、LeetCode外でも堅牢に。
// * **エラーハンドリング**

//   * 入力が配列でない場合 → `TypeError`
//   * 値が 0,1,2 以外の場合 → `RangeError`

// ### TypeScript特有の考慮点

// * **型推論**

//   * `nums: number[]` を指定してコンパイル時にエラー検知。
// * **readonly / const assertion**

//   * 不変性を担保したい部分には `readonly` を活用可能（ただしLeetCodeではインプレース必須なので非適用）。
// * **ジェネリクス**

//   * 今回は 0,1,2 限定なので汎用化は不要。だがパターンによっては `T extends number` を使う設計も可能。

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ                            | 時間計算量      | 空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考           |
// | -------------------------------- | ---------- | ----- | ------- | ---- | --- | ------------ |
// | 方法A: Dutch National Flag (3ポインタ) | O(n)       | O(1)  | 低       | 高    | 中   | 最速・1パス・省メモリ  |
// | 方法B: カウントソート (2パス)               | O(n)       | O(1)  | 中       | 高    | 高   | 分かりやすいが2回ループ |
// | 方法C: sort利用                      | O(n log n) | O(n)  | 低       | 中    | 高   | 問題文で禁止       |

// ---

// ## 3. 選択したアルゴリズムと理由

// * **選択:** 方法A（Dutch National Flag アルゴリズム）
// * **理由:**

//   * 計算量が最良（O(n)、O(1)）。
//   * 入力配列を破壊的に並び替えられるため追加メモリ不要。
//   * TypeScriptでは `nums: number[]` の型により実装エラーを事前検知できる。
// * **TypeScript特有の最適化ポイント:**

//   * 型推論により `swap` 操作の安全性を担保。
//   * `readonly` 配列を禁止することで副作用を明示。
//   * 開発時に `strict` モードで安全性確保。

// ---

// ## 4. 実装コード

// LeetCode提出用は `function sortColors(nums: number[]): void { ... }` の形。
// ローカルNode.jsで実行可能なように `export {}` を追加（LeetCodeでは無視されます）。

// ```typescript
"use strict";

/**
 * Sort Colors (Dutch National Flag Problem)
 * 0:red, 1:white, 2:blue を in-place で並べ替える
 * @param nums - 入力配列 (0,1,2 のみ)
 * @returns void (in-place sort)
 * @throws {TypeError} 入力が配列でない場合
 * @throws {RangeError} 要素が 0,1,2 以外の場合
 * @complexity Time: O(n), Space: O(1)
 */
function sortColors(nums: number[]): void {
  // 実行時ガード（LeetCodeでは不要だが業務開発視点で追加）
  if (!Array.isArray(nums)) {
    throw new TypeError("Input must be an array");
  }
  if (nums.length < 1 || nums.length > 300) {
    throw new RangeError("Array size out of allowed range (1 <= n <= 300)");
  }
  for (const v of nums) {
    if (v !== 0 && v !== 1 && v !== 2) {
      throw new RangeError("Array values must be 0, 1, or 2");
    }
  }

  // Dutch National Flag アルゴリズム
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      // swap(nums[low], nums[mid])
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      // nums[mid] === 2
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}

export {}; // Node.js v18 ESM互換（LeetCodeでは無視される）
// ```

// ---

// ## 5. TypeScript固有の最適化観点

// * **型安全性**

//   * `nums: number[]` によって配列型を保証。
//   * `readonly` 制約を使わず破壊的更新を明示。
// * **コンパイル時最適化**

//   * `strict` モードで null/undefined を排除。
//   * `const` アサーションにより `0|1|2` リテラル型を活用可能。
// * **保守性**

//   * JSDocコメントでIDEの補完を補助。
//   * 型定義がドキュメントの役割を兼ねる。

// ---

// ✅ この実装は **LeetCode提出可能** かつ **業務開発でも型安全に利用可能** です。
