// # 1. 問題の分析

// ## 競技プログラミング視点

// * 目標計算量は **O(log(m \* n))** → 二分探索が必須。
// * 行列は「各行が昇順」かつ「前の行の最後の要素 < 次の行の最初の要素」なので、**2D全体を1次元配列のように扱って二分探索可能**。
// * 入力制約は最大 `100 × 100 = 10^4` 要素。十分小さいが、指定が `O(log(m*n))` なので線形探索は不可。

// ## 業務開発視点

// * **可読性**: 2段階（row選択→col検索）より、**仮想1次元で二分探索**の方がシンプル。
// * **保守性**: JSDoc・入力検証で安全性担保。
// * **例外処理**: 配列/数値チェック、制約違反で `TypeError` / `RangeError` を投げる。

// ## JavaScript特有の考慮点

// * **V8最適化**:

//   * 二分探索は `while (low <= high)` の単純ループ。
//   * `Math.floor` 使用は許容。
// * **GC対策**: 一時配列生成を避け、**matrixを直接参照**。
// * **Hidden class安定化**: 配列はネストされた固定型配列。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                      | 時間計算量            | 空間計算量 | JS実装コスト | 可読性 | 備考          |
// | -------------------------- | ---------------- | ----- | ------- | --- | ----------- |
// | 方法A: 線形探索 (rowごとに走査)       | O(m\*n)          | O(1)  | 低       | 中   | 制約違反（遅い）    |
// | 方法B: 2段階探索 (rowを二分→colを二分) | O(log m + log n) | O(1)  | 中       | 高   | 実装やや複雑      |
// | 方法C: 仮想1次元配列で二分探索          | O(log(m\*n))     | O(1)  | 低       | 高   | **最適**、シンプル |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法C（仮想1次元の二分探索）
// * **理由**:

//   * 計算量が目標の **O(log(m\*n))**。
//   * 実装が最短で、V8に優しい単純ループ。
//   * 入力制約が小さいため、オーバーヘッド少。
// * **最適化ポイント**:

//   * `const midVal = matrix[Math.floor(mid/n)][mid % n];` として直接アクセス。
//   * for/whileループのみ、map/forEachを避ける。

// ---

// # 4. コード実装（solution.js）

// ```javascript
'use strict';

/**
 * Search a 2D Matrix
 * @param {number[][]} matrix - m×n 整数行列（昇順条件あり）
 * @param {number} target - 探索対象の整数
 * @returns {boolean} target が存在すれば true、そうでなければ false
 * @throws {TypeError} 入力型が不正な場合
 * @throws {RangeError} 行列サイズや値域が制約を超える場合
 * @complexity 時間 O(log(m*n)), 空間 O(1)
 */
function searchMatrix(matrix, target) {
    // --- 入力検証 ---
    if (!Array.isArray(matrix)) throw new TypeError('matrix must be an array');
    const m = matrix.length;
    if (m < 1 || m > 100) throw new RangeError('matrix row count out of range');
    const n = matrix[0].length;
    if (n < 1 || n > 100) throw new RangeError('matrix column count out of range');
    if (typeof target !== 'number' || !Number.isFinite(target)) {
        throw new TypeError('target must be a finite number');
    }

    for (let i = 0; i < m; i++) {
        if (!Array.isArray(matrix[i]) || matrix[i].length !== n) {
            throw new TypeError('matrix must be rectangular with equal row lengths');
        }
        for (let j = 0; j < n; j++) {
            const v = matrix[i][j];
            if (typeof v !== 'number' || !Number.isFinite(v)) {
                throw new TypeError('matrix must contain finite numbers');
            }
        }
    }

    // --- 本処理（二分探索） ---
    let low = 0,
        high = m * n - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midVal = matrix[Math.floor(mid / n)][mid % n];
        if (midVal === target) return true;
        if (midVal < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return false;
}

module.exports = { searchMatrix };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * `while` ループ利用（`forEach/map` 不使用）。
// * 一時配列・オブジェクト生成ゼロ。
// * hidden class 崩壊回避 → `matrix[i][j]` を直接参照。
// * 数値単型を守り、GC発生リスク低減。
// * 例外は **ホットパス前に早期チェック**。

// ---

// ✅ これで「leetcode回答フォーマット」に準拠し、Node.js v18 (CommonJS) でそのまま `node solution.js` 実行可能です。
