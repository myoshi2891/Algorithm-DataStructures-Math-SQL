// はい、その方法は非常に効果的です！ダブリング法（Binary Lifting）を使った解法は、この問題に対して理論的に最適なアプローチの一つです。## ダブリング法の利点

// ### 1. **時間計算量の大幅改善**
// - **従来**: O(N × K) - 各数値に対してK回操作
// - **ダブリング**: O(N × log K) - 各数値に対してlog K回の操作

// ### 2. **前処理の効率性**
// - **前処理時間**: O(N × log K)
// - **各クエリ**: O(log K)
// - **総時間**: O(N × log K)

// ### 3. **メモリ効率**
// - **使用メモリ**: O(N × log K)
// - **実際の制約**: N ≤ 300,000, K ≤ 10^9 なので log K ≈ 30

// ## アルゴリズムの動作原理

// 1. **事前計算**:
//    - `jump[0][i]` = i から1回操作後の値
//    - `jump[1][i]` = i から2回操作後の値
//    - `jump[2][i]` = i から4回操作後の値
//    - ...
//    - `jump[bit][i]` = i から2^bit回操作後の値

// 2. **クエリ処理**:
//    - K を二進表現に分解
//    - 例：K=13 = 8+4+1 = 2³+2²+2⁰
//    - jump[3], jump[2], jump[0] を順次適用

// ### 3. **特別な最適化**
// - **小さなK**: 直接計算の方が高速（K ≤ 100）
// - **範囲外処理**: 事前計算範囲外は直接計算にフォールバック
// - **メモリ制限**: 適切な上限設定でメモリ使用量を制御

// この実装により、**理論上最適な時間計算量 O(N log K)** を実現し、TLE問題を根本的に解決できるはずです。

const fs = require('fs');

/**
 * 数値の各桁の和を計算する関数
 * @param {number} n - 対象の数値
 * @returns {number} 各桁の数字の和
 */
function getDigitSum(n) {
    let sum = 0;
    while (n > 0) {
        sum += n % 10;
        n = Math.floor(n / 10);
    }
    return sum;
}

/**
 * 一回の操作を行う関数（数値から各桁の和を引く）
 * @param {number} n - 対象の数値
 * @returns {number} 操作後の数値
 */
function performOperation(n) {
    return n - getDigitSum(n);
}

/**
 * ダブリング法（Binary Lifting）を使用した高速解法
 * @param {string} input - 入力文字列
 * @returns {string} 出力文字列
 */
function solveWithBinaryLifting(input) {
    const lines = input.trim().split('\n');
    const [N, K] = lines[0].split(' ').map(Number);

    if (K === 0) {
        const results = [];
        for (let i = 1; i <= N; i++) {
            results.push(i.toString());
        }
        return results.join('\n');
    }

    // ダブリング用のテーブルサイズを計算（log2(K) + 1）
    const maxBit = Math.ceil(Math.log2(K + 1));

    // next[i] = i から1回操作後の値
    const next = new Array(N + 1);
    for (let i = 0; i <= N; i++) {
        next[i] = performOperation(i);
    }

    // ダブリング用テーブル: jump[bit][i] = i から 2^bit 回操作後の値
    const jump = new Array(maxBit + 1);
    for (let bit = 0; bit <= maxBit; bit++) {
        jump[bit] = new Array(N + 1);
    }

    // 初期化: jump[0][i] = next[i] (2^0 = 1回操作後)
    for (let i = 0; i <= N; i++) {
        jump[0][i] = next[i];
    }

    // ダブリング前処理: jump[bit][i] = jump[bit-1][jump[bit-1][i]]
    for (let bit = 1; bit <= maxBit; bit++) {
        for (let i = 0; i <= N; i++) {
            const intermediate = jump[bit - 1][i];
            if (intermediate <= N && intermediate >= 0) {
                jump[bit][i] = jump[bit - 1][intermediate];
            } else {
                // 範囲外の場合は直接計算
                jump[bit][i] = intermediate;
            }
        }
    }

    /**
     * ダブリング法でK回操作後の値を計算
     * @param {number} start - 開始値
     * @param {number} k - 操作回数
     * @returns {number} K回操作後の値
     */
    function queryWithBinaryLifting(start, k) {
        let current = start;
        let remaining = k;

        for (let bit = 0; bit <= maxBit && remaining > 0; bit++) {
            if (remaining & (1 << bit)) {
                if (current <= N && current >= 0) {
                    current = jump[bit][current];
                } else {
                    // 範囲外の場合は直接計算
                    const stepsToTake = 1 << bit;
                    for (let step = 0; step < stepsToTake && remaining > 0; step++) {
                        current = performOperation(current);
                        remaining--;
                    }
                    remaining += (1 << bit) - stepsToTake;
                }
                remaining -= 1 << bit;
            }
        }

        return current;
    }

    // 各数値について結果を計算
    const results = [];
    for (let i = 1; i <= N; i++) {
        results.push(queryWithBinaryLifting(i, K).toString());
    }

    return results.join('\n');
}

/**
 * メモリ効率を改善した版（大きなNに対応）
 * @param {string} input - 入力文字列
 * @returns {string} 出力文字列
 */
function solveOptimizedBinaryLifting(input) {
    const lines = input.trim().split('\n');
    const [N, K] = lines[0].split(' ').map(Number);

    if (K === 0) {
        const results = [];
        for (let i = 1; i <= N; i++) {
            results.push(i.toString());
        }
        return results.join('\n');
    }

    const maxBit = Math.ceil(Math.log2(K + 1));

    // より効率的なアプローチ：必要な範囲のみ事前計算
    const maxPrecompute = Math.min(N, 1000000); // メモリ制限を考慮

    // next配列の計算
    const next = new Array(maxPrecompute + 1);
    for (let i = 0; i <= maxPrecompute; i++) {
        next[i] = performOperation(i);
    }

    // ダブリング用テーブル（スパースに構築）
    const jump = {};

    // bit=0の初期化
    jump[0] = next.slice();

    // ダブリング前処理
    for (let bit = 1; bit <= maxBit; bit++) {
        jump[bit] = new Array(maxPrecompute + 1);
        for (let i = 0; i <= maxPrecompute; i++) {
            const intermediate = jump[bit - 1][i];
            if (intermediate <= maxPrecompute && intermediate >= 0) {
                jump[bit][i] = jump[bit - 1][intermediate];
            } else {
                jump[bit][i] = intermediate; // 範囲外はそのまま
            }
        }
    }

    /**
     * 最適化されたクエリ関数
     * @param {number} start - 開始値
     * @param {number} k - 操作回数
     * @returns {number} K回操作後の値
     */
    function optimizedQuery(start, k) {
        let current = start;
        let remaining = k;

        while (remaining > 0) {
            if (current <= maxPrecompute && current >= 0) {
                // 事前計算済みの範囲内
                for (let bit = maxBit; bit >= 0; bit--) {
                    if (remaining >= 1 << bit) {
                        current = jump[bit][current];
                        remaining -= 1 << bit;
                        break;
                    }
                }
            } else {
                // 範囲外は直接計算
                current = performOperation(current);
                remaining--;
            }

            // 無限ループ防止
            if (current < 0) break;
        }

        return current;
    }

    // 結果計算
    const results = [];
    for (let i = 1; i <= N; i++) {
        results.push(optimizedQuery(i, K).toString());
    }

    return results.join('\n');
}

/**
 * 最終最適化版（hybrid approach）
 * @param {string} input - 入力文字列
 * @returns {string} 出力文字列
 */
function solveFinal(input) {
    const lines = input.trim().split('\n');
    const [N, K] = lines[0].split(' ').map(Number);

    if (K === 0) {
        const results = [];
        for (let i = 1; i <= N; i++) {
            results.push(i.toString());
        }
        return results.join('\n');
    }

    // K が小さい場合は直接計算
    if (K <= 100) {
        const results = [];
        for (let i = 1; i <= N; i++) {
            let current = i;
            for (let j = 0; j < K; j++) {
                current = performOperation(current);
            }
            results.push(current.toString());
        }
        return results.join('\n');
    }

    // ダブリング法を使用
    const maxBit = Math.ceil(Math.log2(K + 1));
    const maxVal = Math.min(N * 2, 1000000); // 適切な上限設定

    // 次の値の事前計算
    const next = new Array(maxVal + 1);
    for (let i = 0; i <= maxVal; i++) {
        next[i] = performOperation(i);
    }

    // ダブリング用テーブル
    const table = new Array(maxBit + 1);
    table[0] = next;

    for (let bit = 1; bit <= maxBit; bit++) {
        table[bit] = new Array(maxVal + 1);
        for (let i = 0; i <= maxVal; i++) {
            const intermediate = table[bit - 1][i];
            if (intermediate >= 0 && intermediate <= maxVal) {
                table[bit][i] = table[bit - 1][intermediate];
            } else {
                table[bit][i] = intermediate;
            }
        }
    }

    // クエリ処理
    function query(start, k) {
        let current = start;
        let remaining = k;

        for (let bit = 0; bit <= maxBit && remaining > 0; bit++) {
            if (remaining & (1 << bit)) {
                if (current >= 0 && current <= maxVal) {
                    current = table[bit][current];
                } else {
                    // 直接計算フォールバック
                    for (let step = 0; step < 1 << bit && remaining > 0; step++) {
                        current = performOperation(current);
                        remaining--;
                    }
                    remaining += 1 << bit;
                }
                remaining -= 1 << bit;
            }
        }

        return current;
    }

    const results = [];
    for (let i = 1; i <= N; i++) {
        results.push(query(i, K).toString());
    }

    return results.join('\n');
}

// メイン実行
function main() {
    try {
        const input = fs.readFileSync('/dev/stdin', 'utf8');
        const output = solveFinal(input);
        console.log(output);
    } catch (error) {
        // テスト用
        const sampleInput = '10 1';
        const output = solveFinal(sampleInput);
        console.log('サンプル出力:');
        console.log(output);
    }
}

main();
