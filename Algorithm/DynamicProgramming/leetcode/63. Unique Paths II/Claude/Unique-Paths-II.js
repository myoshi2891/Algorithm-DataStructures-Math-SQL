// # JavaScript コーディング問題解析

// ## 1. 多角的問題分析

// ### 競技プログラミング視点
// - **問題の本質**: 障害物のあるグリッドでの経路数計算（Dynamic Programming）
// - **制約**: m,n ≤ 100 → O(mn) 解法で十分
// - **結果上限**: 2×10^9 → 32bit整数で対応可能

// ### 業務開発視点
// - **入力検証**: グリッドの妥当性チェック必須
// - **エラーハンドリング**: 不正な障害物配置への対応
// - **可読性**: DPテーブルの意味を明確化

// ### JavaScript特有考慮
// - **配列アクセス**: 2次元配列の効率的な操作
// - **数値計算**: 大きな値でもNumber型で安全
// - **メモリ使用**: 100×100程度なら問題なし

// ## 2. アルゴリズム比較表

// |アプローチ|時間計算量|空間計算量|JS実装コスト|可読性|V8最適化|備考|
// |---------|---------|---------|-----------|------|--------|-----|
// |2D DP|O(mn)|O(mn)|低|★★★|適|標準的解法|
// |1D DP|O(mn)|O(n)|中|★★☆|適|空間最適化版|
// |再帰+メモ化|O(mn)|O(mn)|高|★☆☆|不適|スタック深度問題|

// ## 3. JavaScript特有最適化ポイント

// ### V8エンジン最適化
// - **配列事前確保**: `new Array(rows).fill().map()` でHidden Class安定化
// - **インデックスアクセス**: `grid[i][j]` の直接アクセス
// - **条件分岐最小化**: 三項演算子活用

// ### GC負荷軽減
// - **プリミティブ値中心**: 数値のみの処理
// - **配列再利用**: DPテーブルの行単位更新

// ## 4. 実装## 5. 採用アルゴリズムと根拠

// ### 選択理由
// **1D Dynamic Programming（空間最適化版）**を主解法として採用

// - **計算量効率**: O(mn) 時間、O(n) 空間
// - **JavaScript適性**: 配列の行単位処理でV8最適化に適合
// - **実用性**: 制約範囲(100×100)で十分高速、メモリ効率も良好

// ### JavaScript最適化戦略
// 1. **配列事前確保**: `new Array(n).fill(0)` で型安定化
// 2. **インライン計算**: `dp[j] + dp[j-1]` の直接計算
// 3. **条件分岐最小化**: 障害物判定を最小限に抑制

// ### トレードオフ
// - **2D DP版**: 可読性は高いが空間計算量O(mn)
// - **再帰+メモ化**: 直感的だがJavaScriptのスタック制限で不適

// ## 6. パフォーマンス考察

// ### 理論計算量
// - **時間**: O(m×n) - 各セルを1回ずつ処理
// - **空間**: O(n) - 1行分のDPテーブルのみ保持

// ### JavaScript実測予想
// - **V8環境**: 100×100グリッドで1-2ms程度
// - **メモリ使用**: 約400byte（数値配列100要素）
// - **GC負荷**: 最小限（プリミティブ値中心）

// ### 改善余地
// - **更なる最適化**: インプレース更新による定数倍改善
// - **並列化**: Web Workersによる行並列処理（ただし制約サイズでは不要）
// - **型付き配列**: Uint32Arrayによる微細な性能向上

// この実装は競技プログラミングでの高速性と業務開発での保守性を両立し、JavaScript特有の最適化も考慮した実用的な解法です。

/**
 * 障害物のあるグリッドでのユニークパス数を計算
 * @param {number[][]} obstacleGrid - 障害物グリッド (0: 通路, 1: 障害物)
 * @returns {number} 到達可能なユニークパス数
 * @throws {TypeError} 入力型エラー
 * @throws {RangeError} 制約違反エラー
 * @complexity Time: O(m*n), Space: O(n) - 1D DP最適化版
 */
function uniquePathsWithObstacles(obstacleGrid) {
    // 1. 入力検証
    validateInput(obstacleGrid);
    
    const m = obstacleGrid.length;
    const n = obstacleGrid[0].length;
    
    // 2. エッジケース処理
    if (obstacleGrid[0][0] === 1 || obstacleGrid[m-1][n-1] === 1) {
        return 0; // スタート・ゴールが障害物
    }
    
    // 3. 1D DP実装（空間最適化）
    // dp[j] = 現在の行での列jまでの経路数
    const dp = new Array(n).fill(0);
    dp[0] = 1; // スタート地点
    
    for (let i = 0; i < m; i++) {
        // 各行の最初の列を処理
        if (obstacleGrid[i][0] === 1) {
            dp[0] = 0; // 障害物があれば到達不可
        }
        
        // 残りの列を処理
        for (let j = 1; j < n; j++) {
            if (obstacleGrid[i][j] === 1) {
                dp[j] = 0; // 障害物があれば0
            } else {
                dp[j] = dp[j] + dp[j-1]; // 上から + 左から
            }
        }
    }
    
    return dp[n-1];
}

/**
 * 2D DP実装（可読性重視版）
 * @param {number[][]} obstacleGrid - 障害物グリッド
 * @returns {number} ユニークパス数
 * @complexity Time: O(m*n), Space: O(m*n)
 */
function uniquePathsWithObstacles2D(obstacleGrid) {
    validateInput(obstacleGrid);
    
    const m = obstacleGrid.length;
    const n = obstacleGrid[0].length;
    
    // エッジケース
    if (obstacleGrid[0][0] === 1 || obstacleGrid[m-1][n-1] === 1) {
        return 0;
    }
    
    // DPテーブル初期化
    const dp = Array.from({length: m}, () => new Array(n).fill(0));
    
    // 初期化：最初の行と列
    dp[0][0] = 1;
    
    // 最初の行
    for (let j = 1; j < n; j++) {
        dp[0][j] = (obstacleGrid[0][j] === 1) ? 0 : dp[0][j-1];
    }
    
    // 最初の列
    for (let i = 1; i < m; i++) {
        dp[i][0] = (obstacleGrid[i][0] === 1) ? 0 : dp[i-1][0];
    }
    
    // メインのDP計算
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (obstacleGrid[i][j] === 1) {
                dp[i][j] = 0;
            } else {
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        }
    }
    
    return dp[m-1][n-1];
}

/**
 * 入力検証ヘルパー
 * @param {any} obstacleGrid - 検証対象
 * @throws {TypeError} 型エラー
 * @throws {RangeError} 制約エラー
 */
function validateInput(obstacleGrid) {
    // 基本型チェック
    if (!Array.isArray(obstacleGrid)) {
        throw new TypeError('obstacleGrid must be an array');
    }
    
    if (obstacleGrid.length === 0) {
        throw new RangeError('Grid must not be empty');
    }
    
    const m = obstacleGrid.length;
    const n = obstacleGrid[0].length;
    
    // 制約チェック
    if (m < 1 || m > 100 || n < 1 || n > 100) {
        throw new RangeError('Grid dimensions must be between 1 and 100');
    }
    
    // グリッド内容チェック
    for (let i = 0; i < m; i++) {
        if (!Array.isArray(obstacleGrid[i]) || obstacleGrid[i].length !== n) {
            throw new TypeError('All rows must be arrays of same length');
        }
        
        for (let j = 0; j < n; j++) {
            const val = obstacleGrid[i][j];
            if (val !== 0 && val !== 1) {
                throw new RangeError('Grid values must be 0 or 1');
            }
        }
    }
}

// テストケース実行
function runTests() {
    const testCases = [
        {
            input: [[0,0,0],[0,1,0],[0,0,0]],
            expected: 2,
            description: "Example 1: 3x3 grid with middle obstacle"
        },
        {
            input: [[0,1],[0,0]],
            expected: 1,
            description: "Example 2: 2x2 grid with top-right obstacle"
        },
        {
            input: [[1]],
            expected: 0,
            description: "Edge case: Start point blocked"
        },
        {
            input: [[0,0],[1,0]],
            expected: 0,
            description: "Edge case: End point blocked"
        },
        {
            input: [[0]],
            expected: 1,
            description: "Edge case: Single cell, no obstacle"
        }
    ];
    
    console.log("=== テスト実行結果 ===");
    testCases.forEach((test, index) => {
        const result1D = uniquePathsWithObstacles(test.input);
        const result2D = uniquePathsWithObstacles2D(test.input);
        const passed = result1D === test.expected && result2D === test.expected;
        
        console.log(`Test ${index + 1}: ${passed ? "✓ PASS" : "✗ FAIL"}`);
        console.log(`  ${test.description}`);
        console.log(`  Input: ${JSON.stringify(test.input)}`);
        console.log(`  Expected: ${test.expected}, Got: 1D=${result1D}, 2D=${result2D}`);
        console.log();
    });
}

// パフォーマンステスト
function performanceTest() {
    // 大きなグリッドでのテスト
    const createGrid = (m, n, obstacleRate = 0.1) => {
        const grid = Array.from({length: m}, () => new Array(n));
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                grid[i][j] = (Math.random() < obstacleRate) ? 1 : 0;
            }
        }
        grid[0][0] = 0; // スタート確保
        grid[m-1][n-1] = 0; // ゴール確保
        return grid;
    };
    
    const testGrid = createGrid(100, 100);
    
    console.log("=== パフォーマンステスト ===");
    
    // 1D DP版
    const start1D = Date.now();
    const result1D = uniquePathsWithObstacles(testGrid);
    const time1D = Date.now() - start1D;
    
    // 2D DP版
    const start2D = Date.now();
    const result2D = uniquePathsWithObstacles2D(testGrid);
    const time2D = Date.now() - start2D;
    
    console.log(`1D DP版: ${time1D}ms, Result: ${result1D}`);
    console.log(`2D DP版: ${time2D}ms, Result: ${result2D}`);
    console.log(`空間効率改善: ${((testGrid.length * testGrid[0].length * 4 - testGrid[0].length * 4) / 1024).toFixed(2)}KB削減`);
}

// 実行
runTests();
performanceTest();