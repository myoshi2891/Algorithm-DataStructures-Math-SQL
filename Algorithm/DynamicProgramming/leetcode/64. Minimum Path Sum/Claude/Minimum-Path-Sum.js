// <!-- # Minimum Path Sum 解析

// ## 1. 問題分析結果

// ### 競技プログラミング視点
// - **制約**: m×n グリッド (最大200×200 = 40,000セル)
// - **必要計算量**: O(m×n) が最適（全セル1回ずつ訪問必須）
// - **メモリ**: O(n) で実現可能（1行分のDPテーブル）

// ### 業務開発視点  
// - **入力検証**: グリッドの妥当性チェック必須
// - **エラーハンドリング**: 不正な入力への対応
// - **可読性**: DPの状態遷移を明確に表現

// ### JavaScript特有分析
// - **V8最適化**: 数値配列の連続アクセスでキャッシュ効率良好
// - **GC負荷**: 新規配列生成を最小化すれば軽微
// - **配列操作**: インデックスアクセス中心で高速

// ## 2. アルゴリズム比較表

// |アプローチ|時間計算量|空間計算量|JS実装コスト|可読性|V8最適化|備考|
// |---------|----------|----------|-----------|------|---------|-----|
// |2D DP|O(m×n)|O(m×n)|低|★★★|適|最も直感的|
// |1D DP|O(m×n)|O(n)|中|★★☆|適|メモリ効率良好|
// |In-place|O(m×n)|O(1)|中|★☆☆|適|元配列を破壊|
// |DFS+memo|O(m×n)|O(m×n)|高|★☆☆|不適|再帰でスタックオーバーフロー懸念|

// ## 3. 採用アルゴリズムと根拠

// **選択**: **1D DP（1次元動的プログラミング）**

// **理由**:
// - 時間計算量 O(m×n) で最適
// - 空間計算量 O(n) でメモリ効率良好  
// - V8の配列最適化を活用可能
// - 業務開発での保守性も十分

// **JavaScript最適化戦略**:
// - `new Array(n).fill(0)` で初期化し型統一
// - インデックスアクセスでV8最適化促進
// - Math.min()でブランチ予測効率化

// ## 4. 実装詳細## 5. パフォーマンス考察

// ### 理論計算量
// - **時間**: O(m×n) - 各セルを1回ずつ処理
// - **空間**: O(n) - 1行分のDP配列のみ使用

// ### JavaScript実測予想
// - **V8最適化**: 数値配列の順次アクセスでL1キャッシュヒット率高
// - **200×200グリッド**: 約1-5ms で処理完了予想
// - **GC負荷**: 固定サイズ配列使用で最小限

// ### V8エンジン最適化ポイント

// 1. **型統一**: `new Array(n)` で数値配列として最適化
// 2. **インライン化**: `Math.min()` がV8で高速化
// 3. **ループ最適化**: 単純なfor文でブランチ予測効率化
// 4. **メモリ局所性**: 行ごとの連続アクセスでキャッシュ効率良好

// ### 改善余地

// 1. **In-place版**: 元配列破壊可能なら O(1) 空間実現
// 2. **SIMD活用**: 将来のJavaScript仕様でベクトル演算可能性
// 3. **Worker並列化**: 超大規模グリッドなら行分割並列処理

// ## 6. LeetCode提出形式

// ```javascript
// var minPathSum = function(grid) {
//     const m = grid.length;
//     const n = grid[0].length;
    
//     const dp = new Array(n);
//     dp[0] = grid[0][0];
    
//     for (let j = 1; j < n; j++) {
//         dp[j] = dp[j - 1] + grid[0][j];
//     }
    
//     for (let i = 1; i < m; i++) {
//         dp[0] += grid[i][0];
//         for (let j = 1; j < n; j++) {
//             dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
//         }
//     }
    
//     return dp[n - 1];
// };
// ```

// この実装は **O(m×n) 時間、O(n) 空間** で、V8エンジンの最適化を最大限活用しつつ、可読性と保守性も確保した効率的な解答です。
// エラーを修正します。テンプレートリテラル内での数値フォーマットに問題があります。修正点：
// - `${endTime - startTime:.2f}` → `${(endTime - startTime).toFixed(2)}`

// JavaScriptのテンプレートリテラル内では、Python風の `.2f` フォーマット指定子は使用できません。代わりに `.toFixed(2)` メソッドを使用して小数点以下2桁に丸めています。

// これでSyntaxErrorが解決され、コードが正常に動作するはずです。 -->

/**
 * Minimum Path Sum の解決関数
 * グリッド内で左上から右下への最小コストパスを求める
 * 
 * @param {number[][]} grid - m×n の非負整数グリッド
 * @returns {number} 最小パス合計値
 * @throws {TypeError} 入力型エラー
 * @throws {RangeError} 制約違反エラー  
 * @complexity Time: O(m×n), Space: O(n)
 */
function minPathSum(grid) {
    // 1. 入力検証
    validateInput(grid);
    
    const m = grid.length;
    const n = grid[0].length;
    
    // 2. エッジケース処理
    if (m === 1 && n === 1) {
        return grid[0][0];
    }
    
    // 3. 1D DP配列初期化（V8最適化: 事前サイズ確保）
    const dp = new Array(n);
    
    // 4. 第1行の初期化
    dp[0] = grid[0][0];
    for (let j = 1; j < n; j++) {
        dp[j] = dp[j - 1] + grid[0][j];
    }
    
    // 5. メインアルゴリズム（行ごとにDP更新）
    for (let i = 1; i < m; i++) {
        // 各行の左端: 上からのみ来れる
        dp[0] += grid[i][0];
        
        // 各行の中間・右端: min(上, 左) + 現在値
        for (let j = 1; j < n; j++) {
            dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
        }
    }
    
    return dp[n - 1];
}

/**
 * 入力検証ヘルパー
 * @param {any} grid - 検証対象
 */
function validateInput(grid) {
    // 基本的な型チェック
    if (!Array.isArray(grid) || grid.length === 0) {
        throw new TypeError('Grid must be a non-empty 2D array');
    }
    
    if (!Array.isArray(grid[0]) || grid[0].length === 0) {
        throw new TypeError('Grid rows must be non-empty arrays');
    }
    
    const m = grid.length;
    const n = grid[0].length;
    
    // 制約チェック
    if (m > 200 || n > 200) {
        throw new RangeError('Grid dimensions must not exceed 200×200');
    }
    
    // グリッド整合性チェック
    for (let i = 0; i < m; i++) {
        if (!Array.isArray(grid[i]) || grid[i].length !== n) {
            throw new TypeError('All grid rows must have the same length');
        }
        
        for (let j = 0; j < n; j++) {
            const val = grid[i][j];
            if (typeof val !== 'number' || val < 0 || val > 200 || !Number.isInteger(val)) {
                throw new RangeError(`Grid values must be integers between 0-200, got ${val} at [${i}][${j}]`);
            }
        }
    }
}

// ===== テストケース =====

/**
 * 解答をテストするための関数
 */
function runTests() {
    const testCases = [
        {
            input: [[1,3,1],[1,5,1],[4,2,1]], 
            expected: 7,
            description: "Example 1: 3×3 grid"
        },
        {
            input: [[1,2,3],[4,5,6]], 
            expected: 12,
            description: "Example 2: 2×3 grid"
        },
        {
            input: [[1]], 
            expected: 1,
            description: "Edge case: Single cell"
        },
        {
            input: [[1,2],[1,1]], 
            expected: 3,
            description: "Small case: 2×2 grid"
        }
    ];
    
    console.log('=== Minimum Path Sum Tests ===\n');
    
    for (let i = 0; i < testCases.length; i++) {
        const { input, expected, description } = testCases[i];
        
        try {
            const result = minPathSum(input);
            const passed = result === expected;
            
            console.log(`Test ${i + 1}: ${description}`);
            console.log(`Input: ${JSON.stringify(input)}`);
            console.log(`Expected: ${expected}, Got: ${result}`);
            console.log(`Result: ${passed ? '✅ PASS' : '❌ FAIL'}\n`);
        } catch (error) {
            console.log(`Test ${i + 1}: ${description}`);
            console.log(`❌ ERROR: ${error.message}\n`);
        }
    }
}

/**
 * パフォーマンステスト用の大きなグリッド生成
 */
function generateLargeGrid(m, n) {
    const grid = new Array(m);
    for (let i = 0; i < m; i++) {
        grid[i] = new Array(n);
        for (let j = 0; j < n; j++) {
            grid[i][j] = Math.floor(Math.random() * 10) + 1;
        }
    }
    return grid;
}

/**
 * パフォーマンス測定
 */
function performanceTest() {
    console.log('=== Performance Test ===');
    
    const sizes = [
        [50, 50],
        [100, 100], 
        [200, 200]
    ];
    
    for (const [m, n] of sizes) {
        const grid = generateLargeGrid(m, n);
        
        const startTime = performance.now();
        const result = minPathSum(grid);
        const endTime = performance.now();
        
        console.log(`Grid ${m}×${n}: ${(endTime - startTime).toFixed(2)}ms, Result: ${result}`);
    }
}

// テスト実行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { minPathSum, validateInput, runTests, performanceTest };
} else {
    // ブラウザ環境での実行
    runTests();
    performanceTest();
}