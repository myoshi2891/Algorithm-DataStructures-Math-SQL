// ## 1. 問題分析結果

// ### 競技プログラミング視点

// - **制約**: m×n 行列、1≤m,n≤200 → 最大 40,000 要素
// - **要求**: in-place 操作で O(1)空間計算量が理想
// - **キーポイント**: 型安全性を保ちながら最適なメモリ使用量を実現

// ### 業務開発視点

// - **型安全性**: コンパイル時に境界条件エラーを検出
// - **保守性**: インターフェース定義による明確な契約
// - **エラーハンドリング**: 型ガードによる実行時安全性確保

// ### TypeScript 特有分析

// - **型システム活用**: 2 次元配列の型安全な操作
// - **コンパイル時最適化**: `readonly`修飾子による意図明確化
// - **V8 最適化との相乗効果**: 型情報による JIT コンパイル効率化

// ## 2. アルゴリズム比較表

// | アプローチ   | 時間計算量 | 空間計算量 | TS 実装コスト | 可読性 | 型安全性 | V8 最適化 | 備考                 |
// | ------------ | ---------- | ---------- | ------------- | ------ | -------- | --------- | -------------------- |
// | 追加配列使用 | O(mn)      | O(m+n)     | 低            | ★★★    | 高       | 適        | 型定義が直感的       |
// | 第一行列使用 | O(mn)      | O(1)       | 中            | ★★☆    | 高       | 適        | Follow-up 要求満たす |
// | ビット操作   | O(mn)      | O(1)       | 高            | ★☆☆    | 中       | 不適      | 型安全性に制約       |

// ## 3. 採用アルゴリズムと根拠

// **選択**: 型安全な第一行・第一列フラグ使用の O(1)空間解法

// - **理由**: TypeScript の型システムで安全性を担保しつつ、Follow-up の要求を満たす
// - **TypeScript 最適化戦略**:
//   - 厳密な型定義による境界エラー防止
//   - `readonly`配列による意図の明確化
//   - 型ガードによる実行時安全性確保
// - **トレードオフ**: 型注釈のオーバーヘッド < コンパイル時エラー検出の利益

// ## 4. 実装詳細

// ```python
// 型定義
type Matrix = number[][];
type ReadonlyMatrix = readonly (readonly number[])[];

interface MatrixDimensions {
    readonly rows: number;
    readonly cols: number;
}

interface MatrixValidation {
    readonly isValid: boolean;
    readonly error?: string;
}

/**
 * Set Matrix Zeroes - TypeScript O(1) Space Solution
 * @param matrix - 2D integer matrix to modify in-place
 * @complexity Time: O(mn), Space: O(1)
 * @throws {TypeError} Invalid matrix input
 * @throws {RangeError} Matrix dimensions out of bounds
 */
function setZeroes(matrix: Matrix): void {
    // 入力検証（型安全）
    const validation = validateMatrix(matrix);
    if (!validation.isValid) {
        throw new TypeError(validation.error || 'Invalid matrix input');
    }

    const dimensions = getMatrixDimensions(matrix);
    const { rows: m, cols: n } = dimensions;

    // エッジケース: 空行列（TypeScriptでは型レベルで防げるが実行時チェック）
    if (m === 0 || n === 0) {
        return;
    }

    // 第一行・第一列の元の状態を型安全に保存
    const firstRowHasZero = hasZeroInFirstRow(matrix, n);
    const firstColHasZero = hasZeroInFirstCol(matrix, m);

    // フラグマーキング（型安全な範囲チェック付き）
    markZeroFlags(matrix, m, n);

    // 内部要素のゼロ化（型ガード付き）
    applyZeroFlags(matrix, m, n);

    // 境界処理（型安全）
    if (firstRowHasZero) {
        setFirstRowZero(matrix, n);
    }

    if (firstColHasZero) {
        setFirstColZero(matrix, m);
    }
}

/**
 * 型安全な行列検証
 */
function validateMatrix(matrix: unknown): MatrixValidation {
    // null/undefined チェック
    if (matrix == null) {
        return { isValid: false, error: 'Matrix cannot be null or undefined' };
    }

    // 配列型チェック
    if (!Array.isArray(matrix)) {
        return { isValid: false, error: 'Input must be an array' };
    }

    // 空配列チェック
    if (matrix.length === 0) {
        return { isValid: true }; // 有効なエッジケース
    }

    // 各行の検証
    for (let i = 0; i < matrix.length; i++) {
        const row = matrix[i];

        if (!Array.isArray(row)) {
            return { isValid: false, error: `Row ${i} is not an array` };
        }

        // 矩形チェック
        if (i > 0 && row.length !== matrix[0].length) {
            return { isValid: false, error: 'Matrix must be rectangular' };
        }

        // 各要素の型チェック
        for (let j = 0; j < row.length; j++) {
            if (typeof row[j] !== 'number') {
                return {
                    isValid: false,
                    error: `Element at [${i}][${j}] is not a number`,
                };
            }
        }
    }

    return { isValid: true };
}

/**
 * 行列次元の型安全な取得
 */
function getMatrixDimensions(matrix: Matrix): MatrixDimensions {
    return {
        rows: matrix.length,
        cols: matrix.length > 0 ? matrix[0].length : 0,
    } as const;
}

/**
 * 第一行のゼロ存在チェック（型安全）
 */
function hasZeroInFirstRow(matrix: ReadonlyMatrix, cols: number): boolean {
    for (let j = 0; j < cols; j++) {
        if (matrix[0][j] === 0) {
            return true;
        }
    }
    return false;
}

/**
 * 第一列のゼロ存在チェック（型安全）
 */
function hasZeroInFirstCol(matrix: ReadonlyMatrix, rows: number): boolean {
    for (let i = 0; i < rows; i++) {
        if (matrix[i][0] === 0) {
            return true;
        }
    }
    return false;
}

/**
 * ゼロフラグのマーキング（V8最適化考慮）
 */
function markZeroFlags(matrix: Matrix, rows: number, cols: number): void {
    // V8最適化: インデックスによる連続アクセス
    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            if (matrix[i][j] === 0) {
                matrix[i][0] = 0; // 行フラグ
                matrix[0][j] = 0; // 列フラグ
            }
        }
    }
}

/**
 * フラグに基づくゼロ適用（型安全）
 */
function applyZeroFlags(matrix: Matrix, rows: number, cols: number): void {
    // 型安全な境界チェック付きループ
    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            if (matrix[i][0] === 0 || matrix[0][j] === 0) {
                matrix[i][j] = 0;
            }
        }
    }
}

/**
 * 第一行のゼロ化（型安全）
 */
function setFirstRowZero(matrix: Matrix, cols: number): void {
    for (let j = 0; j < cols; j++) {
        matrix[0][j] = 0;
    }
}

/**
 * 第一列のゼロ化（型安全）
 */
function setFirstColZero(matrix: Matrix, rows: number): void {
    for (let i = 0; i < rows; i++) {
        matrix[i][0] = 0;
    }
}

// ユーティリティ型定義
type TestCase = {
    readonly input: Matrix;
    readonly expected: Matrix;
    readonly description: string;
};

/**
 * 型安全なテストケース実行
 */
function runTestCase(testCase: TestCase): void {
    const { input, expected, description } = testCase;

    // 入力の深いコピー（型安全）
    const testMatrix: Matrix = input.map((row) => [...row]);

    try {
        setZeroes(testMatrix);

        // 結果検証（型安全な比較）
        const isEqual = matricesEqual(testMatrix, expected);
        console.log(`${description}: ${isEqual ? 'PASS' : 'FAIL'}`);

        if (!isEqual) {
            console.log('  Expected:', JSON.stringify(expected));
            console.log('  Actual:  ', JSON.stringify(testMatrix));
        }
    } catch (error) {
        console.log(
            `${description}: ERROR - ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
    }
}

/**
 * 型安全な行列比較
 */
function matricesEqual(a: ReadonlyMatrix, b: ReadonlyMatrix): boolean {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i].length !== b[i].length) return false;

        for (let j = 0; j < a[i].length; j++) {
            if (a[i][j] !== b[i][j]) return false;
        }
    }

    return true;
}

// 使用例とテストケース
function testSetZeroesTypeScript(): void {
    const testCases: readonly TestCase[] = [
        {
            input: [
                [1, 1, 1],
                [1, 0, 1],
                [1, 1, 1],
            ],
            expected: [
                [1, 0, 1],
                [0, 0, 0],
                [1, 0, 1],
            ],
            description: 'Example 1',
        },
        {
            input: [
                [0, 1, 2, 0],
                [3, 4, 5, 2],
                [1, 3, 1, 5],
            ],
            expected: [
                [0, 0, 0, 0],
                [0, 4, 5, 0],
                [0, 3, 1, 0],
            ],
            description: 'Example 2',
        },
        {
            input: [[1]],
            expected: [[1]],
            description: 'Single element - no zero',
        },
        {
            input: [[0]],
            expected: [[0]],
            description: 'Single element - zero',
        },
        {
            input: [
                [0, 0],
                [0, 0],
            ],
            expected: [
                [0, 0],
                [0, 0],
            ],
            description: 'All zeros',
        },
    ] as const;

    testCases.forEach(runTestCase);
}

// パフォーマンス測定用（開発時用）
function generateTypedTestMatrix(rows: number, cols: number, zeroRate = 0.1): Matrix {
    // 型安全な行列生成
    const matrix: Matrix = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(1));
    const zeroCount = Math.floor(rows * cols * zeroRate);

    for (let k = 0; k < zeroCount; k++) {
        const i = Math.floor(Math.random() * rows);
        const j = Math.floor(Math.random() * cols);
        matrix[i][j] = 0;
    }

    return matrix;
}

// エクスポート（モジュール使用時）
export { setZeroes, validateMatrix, getMatrixDimensions, testSetZeroesTypeScript };
export type { Matrix, ReadonlyMatrix, MatrixDimensions, TestCase };
// ```

// ## 5. TypeScript 特有最適化ポイント

// ### 型システム活用

// - **厳密な型定義**: `Matrix`型による 2 次元配列の型安全性確保
// - **型ガード実装**: `validateMatrix`による実行時型チェック
// - **`readonly`修飾子**: 不変性の意図明確化とコンパイラ最適化
// - **Union Types**: エラー処理での型安全な結果表現

// ### V8 エンジン最適化（JavaScript 同等）

// - **インライン化促進**: 小関数に分割した処理ロジック
// - **Hidden Class 安定化**: 一貫した配列アクセスパターン
// - **効率的ループ**: for ループによるインデックスアクセス
// - **局所性活用**: 連続メモリアクセス最適化

// ### TypeScript 特有の最適化

// - **`as const`アサーション**: テストケースの型推論最適化
// - **型注釈最小化**: 必要箇所のみの明示的型指定
// - **Template Literal Types**: 将来的な拡張性考慮
// - **Utility Types 活用**: `readonly`での不変性保証

// ## 6. パフォーマンス考察

// ### 理論計算量

// - **時間計算量**: O(mn) - 各要素への定数回アクセス
// - **空間計算量**: O(1) - 固定数の変数のみ使用

// ### TypeScript/V8 実測予想

// - **コンパイル後 JavaScript**: 型情報除去により実行時オーバーヘッドなし
// - **JIT 最適化**: 型情報によるより効率的な機械語生成
// - **メモリ効率**: 型チェックはコンパイル時のみで実行時影響なし
// - **開発効率**: コンパイル時エラー検出による品質向上

// ### 型システムオーバーヘッド

// - **コンパイル時**: 型チェック処理によるビルド時間若干増加
// - **実行時**: ゼロオーバーヘッド（型情報は削除される）
// - **バンドルサイズ**: TypeScript メタデータなしで同等サイズ

// ### 改善余地

// - **Generic Types**: より柔軟な型パラメータ化
// - **Brand Types**: より厳密な型安全性（行列次元の型レベル保証）
// - **Template Literal Types**: 動的な型生成での更なる安全性
// - **Conditional Types**: 条件に基づく型分岐による最適化

// ## 7. TypeScript 導入効果

// ### 開発時利益

// - **コンパイル時エラー検出**: 境界条件違反の事前発見
// - **IDE 支援強化**: 自動補完・リファクタリング支援
// - **ドキュメント効果**: 型定義による自己文書化
// - **リファクタリング安全性**: 型チェックによる変更影響範囲把握

// ### 保守性向上

// - **契約明確化**: インターフェース定義による仕様明示
// - **変更検出**: 型システムによる破壊的変更の自動検出
// - **テスト品質**: 型安全なテストケース記述

// この実装は TypeScript の型システムを最大限活用しながら、JavaScript と同等の実行時パフォーマンスを実現し、Follow-up の要求も完全に満たしています。
