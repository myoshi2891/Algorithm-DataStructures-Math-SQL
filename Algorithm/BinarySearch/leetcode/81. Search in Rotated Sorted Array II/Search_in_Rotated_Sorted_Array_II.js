// # 1. 問題の分析

// ## 競技プログラミング視点

// * **目的**: 回転ソート配列に対して、`target` が存在するかを効率的に判定する。
// * **配列長上限**: 5000 → O(n) でも十分だが、可能なら O(log n) を狙いたい。
// * **難点**: 重複値があるため、単純な二分探索では「どちらの半分がソート済みか」が曖昧になる。

// ## 業務開発視点

// * **保守性**: `while` ベースの二分探索関数を切り出せば、再利用・テスト容易性が高まる。
// * **入力検証**: 配列型、数値範囲、長さ制限を厳格チェック。
// * **エラーハンドリング**: 不正入力は `TypeError` / `RangeError`。

// ## JavaScript特有の考慮点

// * **V8最適化**:

//   * `for`/`while` を使用（`forEach`/`map` は避ける）。
//   * 単型配列（全要素が number）を維持。
// * **GC対策**: 新規配列やクロージャ生成を避ける。
// * **プロパティ安定性**: `nums` 配列を不変利用（pure function）。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ          | 時間計算量                      | 空間計算量 | JS実装コスト | 可読性 | 備考             |
// | -------------- | -------------------------- | ----- | ------- | --- | -------------- |
// | 方法A: 線形探索      | O(n)                       | O(1)  | 低       | 高   | 最悪5000要素でも許容可能 |
// | 方法B: 修正版二分探索   | O(log n) (ただし重複で O(n) に悪化) | O(1)  | 中       | 中   | 実質的に最適解        |
// | 方法C: ソートして二分探索 | O(n log n)                 | O(n)  | 中       | 高   | 無駄が多い          |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択したアプローチ**: 方法B（二分探索 with duplicates 対応）
// * **理由**:

//   * 平均的に O(log n) を達成可能。
//   * `n <= 5000` なので最悪 O(n) でも許容範囲。
//   * JavaScript の while ループ構造と親和性が高い。
// * **JavaScript最適化ポイント**:

//   * `while (left <= right)` のループ
//   * `nums[left]`, `nums[mid]`, `nums[right]` の参照を最小化
//   * 入力検証を先頭で行い、ホットパスから分離

// ---

// # 4. コード実装（solution.js）

// ```js
"use strict";

/**
 * Search in Rotated Sorted Array II
 * @param {number[]} nums - Rotated sorted array (may contain duplicates)
 * @param {number} target - Search target
 * @returns {boolean} True if target exists, otherwise false
 * @throws {TypeError} If inputs are not valid types
 * @throws {RangeError} If constraints are violated
 * @complexity Time: O(log n) average, O(n) worst (due to duplicates), Space: O(1)
 */
function search(nums, target) {
  // ---- 入力検証 ----
  if (!Array.isArray(nums)) {
    throw new TypeError("nums must be an array");
  }
  const n = nums.length;
  if (n < 1 || n > 5000) {
    throw new RangeError("nums length out of range");
  }
  if (typeof target !== "number" || !Number.isFinite(target)) {
    throw new TypeError("target must be a finite number");
  }
  for (let i = 0; i < n; i++) {
    const v = nums[i];
    if (typeof v !== "number" || !Number.isFinite(v) || v < -1e4 || v > 1e4) {
      throw new RangeError("nums contains invalid number");
    }
  }

  // ---- 二分探索 (duplicates 対応) ----
  let left = 0;
  let right = n - 1;

  while (left <= right) {
    const mid = (left + right) >> 1;
    if (nums[mid] === target) return true;

    // 重複排除
    if (nums[left] === nums[mid] && nums[mid] === nums[right]) {
      left++;
      right--;
    }
    // 左半分がソート済み
    else if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // 右半分がソート済み
    else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return false;
}

module.exports = { search };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ✅ `while` を利用 → 不要なクロージャ生成を回避
// * ✅ 単型配列維持 → Hidden class の安定化
// * ✅ 一時配列/オブジェクト生成なし
// * ✅ 入力検証をホットパス外に分離
// * ✅ `>> 1` を用いた高速除算

// ---

// 👉 この実装を **`solution.js`** として保存すれば、`node solution.js` でローカル実行・テスト可能です。
