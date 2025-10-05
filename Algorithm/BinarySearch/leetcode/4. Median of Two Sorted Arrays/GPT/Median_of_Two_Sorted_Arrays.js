// ## 1. 問題の分析

// ### 競技プログラミング視点

// * 目標計算量は **O(log (m+n))**。2 配列の **二分探索 + パーティション法**（片方の配列に対する二分探索）で到達可能。
// * 片方（短い方）だけを探索し、もう片方の境界は計算で決まるため **O(1) 追加メモリ**。
// * 空配列/サイズ差が極端/重複値/負数などの境界条件を網羅してもロジックは崩れない。

// ### 業務開発視点

// * 可読性：`leftMax/rightMin` を明示命名、境界は `±Infinity` を用いて分岐最小化。
// * 例外方針：型・長さ・値域・ソート順の検証を **早期に一度だけ** 実施。違反は `TypeError` / `RangeError` で即時 throw。
// * 関数は **Pure**（外部 I/O なし、引数の破壊なし）でテスト容易性を担保。

// ### JavaScript特有の考慮

// * V8 最適化：単純な `for` 走査、数値単型を維持、クロージャ生成を避ける。
// * GC 対策：一時配列を作らない（マージしない）、オブジェクト割当は最小。
// * 配列操作：`shift/unshift` 非使用、`sort` も使用しない（コスト/型崩れ回避）。

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ                | 時間計算量                |  空間計算量 | JS実装コスト | 可読性 | 備考             |
// | -------------------- | -------------------- | -----: | ------: | --- | -------------- |
// | 方法A: 二分探索パーティション（採用） | **O(log min(m, n))** |   O(1) |       中 | 中   | 目標計算量を満たす標準解   |
// | 方法B: マージして中央値まで走査    | O(m+n)               |   O(1) |       低 | 高   | 単純・速記可だが計算量が劣る |
// | 方法C: 連結して `.sort()`  | O((m+n) log(m+n))    | O(m+n) |       低 | 高   | 追加メモリ大・遅い（不採用） |

// ※「JS実装コスト」は型安定性・境界処理の複雑さを含む目安。

// ---

// ## 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（二分探索パーティション）
// * **理由**:

//   * 問題要件の **O(log (m+n))** を満たす唯一の代表解。
//   * 追加メモリ O(1)・分岐が少なくバグ耐性が高い。
// * **JS最適化ポイント**:

//   * `for` ループのみで検証、例外はホットパス外で早期判定。
//   * `Number.isFinite` で数値単型維持、`±Infinity` で境界分岐削減。
//   * 一切の一時配列/`sort` を使わない。

// ---

// ## 4. コード実装（solution.js）

// ```js
"use strict";
// Module System: CommonJS
// Runtime: Node.js v18.x
// External Libraries: Not allowed

/**
 * LeetCode: Median of Two Sorted Arrays
 * 二分探索パーティションによる O(log (m+n)) 解法（Pure Function）
 *
 * @param {number[]} nums1 - 昇順ソート済み配列（長さ 0..1000, 値域 [-1e6, 1e6]）
 * @param {number[]} nums2 - 昇順ソート済み配列（長さ 0..1000, 値域 [-1e6, 1e6]）
 * @returns {number} 中央値（偶数個のときは平均値）
 *
 * @throws {TypeError} 引数が配列でない / 非数値を含む
 * @throws {RangeError} 長さ制約違反 / 値域違反 / 非昇順
 *
 * @complexity Time O(log(min(m,n))), Space O(1)
 */
function findMedianSortedArrays(nums1, nums2) {
  // ---- 入力検証（軽量＆早期）----
  if (!Array.isArray(nums1) || !Array.isArray(nums2)) {
    throw new TypeError("Both inputs must be arrays.");
  }
  const m = nums1.length | 0;
  const n = nums2.length | 0;

  // 長さ制約
  if (m < 0 || m > 1000 || n < 0 || n > 1000) {
    throw new RangeError("Array length out of allowed range [0,1000].");
  }
  const total = m + n;
  if (total < 1 || total > 2000) {
    throw new RangeError("Total length must be in [1,2000].");
  }

  // 値域と数値単型、および非減少（昇順）検証
  validateArray(nums1);
  validateArray(nums2);
  if (!isNonDecreasing(nums1) || !isNonDecreasing(nums2)) {
    throw new RangeError("Arrays must be sorted in non-decreasing order.");
  }

  // ---- 本処理：二分探索パーティション ----
  // 常に nums1 を短い方にする
  let A = nums1,
    B = nums2;
  let aLen = m,
    bLen = n;
  if (aLen > bLen) {
    A = nums2;
    B = nums1;
    aLen = n;
    bLen = m;
  }

  const half = ((aLen + bLen + 1) / 2) | 0; // 左側の要素数
  let lo = 0,
    hi = aLen;

  while (lo <= hi) {
    const i = (lo + hi) >> 1; // A 側の切り取り数
    const j = half - i; // B 側の切り取り数

    const aLeft = i === 0 ? -Infinity : A[i - 1];
    const aRight = i === aLen ? Infinity : A[i];
    const bLeft = j === 0 ? -Infinity : B[j - 1];
    const bRight = j === bLen ? Infinity : B[j];

    // パーティション条件
    if (aLeft <= bRight && bLeft <= aRight) {
      // 正しい分割
      if (((aLen + bLen) & 1) === 1) {
        // 奇数：左側最大
        const leftMax = aLeft > bLeft ? aLeft : bLeft;
        return leftMax;
      } else {
        // 偶数：左側最大と右側最小の平均
        const leftMax = aLeft > bLeft ? aLeft : bLeft;
        const rightMin = aRight < bRight ? aRight : bRight;
        return (leftMax + rightMin) / 2;
      }
    } else if (aLeft > bRight) {
      // 左が重い → A の切り取りを減らす
      hi = i - 1;
    } else {
      // 右が重い → A の切り取りを増やす
      lo = i + 1;
    }
  }

  // ここに来ないはず（検証済み入力で必ず解がある）
  throw new Error("Unexpected state: valid median not found.");
}

/**
 * 値域/型の軽量検証（数値・有限・値域内）
 * @param {number[]} arr
 * @throws {TypeError|RangeError}
 */
function validateArray(arr) {
  const len = arr.length | 0;
  for (let i = 0; i < len; i++) {
    const v = arr[i];
    if (typeof v !== "number" || !Number.isFinite(v)) {
      throw new TypeError("Arrays must contain finite numbers only.");
    }
    if (v < -1e6 || v > 1e6) {
      throw new RangeError("Values must be within [-1e6, 1e6].");
    }
  }
}

/**
 * 非減少（昇順）確認
 * @param {number[]} arr
 * @returns {boolean}
 */
function isNonDecreasing(arr) {
  const len = arr.length | 0;
  for (let i = 1; i < len; i++) {
    if (arr[i - 1] > arr[i]) return false;
  }
  return true;
}

module.exports = { findMedianSortedArrays };
// ```

// ---

// ## 5. 追加メモ（JS最適化チェックリスト）

// * ループは `for` を基本に（`map/forEach` 由来の割当回避）。
// * 一時配列や `.sort()` を使わない。
// * 例外はホットパス外（冒頭）で早期判定し、以降は分岐最小化。
// * `±Infinity` を用いた境界処理で分岐の複雑化を抑制。
// * 配列は数値単型を維持（`Number.isFinite` で検査）。
