// JavaScriptを使用してLIS問題を解決します。Node.js環境でのファイル読み込みとパフォーマンス最適化に注意した実装を提供します。JavaScript版の解答の特徴を説明します：

// ## 主要な特徴

// ### 1. **Node.js fs モジュールの活用**
// - `fs.readFileSync()` を使用して標準入力またはファイルから同期的にデータを読み取り
// - エラーハンドリングを含む安全な実装

// ### 2. **パフォーマンス測定**
// - `process.hrtime.bigint()` で高精度な実行時間測定
// - `process.memoryUsage()` でメモリ使用量の監視
// - 開発環境でのみデバッグ情報を出力

// ### 3. **メモリ効率の最適化**
// - `new Array(n).fill(1)` で効率的な配列初期化
// - 不要な中間変数を避ける
// - ガベージコレクションを意識した実装

// ### 4. **型安全性とドキュメント**
// - JSDocを使用した詳細な型情報とコメント
// - 全ての関数にパラメーターと返却値の説明

// ## アルゴリズムの実装

// ### 基本版（O(n²)）
// - 問題の制約（n ≤ 5,000）に適した標準的なDP実装
// - 分かりやすく、デバッグしやすい

// ### 最適化版（O(n log n)）
// - より大きなデータセットに対応
// - 二分探索を使用した効率的な実装
// - 必要に応じて切り替え可能

// ## 使用方法

// ```bash
// # 標準入力から実行
// echo "5
// 100
// 102
// 101
// 91
// 199" | node solution.js

// # ファイルから実行
// node solution.js input.txt

// # デバッグ情報付きで実行
// NODE_ENV=development node solution.js
// ```

// ## メモリとパフォーマンスの配慮

// 1. **同期I/O使用**: 競技プログラミングでは通常同期処理が適切
// 2. **配列の事前確保**: `new Array(n).fill(1)` で効率的な初期化
// 3. **Math.max()の最適使用**: スプレッド演算子での配列展開
// 4. **エラーハンドリング**: 本番環境での安定動作を保証

// この実装は制約条件（n ≤ 5,000）において十分高速で、メモリ効率も良好です。

const fs = require('fs');

/**
 * 最長増加部分列の長さを求める関数
 * 
 * @param {number} n - 木の本数
 * @param {number[]} heights - 各木の高さの配列
 * @returns {number} 最長増加部分列の長さ（残せる木の最大本数）
 * 
 * 時間計算量: O(n^2)
 * 空間計算量: O(n)
 */
function longestIncreasingSubsequence(n, heights) {
    // dp[i] = i番目の木を最後とする増加部分列の最大長
    // 初期値は全て1（各木単体の部分列）
    const dp = new Array(n).fill(1);
    
    // 各木について、その木を最後とする最長増加部分列の長さを計算
    for (let i = 1; i < n; i++) {
        // i番目の木より前の全ての木をチェック
        for (let j = 0; j < i; j++) {
            // j番目の木の高さがi番目の木の高さより小さい場合
            if (heights[j] < heights[i]) {
                // j番目の木を最後とする部分列にi番目の木を追加
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    
    // 全てのdp値の中で最大値を返す
    return Math.max(...dp);
}

/**
 * 標準入力からデータを読み取り、パースする関数
 * 
 * @param {string} input - 標準入力の文字列
 * @returns {Object} パースされたデータオブジェクト
 * @returns {number} returns.n - 木の本数
 * @returns {number[]} returns.heights - 各木の高さの配列
 */
function parseInput(input) {
    // 改行で分割し、空行を除去
    const lines = input.trim().split('\n').filter(line => line.length > 0);
    
    // 最初の行から木の本数を取得
    const n = parseInt(lines[0], 10);
    
    // 残りの行から各木の高さを取得
    const heights = [];
    for (let i = 1; i <= n; i++) {
        heights.push(parseInt(lines[i], 10));
    }
    
    return { n, heights };
}

/**
 * メイン処理関数
 * ファイルから入力を読み取り、LIS問題を解き、結果を出力する
 * 
 * @param {string} inputPath - 入力ファイルのパス（省略時は標準入力）
 */
function main(inputPath = null) {
    try {
        // パフォーマンス測定開始
        const startTime = process.hrtime.bigint();
        const startMemory = process.memoryUsage();
        
        // 入力データの読み取り
        let input;
        if (inputPath) {
            // ファイルから読み取り
            input = fs.readFileSync(inputPath, 'utf8');
        } else {
            // 標準入力から読み取り（同期的に）
            input = fs.readFileSync(process.stdin.fd, 'utf8');
        }
        
        // 入力データのパース
        const { n, heights } = parseInput(input);
        
        // 最長増加部分列の長さを計算
        const result = longestIncreasingSubsequence(n, heights);
        
        // 結果を出力
        console.log(result);
        
        // パフォーマンス測定終了
        const endTime = process.hrtime.bigint();
        const endMemory = process.memoryUsage();
        
        // デバッグ情報（本番では削除）
        if (process.env.NODE_ENV === 'development') {
            const executionTime = Number(endTime - startTime) / 1_000_000; // ナノ秒をミリ秒に変換
            const memoryDiff = endMemory.heapUsed - startMemory.heapUsed;
            
            console.error(`実行時間: ${executionTime.toFixed(3)}ms`);
            console.error(`メモリ使用量差分: ${(memoryDiff / 1024 / 1024).toFixed(3)}MB`);
            console.error(`最大ヒープ使用量: ${(endMemory.heapUsed / 1024 / 1024).toFixed(3)}MB`);
        }
        
    } catch (error) {
        console.error('エラーが発生しました:', error.message);
        process.exit(1);
    }
}

/**
 * より効率的なLIS実装（O(n log n)）- 大きなデータセット用
 * 
 * @param {number} n - 木の本数
 * @param {number[]} heights - 各木の高さの配列
 * @returns {number} 最長増加部分列の長さ
 * 
 * 時間計算量: O(n log n)
 * 空間計算量: O(n)
 */
function longestIncreasingSubsequenceOptimized(n, heights) {
    // tails[i] = 長さi+1の増加部分列の末尾要素の最小値
    const tails = [];
    
    for (let i = 0; i < n; i++) {
        const height = heights[i];
        
        // 二分探索で挿入位置を見つける
        let left = 0;
        let right = tails.length;
        
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] < height) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        // 挿入または更新
        if (left === tails.length) {
            tails.push(height);
        } else {
            tails[left] = height;
        }
    }
    
    return tails.length;
}

// スクリプトが直接実行された場合のみmainを呼び出し
if (require.main === module) {
    // コマンドライン引数からファイルパスを取得（オプション）
    const inputPath = process.argv[2] || null;
    main(inputPath);
}

// エクスポート（テスト用）
module.exports = {
    longestIncreasingSubsequence,
    longestIncreasingSubsequenceOptimized,
    parseInput
};