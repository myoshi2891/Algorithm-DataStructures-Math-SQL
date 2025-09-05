// # Minimum Path Sum - TypeScript解析

// ## 1. 問題分析結果

// ### 競技プログラミング視点
// - **制約**: m×n グリッド (最大200×200 = 40,000セル)
// - **必要計算量**: O(m×n) が最適（全セル訪問必須）
// - **メモリ**: O(n) で実現可能（1行分のDPテーブル）
// - **数値範囲**: 0-200の整数のみ → 型安全性で最適化可能

// ### 業務開発視点  
// - **型安全性**: `number[][]` 型でコンパイル時検証
// - **エラーハンドリング**: 型ガードとアサーション関数の組み合わせ
// - **可読性**: インターフェースとジェネリクスで意図明確化

// ### TypeScript特有分析
// - **型推論最適化**: `const assertions` でリテラル型固定
// - **コンパイル時最適化**: 厳密な型定義でV8の Hidden Class安定化
// - **Tree Shaking**: 明示的な型エクスポートで未使用コード排除

// ## 2. アルゴリズム比較表

// |アプローチ|時間計算量|空間計算量|TS実装コスト|可読性|型安全性|V8最適化|備考|
// |---------|----------|----------|-----------|------|--------|--------|-----|
// |2D DP|O(m×n)|O(m×n)|低|★★★|高|適|型推論が最も自然|
// |1D DP|O(m×n)|O(n)|中|★★☆|高|適|メモリ効率とのバランス良好|
// |In-place|O(m×n)|O(1)|中|★☆☆|中|適|readonly違反のため型安全性低下|
// |Recursive|O(m×n)|O(m×n)|高|★☆☆|高|不適|型は安全だがスタックオーバーフロー|

// ## 3. 採用アルゴリズムと根拠

// **選択**: **1D DP（型安全版）**

// **理由**:
// - 時間計算量 O(m×n) で最適
// - 空間計算量 O(n) でメモリ効率良好
// - TypeScriptの型システムでランタイムエラー事前防止
// - `ReadonlyArray` 活用で意図しない変更防止

// **TypeScript最適化戦略**:
// 1. **厳密な型定義**: `Grid` 型で2次元配列を明確化
// 2. **型ガード**: 入力検証で実行時安全性確保
// 3. **const assertions**: 配列サイズ固定でV8最適化促進
// 4. **Utility Types**: `NonNullable` で null/undefined 排除

// ## 4. 実装詳細## 5. パフォーマンス考察

// ### 理論計算量
// - **時間**: O(m×n) - 各セルを1回ずつ処理
// - **空間**: O(n) - 1行分のDP配列のみ使用
// - **型チェック**: O(1) - コンパイル時に解決

// ### TypeScript/V8実測予想
// - **コンパイル後**: 最適化されたJavaScriptと同等性能
// - **型安全性オーバーヘッド**: 実行時はゼロ（コンパイル時のみ）
// - **Hidden Class最適化**: 厳密な型定義でV8が効率的にキャッシュ

// ### TypeScript特有の最適化効果

// 1. **コンパイル時最適化**
//    - 型推論による不要なチェック除去
//    - `const assertions` でリテラル型固定
//    - Tree shakingで未使用コード削除

// 2. **実行時安全性**
//    - 型ガードによるランタイムエラー事前防止
//    - アサーション関数での型ナローイング
//    - Union typesでの安全な分岐処理

// 3. **V8エンジン協調**
//    - 型統一による Hidden Class安定化
//    - 明示的な型注釈でインライン化促進
//    - 数値配列の最適化パス活用

// ### 改善余地

// 1. **さらなる型安全性**: Branded Types での値の意味的区別
// 2. **ジェネリクス活用**: 異なる数値型（bigint等）への対応
// 3. **Template Literal Types**: より厳密な制約表現
// 4. **Conditional Types**: 動的な最適化戦略選択

// ## 6. LeetCode提出形式（TypeScript）

// ```typescript
// function minPathSum(grid: number[][]): number {
//     const m = grid.length;
//     const n = grid[0].length;
    
//     // Single cell optimization
//     if (m === 1 && n === 1) {
//         return grid[0][0];
//     }
    
//     // 1D DP array with explicit typing
//     const dp: number[] = new Array<number>(n);
    
//     // Initialize first row
//     dp[0] = grid[0][0];
//     for (let j = 1; j < n; j++) {
//         dp[j] = dp[j - 1] + grid[0][j];
//     }
    
//     // Process remaining rows
//     for (let i = 1; i < m; i++) {
//         dp[0] += grid[i][0];
//         for (let j = 1; j < n; j++) {
//             dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
//         }
//     }
    
//     return dp[n - 1];
// }
// ```

// この実装は **O(m×n) 時間、O(n) 空間** で、TypeScriptの型システムを最大限活用しつつ、コンパイル後はV8エンジンで最適化された高速なJavaScriptとして動作します。型安全性とパフォーマンスの両立を実現した効率的な解答です。

// ===== 型定義 =====

/** グリッドの型定義 */
type Grid = readonly (readonly number[])[];

/** 入力データの型 */
interface InputData {
    readonly grid: Grid;
}

/** アルゴリズムオプション */
interface AlgorithmOptions {
    readonly validateInput?: boolean;
    readonly enableOptimization?: boolean;
}

/** グリッドの制約 */
const CONSTRAINTS = {
    MAX_DIMENSION: 200,
    MIN_VALUE: 0,
    MAX_VALUE: 200,
} as const;

// ===== 型ガード関数 =====

/**
 * グリッドの型ガード
 */
function isValidGrid(value: unknown): value is Grid {
    if (!Array.isArray(value) || value.length === 0) {
        return false;
    }
    
    if (!Array.isArray(value[0]) || value[0].length === 0) {
        return false;
    }
    
    const n = value[0].length;
    return value.every((row: unknown) => 
        Array.isArray(row) && 
        row.length === n && 
        row.every((cell: unknown) => 
            typeof cell === 'number' && 
            Number.isInteger(cell) &&
            cell >= CONSTRAINTS.MIN_VALUE && 
            cell <= CONSTRAINTS.MAX_VALUE
        )
    );
}

/**
 * エッジケース判定（型ガード）
 */
function isSingleCell(grid: Grid): grid is readonly [readonly [number]] {
    return grid.length === 1 && grid[0].length === 1;
}

// ===== 入力検証 =====

/**
 * 型安全な入力検証
 */
function validateInput(grid: unknown): asserts grid is Grid {
    if (!isValidGrid(grid)) {
        throw new TypeError('Invalid grid: must be a 2D array of integers between 0-200');
    }
    
    const m = grid.length;
    const n = grid[0].length;
    
    if (m > CONSTRAINTS.MAX_DIMENSION || n > CONSTRAINTS.MAX_DIMENSION) {
        throw new RangeError(`Grid dimensions must not exceed ${CONSTRAINTS.MAX_DIMENSION}×${CONSTRAINTS.MAX_DIMENSION}`);
    }
}

// ===== メインアルゴリズム =====

/**
 * Minimum Path Sum の解決関数
 * @param grid - m×n の非負整数グリッド
 * @param options - アルゴリズムオプション
 * @returns 最小パス合計値
 * @throws {TypeError} 入力型エラー
 * @throws {RangeError} 制約違反エラー  
 * @complexity Time: O(m×n), Space: O(n)
 */
function minPathSum(
    grid: unknown, 
    options: AlgorithmOptions = {}
): number {
    // 1. 入力検証（型安全）
    if (options.validateInput !== false) {
        validateInput(grid);
    } else {
        // 最低限の型チェック
        if (!isValidGrid(grid)) {
            throw new TypeError('Invalid grid format');
        }
    }
    
    // 2. エッジケース処理（型ガード活用）
    if (isSingleCell(grid)) {
        return grid[0][0];
    }
    
    // 3. グリッド情報取得（型安全）
    const m: number = grid.length;
    const n: number = grid[0].length;
    
    // 4. 1D DP配列初期化（型明示でV8最適化）
    const dp: number[] = new Array<number>(n);
    
    // 5. 第1行の初期化（型安全なループ）
    dp[0] = grid[0][0];
    for (let j = 1; j < n; j++) {
        dp[j] = dp[j - 1] + grid[0][j];
    }
    
    // 6. メインアルゴリズム（型安全 + V8最適化）
    for (let i = 1; i < m; i++) {
        // 各行の左端: 上からのみ
        dp[0] += grid[i][0];
        
        // 各行の中間・右端: min(上, 左) + 現在値
        for (let j = 1; j < n; j++) {
            const fromTop: number = dp[j];
            const fromLeft: number = dp[j - 1];
            const current: number = grid[i][j];
            
            dp[j] = Math.min(fromTop, fromLeft) + current;
        }
    }
    
    return dp[n - 1];
}

// ===== 補助関数 =====

/**
 * 大きなグリッド生成（テスト用）
 */
function generateLargeGrid(m: number, n: number): number[][] {
    const grid: number[][] = new Array(m);
    for (let i = 0; i < m; i++) {
        grid[i] = new Array(n);
        for (let j = 0; j < n; j++) {
            grid[i][j] = Math.floor(Math.random() * 10) + 1;
        }
    }
    return grid;
}

// ===== テストケース =====

interface TestCase {
    readonly input: Grid;
    readonly expected: number;
    readonly description: string;
}

/**
 * テストケース定義（型安全）
 */
const testCases: readonly TestCase[] = [
    {
        input: [[1, 3, 1], [1, 5, 1], [4, 2, 1]] as const,
        expected: 7,
        description: "Example 1: 3×3 grid"
    },
    {
        input: [[1, 2, 3], [4, 5, 6]] as const,
        expected: 12,
        description: "Example 2: 2×3 grid"
    },
    {
        input: [[1]] as const,
        expected: 1,
        description: "Edge case: Single cell"
    },
    {
        input: [[1, 2], [1, 1]] as const,
        expected: 3,
        description: "Small case: 2×2 grid"
    }
] as const;

/**
 * 型安全なテスト実行
 */
function runTests(): void {
    console.log('=== TypeScript Minimum Path Sum Tests ===\n');
    
    for (let i = 0; i < testCases.length; i++) {
        const { input, expected, description }: TestCase = testCases[i];
        
        try {
            const result: number = minPathSum(input);
            const passed: boolean = result === expected;
            
            console.log(`Test ${i + 1}: ${description}`);
            console.log(`Input: ${JSON.stringify(input)}`);
            console.log(`Expected: ${expected}, Got: ${result}`);
            console.log(`Result: ${passed ? '✅ PASS' : '❌ FAIL'}\n`);
        } catch (error: unknown) {
            console.log(`Test ${i + 1}: ${description}`);
            console.log(`❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
        }
    }
}

/**
 * パフォーマンステスト
 */
function performanceTest(): void {
    console.log('=== TypeScript Performance Test ===');
    
    const sizes: readonly (readonly [number, number])[] = [
        [50, 50],
        [100, 100], 
        [200, 200]
    ] as const;
    
    for (const [m, n] of sizes) {
        const grid: number[][] = generateLargeGrid(m, n);
        
        const startTime: number = performance.now();
        const result: number = minPathSum(grid);
        const endTime: number = performance.now();
        
        const duration: string = (endTime - startTime).toFixed(2);
        console.log(`Grid ${m}×${n}: ${duration}ms, Result: ${result}`);
    }
}

/**
 * 型安全性テスト
 */
function typeSafetyTest(): void {
    console.log('=== TypeScript Type Safety Test ===');
    
    const invalidInputs: readonly unknown[] = [
        null,
        undefined,
        [],
        [[]],
        [[1, 2], [3]], // 不整合な行長
        [[1, -1]], // 範囲外の値
        [["1", "2"]], // 文字列
        [[1.5, 2.5]], // 小数
    ] as const;
    
    for (let i = 0; i < invalidInputs.length; i++) {
        try {
            minPathSum(invalidInputs[i]);
            console.log(`❌ Test ${i + 1}: Should have failed but passed`);
        } catch (error: unknown) {
            const message: string = error instanceof Error ? error.message : 'Unknown error';
            console.log(`✅ Test ${i + 1}: Correctly rejected - ${message}`);
        }
    }
}

// ===== エクスポート =====

export {
    minPathSum,
    validateInput,
    isValidGrid,
    runTests,
    performanceTest,
    typeSafetyTest,
    type Grid,
    type InputData,
    type AlgorithmOptions
};

// ===== 実行部分（モジュール環境での条件付き実行） =====

// Node.js環境での実行
if (typeof require !== 'undefined' && require.main === module) {
    runTests();
    performanceTest();
    typeSafetyTest();
}

// ブラウザ環境での実行
if (typeof window !== 'undefined') {
    runTests();
    performanceTest();
    typeSafetyTest();
}