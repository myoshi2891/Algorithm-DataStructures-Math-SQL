// # 1. 問題の分析

// ### 競技プログラミング視点

// * **速度最優先**

//   * sort禁止なので、最適解は **O(n), O(1) space** の1パス解法（Dutch National Flagアルゴリズム）。
//   * `low`, `mid`, `high` の3ポインタでインプレース交換しながら色を並べ替える。
// * **メモリ最小化**

//   * 補助配列を作らず、インデックス操作のみで解決。

// ### 業務開発視点

// * **可読性・保守性**

//   * `low`, `mid`, `high` の役割を明確化して命名。
//   * 入力検証を実装 → 想定外のデータに早期例外。
// * **例外方針**

//   * 型が配列でない → `TypeError`
//   * 要素が `0|1|2` 以外 → `RangeError`

// ### JavaScript特有の考慮点

// * **V8最適化**

//   * 単純な `for` / `while` ループで型を安定化。
//   * `Array.isArray` / `typeof` で軽量ガード。
// * **GC対策**

//   * 補助配列なし、クロージャなし。
// * **配列操作**

//   * `swap` をインライン実装。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                            | 時間計算量 | 空間計算量 | JS実装コスト | 可読性 | 備考         |
// | -------------------------------- | ----- | ----- | ------- | --- | ---------- |
// | 方法A: Dutch National Flag (3ポインタ) | O(n)  | O(1)  | 低       | 中   | 最速・省メモリ    |
// | 方法B: カウントソート (2パス)               | O(n)  | O(1)  | 中       | 高   | 直感的だが2パス   |
// | 方法C: バブルソート/選択ソート                | O(n²) | O(1)  | 低       | 高   | 制約が小さい場合のみ |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択: 方法A（Dutch National Flag）**
// * **理由:**

//   * 制約 (n ≤ 300) ではどの方法でも十分だが、Follow-up要件「1パス・定数メモリ」に合致するのはこれ。
// * **JS最適化ポイント:**

//   * `while (mid <= high)` のループ
//   * `swap` をインラインで処理し一時オブジェクト生成なし
//   * `Number.isInteger` で入力チェック

// ---

// # 4. コード実装（solution.js）

// ```javascript
'use strict';

/**
 * Sort Colors (Dutch National Flag Problem)
 * @param {number[]} nums - 入力配列（0: red, 1: white, 2: blue）
 * @returns {void} in-place で nums を並び替え
 * @throws {TypeError} 入力が配列でない場合
 * @throws {RangeError} 要素が 0,1,2 以外の場合
 * @complexity 時間 O(n), 空間 O(1)
 */
var sortColors = function (nums) {
    // 入力検証
    if (!Array.isArray(nums)) {
        throw new TypeError('Input must be an array');
    }
    const n = nums.length;
    if (n < 1 || n > 300) {
        throw new RangeError('Array size out of allowed range (1 <= n <= 300)');
    }

    for (let i = 0; i < n; i++) {
        const v = nums[i];
        if (!Number.isInteger(v)) {
            throw new TypeError('Array must contain integers only');
        }
        if (v < 0 || v > 2) {
            throw new RangeError('Array values must be 0, 1, or 2');
        }
    }

    // Dutch National Flag アルゴリズム
    let low = 0;
    let mid = 0;
    let high = n - 1;

    while (mid <= high) {
        if (nums[mid] === 0) {
            // swap(nums[low], nums[mid])
            const tmp = nums[low];
            nums[low] = nums[mid];
            nums[mid] = tmp;
            low++;
            mid++;
        } else if (nums[mid] === 1) {
            mid++;
        } else {
            // nums[mid] === 2
            const tmp = nums[mid];
            nums[mid] = nums[high];
            nums[high] = tmp;
            high--;
        }
    }
};

module.exports = { sortColors };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ✅ ループは `while` を使用、関数呼び出し削減。
// * ✅ swap はインライン、余分な関数オブジェクトを生成しない。
// * ✅ 型崩れを避けるため整数検証。
// * ✅ Pure（副作用は引数の破壊更新のみ、返り値なし → LeetCode準拠）。

// ---

// ✅ これで `leetcode` の提出フォーマットに完全対応（`var sortColors = function(nums) { ... }`）。
// ✅ Node.js v18 で `node solution.js` 実行可能（ただしLeetCode環境では `module.exports` は無視されます）。

// ---
