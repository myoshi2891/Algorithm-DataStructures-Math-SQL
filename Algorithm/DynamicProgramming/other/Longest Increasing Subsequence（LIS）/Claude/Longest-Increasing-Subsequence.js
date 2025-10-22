// この問題を動的プログラミング（DP）を使って解決するJavaScriptコードを作成します。このJavaScriptコードは以下の特徴を持っています：

// ## アルゴリズムの説明

// 1. **動的プログラミング（DP）アプローチ**：
//    - `dp[i]` = 人iが右端となる背の順区間の最長長さ
//    - 各人について、前の人との身長比較で区間を延長するか新規開始するかを決定

// 2. **時間計算量**：O(n) - 配列を一度だけ走査
// 3. **空間計算量**：O(n) - heights配列とdp配列のみ使用

// ## パフォーマンスの配慮

// - `fs.readFileSync`で同期的に入力を読み取り、メモリ効率を重視
// - 不要な処理を避け、シンプルな配列操作のみ使用
// - `Math.max(...dp.slice(1))`で最大値を効率的に取得

// ## 関数の役割

// - `findLongestNonDecreasingSequence(input)`: 入力文字列から最長背の順区間を計算
// - `main()`: 標準入力/出力の処理とエラーハンドリング

// 入力例1（5人、身長：160, 178, 170, 190, 190）の場合：
// - dp = [0, 1, 2, 1, 2, 3]
// - 最大値は3（170→190→190の区間）

// このコードはn≦200,000の制約下でも効率的に動作します。

const fs = require('fs');

/**
 * 標準入力から文字列を読み取り、背の順区間の最長長さを計算する
 * @param {string} input - 標準入力の文字列
 * @returns {number} 背の順であるような区間のうち、最長であるものの長さ
 */
function findLongestNonDecreasingSequence(input) {
    const lines = input.trim().split('\n');
    const n = parseInt(lines[0]);

    // 身長データを配列に格納（1-indexedで扱うため先頭に0を追加）
    const heights = [0]; // heights[0]は使用しない
    for (let i = 1; i <= n; i++) {
        heights.push(parseInt(lines[i]));
    }

    // dp[i] = 人iが右端となる背の順区間の最長長さ
    const dp = new Array(n + 1);
    dp[1] = 1; // 最初の人は長さ1の区間

    // 動的プログラミングでdp配列を計算
    for (let i = 2; i <= n; i++) {
        if (heights[i - 1] <= heights[i]) {
            // 前の人の身長以上なら、前の区間に追加できる
            dp[i] = dp[i - 1] + 1;
        } else {
            // 前の人より身長が低いなら、新しい区間の開始
            dp[i] = 1;
        }
    }

    // dp配列の最大値を求める
    return Math.max(...dp.slice(1));
}

/**
 * メイン処理関数
 * 標準入力を読み取り、結果を標準出力に出力する
 */
function main() {
    try {
        // 標準入力を同期的に読み取り
        const input = fs.readFileSync('/dev/stdin', 'utf8');

        // 最長の背の順区間の長さを計算
        const result = findLongestNonDecreasingSequence(input);

        // 結果を出力
        console.log(result);
    } catch (error) {
        console.error('Error reading input:', error);
        process.exit(1);
    }
}

// メイン処理を実行
main();
