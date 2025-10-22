// ## 1. 問題の分析

// ### 競技プログラミング視点

// * 制約: `1 <= m, n <= 100` → 最大要素数は 10,000。
// * 計算量制約: **O(log(m\*n))** → 線形探索は不可。
// * 最速は「行列を仮想的に一次元化し、二分探索する方法」。
// * メモリ効率: 新しい配列生成は不要。インデックス計算で直接アクセス。

// ### 業務開発視点

// * **型安全性**: `matrix: number[][]` と `target: number` を明示。
// * **保守性**: 単純な while ループで二分探索を実装。
// * **エラーハンドリング**:

//   * 配列チェック、空行列チェック。
//   * 不正入力は `TypeError` または `RangeError`。

// ### TypeScript特有の考慮点

// * **型推論**で `matrix` 内部要素を `number` に固定。
// * **readonly** による副作用防止。
// * **null安全性**を保証。
// * **コンパイル時最適化**で実行前に型エラー検出。

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ           | 時間計算量            | 空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考             |
// | --------------- | ---------------- | ----- | ------- | ---- | --- | -------------- |
// | 方法A: 線形探索 (全走査) | O(m\*n)          | O(1)  | 低       | 高    | 中   | 制約違反（遅い）       |
// | 方法B: 行→列で二分探索   | O(log m + log n) | O(1)  | 中       | 高    | 高   | 行を特定後に列探索      |
// | 方法C: 仮想一次元で二分探索 | O(log(m\*n))     | O(1)  | 低       | 高    | 高   | **最適。シンプルで速い** |

// ---

// ## 3. 実装方針

// * **選択したアプローチ**: 方法C（仮想一次元で二分探索）
// * **理由**:

//   * 時間計算量が最小 **O(log(m\*n))**。
//   * 実装がシンプルで、TypeScriptでも可読性高い。
//   * `matrix[Math.floor(mid / n)][mid % n]` で直接要素にアクセスできる。
// * **TypeScript最適化ポイント**:

//   * `readonly number[][]` で副作用を防止。
//   * 厳格な型定義により、null/undefinedの混入を排除。
//   * コンパイル時型検査で入力エラーを検出。

// ---

// ## 4. 実装コード（solution.ts）

// ```typescript
/**
 * Search a 2D Matrix
 * @param matrix - m×n の整数行列（各行は昇順、行間も昇順）
 * @param target - 探索対象の整数
 * @returns target が存在するなら true、存在しなければ false
 * @throws {TypeError} 入力型が不正な場合
 * @throws {RangeError} サイズ制約を超える場合
 * @complexity Time: O(log(m*n)), Space: O(1)
 */
function searchMatrix(matrix: readonly number[][], target: number): boolean {
    // --- 入力検証 ---
    if (!Array.isArray(matrix)) throw new TypeError('matrix must be an array');
    const m = matrix.length;
    if (m === 0) return false;
    if (m > 100) throw new RangeError('matrix row count exceeds limit');

    const n = matrix[0].length;
    if (n === 0) return false;
    if (n > 100) throw new RangeError('matrix column count exceeds limit');

    if (typeof target !== 'number' || !Number.isFinite(target)) {
        throw new TypeError('target must be a finite number');
    }

    for (let i = 0; i < m; i++) {
        if (!Array.isArray(matrix[i]) || matrix[i].length !== n) {
            throw new TypeError('matrix must be rectangular');
        }
        for (let j = 0; j < n; j++) {
            const v = matrix[i][j];
            if (typeof v !== 'number' || !Number.isFinite(v)) {
                throw new TypeError('matrix must contain finite numbers');
            }
        }
    }

    // --- 本処理（二分探索） ---
    let low = 0;
    let high = m * n - 1;

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

export { searchMatrix };
// ```

// ---

// ## 5. TypeScript固有の最適化観点

// * **型安全性**

//   * `readonly number[][]` → イミュータブル保証
//   * `target: number` → 型安全に限定
// * **ジェネリクスの利用**

//   * 今回は `number` 固定だが、設計上は `T extends number` に拡張可能。
// * **null安全性**

//   * 空配列チェックで `undefined` アクセス回避。
// * **コンパイル時最適化**

//   * 型定義により、間違った引数の利用をコンパイル時に防止。

// ---

// ✅ これで **TypeScript + Node.js v18 (strict mode)** でそのまま LeetCode 提出形式に対応できます。
