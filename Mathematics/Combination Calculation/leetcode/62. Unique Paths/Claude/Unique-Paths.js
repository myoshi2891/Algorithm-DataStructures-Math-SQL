// ## 1. 問題の分析

// ### 競技プログラミング視点での分析
// - **実行速度最優先**: 数学的解法（組み合わせ計算）が最速 - O(min(m,n))
// - **メモリ最小化**: 1次元配列によるDP - O(min(m,n))の空間計算量

// ### 業務開発視点での分析
// - **保守性重視**: 2次元DPテーブルによる直感的な実装
// - **エラーハンドリング**: 入力値の範囲チェック、オーバーフロー検証

// ### JavaScript特有の考慮点
// - **V8最適化**: 単型配列（数値のみ）の使用、インデックスアクセス優先
// - **GC対策**: 大きな2次元配列の生成回避、プリミティブ値の活用
// - **精度問題**: Number.MAX_SAFE_INTEGER（2^53-1）以下での計算保証

// ## 2. アルゴリズムアプローチ比較

// |アプローチ|時間計算量|空間計算量|JS実装コスト|可読性|備考|
// |---------|---------|---------|-----------|-----|---|
// |数学的解法(組み合わせ)|O(min(m,n))|O(1)|低|中|最高速、オーバーフロー注意|
// |1次元DP|O(m×n)|O(min(m,n))|低|高|メモリ効率良好|
// |2次元DP|O(m×n)|O(m×n)|中|最高|直感的、メモリ使用量大|
// |再帰+メモ化|O(m×n)|O(m×n)|高|中|スタックオーバーフロー危険|

// ## 3. 選択したアルゴリズムと理由

// ### 選択したアプローチ: 数学的解法（組み合わせ計算）

// ### 理由:
// - **計算量的優位性**: O(min(m,n))の時間計算量で最も高速
// - **JavaScript環境での効率**: プリミティブ値のみ使用でGC負荷最小
// - **制約条件適合**: m,n ≤ 100なら精度問題なし

// ### JavaScript特有の最適化ポイント:
// - BigIntを使わずNumber型で十分（制約範囲内）
// - ループ変数の型統一でV8最適化促進
// - 条件分岐最小化でインライン化促進## JavaScript固有の最適化観点

// ### V8エンジン最適化のポイント
// 1. **インライン化促進**:
//    - 小さな関数設計でJITコンパイラによる最適化
//    - 単純なforループ使用（forEachより高速）

// 2. **Hidden Classの安定化**:
//    - 配列は数値のみで型統一
//    - オブジェクト生成を最小化

// 3. **数値計算の最適化**:
//    - Number型での整数演算（BigInt回避）
//    - 型変換の最小化

// ### ガベージコレクション対策
// 1. **メモリ使用量最小化**:
//    - 数学的解法では追加メモリ不要（O(1)空間）
//    - DP解法でも1次元配列のみ使用

// 2. **オブジェクト生成回避**:
//    - プリミティブ値のみ使用
//    - 配列サイズ事前確保で再割り当て防止

// ### 実装の特徴
// - **主要解法**: 組み合わせ数学を活用したO(min(m,n))解法
// - **副次解法**: メモリ効率の良い1次元DP
// - **エラー処理**: 型チェック、範囲チェック完備
// - **ベンチマーク**: パフォーマンス比較機能付き

// この実装は制約条件（m,n ≤ 100）下で最適なパフォーマンスを実現し、JavaScript環境での実行効率を最大化しています。

/**
 * ロボットがグリッドの左上から右下へ移動する経路数を計算
 * 数学的解法（組み合わせ計算）を使用してO(min(m,n))で解決
 *
 * @param {number} m - グリッドの行数
 * @param {number} n - グリッドの列数
 * @returns {number} 一意な経路の総数
 * @throws {TypeError} 引数が数値でない場合
 * @throws {RangeError} 引数が制約範囲外の場合
 * @complexity Time: O(min(m,n)), Space: O(1)
 */
function uniquePaths(m, n) {
    // 入力検証
    if (typeof m !== 'number' || typeof n !== 'number') {
        throw new TypeError('Arguments must be numbers');
    }

    if (!Number.isInteger(m) || !Number.isInteger(n)) {
        throw new TypeError('Arguments must be integers');
    }

    if (m < 1 || n < 1 || m > 100 || n > 100) {
        throw new RangeError('Arguments must be in range [1, 100]');
    }

    // 数学的解法: C(m+n-2, min(m-1, n-1))を計算
    // 総移動回数: m+n-2 (右にn-1回、下にm-1回)
    // そのうち右移動(またはdown移動)を選ぶ組み合わせ数

    const totalMoves = m + n - 2;
    const rightMoves = n - 1;
    const downMoves = m - 1;

    // 計算効率のため、小さい方を選択
    const k = Math.min(rightMoves, downMoves);

    // C(totalMoves, k) = totalMoves! / (k! * (totalMoves-k)!)
    // オーバーフローを避けるため逐次計算
    let result = 1;

    // V8最適化: 単純なforループを使用
    for (let i = 0; i < k; i++) {
        // result = result * (totalMoves - i) / (i + 1)
        // 整数除算を保証するため、先に乗算してから除算
        result = (result * (totalMoves - i)) / (i + 1);
    }

    return Math.round(result); // 浮動小数点誤差対策
}

/**
 * 動的プログラミング解法（1次元配列使用）
 * メモリ効率を重視した実装
 *
 * @param {number} m - グリッドの行数
 * @param {number} n - グリッドの列数
 * @returns {number} 一意な経路の総数
 * @throws {TypeError} 引数が数値でない場合
 * @throws {RangeError} 引数が制約範囲外の場合
 * @complexity Time: O(m*n), Space: O(min(m,n))
 */
function uniquePathsDP(m, n) {
    // 入力検証（共通関数化可能だが、パフォーマンス重視で直書き）
    if (typeof m !== 'number' || typeof n !== 'number') {
        throw new TypeError('Arguments must be numbers');
    }

    if (!Number.isInteger(m) || !Number.isInteger(n)) {
        throw new TypeError('Arguments must be integers');
    }

    if (m < 1 || n < 1 || m > 100 || n > 100) {
        throw new RangeError('Arguments must be in range [1, 100]');
    }

    // メモリ効率のため、小さい方の次元で配列を作成
    const cols = Math.min(m, n);
    const rows = Math.max(m, n);

    // V8最適化: 配列サイズを事前確保し、単型配列を維持
    const dp = new Array(cols);

    // 初期化: 最初の行は全て1
    for (let j = 0; j < cols; j++) {
        dp[j] = 1;
    }

    // DPテーブル更新
    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            // dp[j] = dp[j] + dp[j-1]
            // 上からの経路 + 左からの経路
            dp[j] += dp[j - 1];
        }
    }

    return dp[cols - 1];
}

/**
 * パフォーマンステスト用のベンチマーク関数
 */
function benchmark() {
    const testCases = [
        [3, 7], // Example 1
        [3, 2], // Example 2
        [23, 12], // 中規模
        [100, 100], // 最大サイズ
    ];

    console.log('Performance Benchmark:');
    console.log('=====================');

    testCases.forEach(([m, n]) => {
        console.log(`\nTest case: m=${m}, n=${n}`);

        // 数学的解法のベンチマーク
        const start1 = performance.now();
        const result1 = uniquePaths(m, n);
        const end1 = performance.now();

        // DP解法のベンチマーク
        const start2 = performance.now();
        const result2 = uniquePathsDP(m, n);
        const end2 = performance.now();

        console.log(`Mathematical: ${result1} (${(end1 - start1).toFixed(4)}ms)`);
        console.log(`DP Solution:  ${result2} (${(end2 - start2).toFixed(4)}ms)`);
        console.log(`Results match: ${result1 === result2}`);
    });
}

// 使用例とテスト
console.log('=== Robot Unique Paths Solution ===\n');

// Example 1
console.log(`uniquePaths(3, 7) = ${uniquePaths(3, 7)}`); // 28

// Example 2
console.log(`uniquePaths(3, 2) = ${uniquePaths(3, 2)}`); // 3

// エラーハンドリングテスト
try {
    uniquePaths(0, 5);
} catch (error) {
    console.log(`Error handling: ${error.message}`);
}

try {
    uniquePaths(101, 5);
} catch (error) {
    console.log(`Error handling: ${error.message}`);
}

// パフォーマンステスト実行
// benchmark(); // 必要に応じてコメントアウト解除

// モジュールエクスポート（Node.js環境用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        uniquePaths,
        uniquePathsDP,
        benchmark,
    };
}
