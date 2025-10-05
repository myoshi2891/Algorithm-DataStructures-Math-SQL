// 以下は “leetcodeでの回答フォーマット” を TypeScript（Node.js v22.14.0 / **ESM** / 外部ライブラリ不可）で満たす提出用一式です。
// ※関数は **Pure**／副作用なし、strict 前提の型安全実装です。

// ---

// ## 1. 問題の分析

// ### 競技プログラミング視点での分析

// * 目標計算量は **O(log (m+n))**。典型解は **二分探索パーティション法**：短い方の配列のみを二分探索し、左右の最大/最小の関係から中央値を決定。
// * 追加メモリ **O(1)**。マージ配列を作らないためメモリ効率が高い。
// * 空配列／サイズ非対称／重複値／負数を含む境界でもロジックは一貫。

// **メモリ最小化方針**

// * 破壊的更新なし（Pure）。一時配列や `sort` は使用しない。`±Infinity` による境界処理で条件分岐を簡素化。

// ### 業務開発視点での分析

// * **型安全**：引数は `readonly number[]`、実行時も数値・有限性・値域・非減少（昇順）を検証し、違反は `TypeError` / `RangeError`。
// * **可読性/保守性**：`aLeft/aRight/bLeft/bRight` の命名で意図を明確化。入力検証をホットパス外で早期に実行。
// * **例外戦略**：仕様違反を明確に区別（型 → `TypeError`、制約 → `RangeError`、到達不能な異常 → `Error`）。

// ### TypeScript特有の考慮点

// * **型推論**：インデックスは number、配列は `readonly number[]` で不変性を明示。
// * **コンパイル時最適化**：不要なジェネリクスを避け、単純な数値演算に限定して JIT 最適化を阻害しない。
// * **null 安全**：`Infinity` ガードで未定義分岐を消し、`if` ネストを抑制。

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ                       |               時間計算量 |  空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考            |
// | --------------------------- | ------------------: | -----: | ------: | ---: | --- | ------------- |
// | 方法A: 二分探索パーティション（採用）        | **O(log min(m,n))** |   O(1) |       中 |    高 | 中   | 目標計算量を満たす標準解  |
// | 方法B: 2本のポインタで中央値まで線形走査      |              O(m+n) |   O(1) |       低 |    高 | 高   | 実装は簡単だが計算量で不利 |
// | 方法C: 連結して `.sort()` 後に中央値取得 |   O((m+n) log(m+n)) | O(m+n) |       低 |    高 | 高   | 追加メモリ/ソートコスト大 |

// ---

// ## 3. 選択したアルゴリズムと理由

// * **選択したアプローチ**: 方法A（短い配列に対する二分探索パーティション）
// * **理由**:

//   * 要件の **O(log (m+n))** を満たしつつ **O(1)** 追加メモリ。
//   * TS での境界処理が明確・安全（`±Infinity` と `readonly` で分岐・副作用を最小化）。
//   * 実装が比較的コンパクトで、検証容易。
// * **TypeScript特有の最適化ポイント**:

//   * `readonly number[]` で不変性を静的保証。
//   * 早期入力検証でホットパスの分岐を削減。
//   * 数値単型・単純な `while` ループで V8 の最適化に寄与。

// ---

// ## 4. 実装コード（**ESM / strict mode / Pure**）

// ```typescript
// solution.ts
/* eslint-disable no-plusplus */
/* Node.js v22.14.0 / ESM / no external libs
   tsconfig 推奨: "strict": true, "module": "ESNext", "target": "ES2022"
   実行は LeetCode の TypeScript 環境前提（ローカル実行時は tsc で JS に変換）
*/

/**
 * Median of Two Sorted Arrays (LeetCode)
 * 二分探索パーティション O(log(min(m,n))) / 追加メモリ O(1)
 *
 * @param nums1 - 昇順ソート済み配列（長さ 0..1000, 値域 [-1e6, 1e6]）
 * @param nums2 - 昇順ソート済み配列（長さ 0..1000, 値域 [-1e6, 1e6]）
 * @returns 中央値（偶数個のときは2値平均）
 * @throws {TypeError}  引数が配列でない / 数値でない
 * @throws {RangeError} 長さ・値域・非昇順の制約違反
 * @complexity Time: O(log(min(m,n))), Space: O(1)
 */
export function findMedianSortedArrays(
  nums1: readonly number[],
  nums2: readonly number[]
): number {
  // ---- 入力検証（ホットパス外で早期）----
  if (!Array.isArray(nums1) || !Array.isArray(nums2)) {
    throw new TypeError("Both inputs must be arrays.");
  }
  const m = nums1.length;
  const n = nums2.length;

  if (m < 0 || m > 1000 || n < 0 || n > 1000) {
    throw new RangeError("Array length out of allowed range [0, 1000].");
  }
  const total = m + n;
  if (total < 1 || total > 2000) {
    throw new RangeError("Total length must be in [1, 2000].");
  }

  validateNumberArray(nums1);
  validateNumberArray(nums2);
  if (!isNonDecreasing(nums1) || !isNonDecreasing(nums2)) {
    throw new RangeError("Arrays must be sorted in non-decreasing order.");
  }

  // ---- 本処理：短い配列に対して二分探索 ----
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

  const half = Math.floor((aLen + bLen + 1) / 2);
  let lo = 0,
    hi = aLen;

  while (lo <= hi) {
    const i = (lo + hi) >>> 1; // A 側の切り取り
    const j = half - i; // B 側の切り取り

    const aLeft = i === 0 ? -Infinity : A[i - 1]!;
    const aRight = i === aLen ? Infinity : A[i]!;
    const bLeft = j === 0 ? -Infinity : B[j - 1]!;
    const bRight = j === bLen ? Infinity : B[j]!;

    if (aLeft <= bRight && bLeft <= aRight) {
      // 正しいパーティション
      if (((aLen + bLen) & 1) === 1) {
        // 奇数：左側最大が中央値
        return aLeft > bLeft ? aLeft : bLeft;
      } else {
        // 偶数：左最大と右最小の平均
        const leftMax = aLeft > bLeft ? aLeft : bLeft;
        const rightMin = aRight < bRight ? aRight : bRight;
        return (leftMax + rightMin) / 2;
      }
    } else if (aLeft > bRight) {
      // 左が重い → i を小さく
      hi = i - 1;
    } else {
      // 右が重い → i を大きく
      lo = i + 1;
    }
  }

  // ここには来ない（検証済み入力で中央値は必ず存在）
  throw new Error("Unexpected state: valid median not found.");
}

/** 数値配列（有限・値域）検証 */
function validateNumberArray(arr: readonly number[]): void {
  const len = arr.length;
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

/** 非減少（昇順）確認 */
function isNonDecreasing(arr: readonly number[]): boolean {
  const len = arr.length;
  for (let i = 1; i < len; i++) {
    if (arr[i - 1]! > arr[i]!) return false;
  }
  return true;
}
// ```

// > **LeetCode 提出時の関数名/シグネチャ**はそのまま `findMedianSortedArrays(nums1: number[], nums2: number[]): number` で互換です。
// > ローカルでの ESM 実行は `tsc` で JS にビルドしてから `node` 実行を想定（外部ツール導入の指示は行いません）。

// ---

// ## TypeScript 固有の最適化観点

// * **型安全性**

//   * `readonly number[]` で不変性を表明し、副作用をコンパイル時に抑止。
//   * 実行時も `TypeError`/`RangeError` を明確化して失敗モードを限定。
// * **推論/簡潔性**

//   * 余計なジェネリクスは使わず、数値単型に限定して JIT 最適化を阻害しない。
// * **null 安全性**

//   * 配列境界は `±Infinity` を使用し未定義アクセスを回避、`!` は境界での存在保証の意図を明確化。

// ---

// ### まとめ

// * 目標計算量 **O(log (m+n))** を満たす標準解（短い配列に対する二分探索パーティション）。
// * **Pure / ESM / strict / 外部ライブラリ不使用** を遵守。
// * 型安全な入力検証 + シンプルなホットパスで、速度・可読性・保守性のバランスを最適化。
