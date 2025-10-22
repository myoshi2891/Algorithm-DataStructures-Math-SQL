// ## 🏆 バランス判断

// * **LeetCode 提出時**
//   → *制約は必ず守られる* 前提なので、入力検証や冗長な型チェックは不要。
//   → **最適化版**（速さ優先）を採用。

// * **業務開発やOSS利用時**
//   → ユーザー入力や外部APIからのデータが想定外のケースを含むため、堅牢性が重要。
//   → **堅牢版**（型ガードやエラーハンドリングを残す）を採用。

// 👉 つまり **提出用は最適化版、実務では堅牢版** がベスト。
// 両方のコードを持っておくのが一番実用的です。

// ---

// # TypeScript 実装回答

// ## 1. 問題の分析

// * **競技プログラミング視点**

//   * 二分探索を用いて平均 O(log n)、重複により最悪 O(n)。
//   * 配列長上限が 5000 のため最悪ケースでも十分高速。
//   * 追加メモリは O(1)。

// * **業務開発視点**

//   * 型安全性を重視し、入力配列・ターゲットの型を厳密化。
//   * 関数は pure に実装（副作用なし）。
//   * 無効な入力は例外で早期に検出。

// * **TypeScript特有の考慮点**

//   * `readonly number[]` を使ってイミュータブル性を担保。
//   * 型推論と strict mode により安全性を高める。
//   * null/undefined 排除済みの引数シグネチャ。

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ           | 時間計算量                | 空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考              |
// | --------------- | -------------------- | ----- | ------- | ---- | --- | --------------- |
// | 方法A: 線形探索       | O(n)                 | O(1)  | 低       | 高    | 高   | 最悪でも5000要素で十分高速 |
// | 方法B: 二分探索（重複対応） | O(log n) 平均, O(n) 最悪 | O(1)  | 中       | 高    | 中   | 実質的に最適解         |
// | 方法C: ソートして二分探索  | O(n log n)           | O(n)  | 中       | 中    | 高   | 無駄が多い           |

// ---

// ## 3. 実装方針

// * **選択したアプローチ**: 方法B（二分探索 with duplicates 対応）
// * **理由**:

//   * 平均 O(log n) を期待でき、最悪 O(n) でも許容範囲。
//   * TypeScript による型安全性と可読性を両立しやすい。
// * **TypeScript最適化ポイント**:

//   * `readonly number[]` で副作用を禁止。
//   * 明示的な戻り値型を `boolean` に固定。
//   * ループ変数は `let` を利用し JIT 最適化を阻害しない。

// ---

// ## 4. 実装コード（solution.ts, ESM形式）

// ```typescript
/**
 * Search in Rotated Sorted Array II
 * @param nums - Rotated sorted array (may contain duplicates)
 * @param target - Search target value
 * @returns True if target exists in nums, otherwise false
 * @throws {TypeError} If input types are invalid
 * @complexity Time: O(log n) average, O(n) worst due to duplicates; Space: O(1)
 */
export function search(nums: readonly number[], target: number): boolean {
    // ---- 入力検証 ----
    if (!Array.isArray(nums)) {
        throw new TypeError('nums must be an array');
    }
    if (typeof target !== 'number' || !Number.isFinite(target)) {
        throw new TypeError('target must be a finite number');
    }

    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        const mid = (left + right) >> 1;
        if (nums[mid] === target) return true;

        // duplicates skip
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
// ```

// ---

// ## 5. TypeScript固有の最適化観点

// * **型安全性**

//   * `readonly number[]` により関数内部での破壊的変更を防止。
//   * `target: number` を明示して null/undefined 排除。

// * **コンパイル時最適化**

//   * 型推論により冗長な型注釈を削減。
//   * `const` / `let` の適切な使い分けで JIT 最適化を誘導。

// * **開発効率と保守性**

//   * 型定義がドキュメントの役割を兼ねる。
//   * IntelliSense が補完を支援。
//   * pure function 化によりユニットテストが容易。

// ---

// ✅ これで **LeetCode 提出に十分な最適化版** かつ **業務利用でも耐えられる堅牢版** の TypeScript 実装になっています。
