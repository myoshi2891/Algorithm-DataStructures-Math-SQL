// # 1. 問題の分析

// ## 競技プログラミング視点

// * **速度最優先**: ソート済み配列に対して1パス走査で処理可能。
// * **O(n)** 時間、O(1) 空間で実装できる。
// * in-place 更新可能 → 配列の先頭から結果を上書きするだけで済む。

// ## 業務開発視点

// * **保守性**: 関数は短くまとめ、ループ条件やカウンタ変数に意味のある命名を行う。
// * **入力検証**: 型（配列か？数値か？）、サイズ（1 <= n <= 3\*10^4）、要素範囲（-10^4 <= v <= 10^4）を早期チェック。
// * **例外方針**: TypeError / RangeError を明示的に投げる。

// ## JavaScript特有の考慮点

// * **V8最適化**: 単純な `for` ループで hidden class を安定させる。
// * **GC対策**: 新規配列を生成しない。
// * **配列操作**: `splice` / `shift` は使わず、インデックス参照で上書き。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                            | 時間計算量      | 空間計算量 | JS実装コスト | 可読性 | 備考            |
// | -------------------------------- | ---------- | ----- | ------- | --- | ------------- |
// | 方法A: 1パス in-place (two pointers) | O(n)       | O(1)  | 低       | 中   | 最適解。上書きしながら進む |
// | 方法B: ソート+フィルタ                    | O(n log n) | O(n)  | 中       | 高   | 不要。入力が既にソート済み |
// | 方法C: 逐次削除                        | O(n²)      | O(1)  | 低       | 高   | 大入力で非現実的      |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法A (two pointers, O(n))
// * **理由**: 制約内で最速かつ最小メモリ、ソート済み配列に最適化されている。
// * **JavaScript特有の最適化ポイント**:

//   * `for` ループで `write` ポインタを進めるだけ。
//   * `if (write < 2 || nums[i] !== nums[write - 2])` 条件で「3つ目以降の重複」をスキップ。
//   * 不要な配列生成なし。

// ---

// # 4. コード実装（solution.js）

// ```js
'use strict';

/**
 * Remove duplicates so that each unique element appears at most twice.
 * @param {number[]} nums - ソート済み整数配列
 * @returns {number} k - 有効な要素数
 * @throws {TypeError} 入力が配列でない / 要素が数値でない場合
 * @throws {RangeError} 長さや値域が制約外の場合
 * @complexity 時間 O(n), 空間 O(1)
 */
function removeDuplicates(nums) {
    // 入力検証
    if (!Array.isArray(nums)) {
        throw new TypeError('Input must be an array');
    }
    const n = nums.length;
    if (n < 1 || n > 3 * 1e4) {
        throw new RangeError('Array length out of bounds');
    }
    for (let i = 0; i < n; i++) {
        const v = nums[i];
        if (typeof v !== 'number' || !Number.isInteger(v)) {
            throw new TypeError('Array must contain integers');
        }
        if (v < -1e4 || v > 1e4) {
            throw new RangeError('Array element out of range');
        }
    }

    // ---- 本処理 ----
    let write = 0; // 書き込み位置
    for (let i = 0; i < n; i++) {
        if (write < 2 || nums[i] !== nums[write - 2]) {
            nums[write] = nums[i];
            write++;
        }
    }
    return write;
}

module.exports = { removeDuplicates };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ✅ `for` ループ使用（`forEach` / `map` 不使用）
// * ✅ 新規配列やクロージャ未使用
// * ✅ hidden class 安定 → `nums` は数値単型配列のまま維持
// * ✅ 例外処理はホットパス外で早期チェック

// ---

// この実装なら **Node.js v18 / CommonJS** 環境で `node solution.js` 実行可能です。
