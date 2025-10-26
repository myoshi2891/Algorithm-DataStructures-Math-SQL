/**
 * いもす法を用いて、長方形加算後の最大値を求める関数
 *
 * @param {string} input 標準入力から読み込んだ文字列
 * @returns {number} 最大値
 * @throws {TypeError} 入力が不正な場合
 * @throws {RangeError} 入力値が制約範囲外の場合
 *
 * 計算量: O(N*M + K)
 */
function imosMaxValue(input) {
    if (typeof input !== 'string') {
        throw new TypeError('Input must be a string');
    }
    const lines = input.trim().split('\n');
    if (lines.length < 2) {
        throw new TypeError('Invalid input format');
    }

    const [N, M, K] = lines[0].trim().split(/\s+/).map(Number);
    if (![N, M, K].every(Number.isInteger)) {
        throw new TypeError('N, M, K must be integers');
    }
    if (N < 2 || N > 10 || M < 2 || M > 10 || K < 1 || K > 10) {
        throw new RangeError('N, M, K out of range');
    }

    // 配列サイズは +2 して番兵を作る
    const grid = Array.from({ length: N + 2 }, () => Array(M + 2).fill(0));

    for (let i = 1; i <= K; i++) {
        if (!lines[i]) throw new TypeError('Missing rectangle definition');
        const [a, b, c, d] = lines[i].trim().split(/\s+/).map(Number);
        if (![a, b, c, d].every(Number.isInteger)) {
            throw new TypeError('Rectangle values must be integers');
        }
        if (!(1 <= a && a <= c && c <= M) || !(1 <= b && b <= d && d <= N)) {
            throw new RangeError('Rectangle coordinates out of range');
        }

        // いもす法の差分加算
        grid[b][a] += 1;
        grid[b][c + 1] -= 1;
        grid[d + 1][a] -= 1;
        grid[d + 1][c + 1] += 1;
    }

    // 横方向累積和
    for (let y = 1; y <= N; y++) {
        for (let x = 1; x <= M; x++) {
            grid[y][x] += grid[y][x - 1];
        }
    }

    // 縦方向累積和
    for (let x = 1; x <= M; x++) {
        for (let y = 1; y <= N; y++) {
            grid[y][x] += grid[y - 1][x];
        }
    }

    // 最大値探索
    let maxVal = -Infinity;
    for (let y = 1; y <= N; y++) {
        for (let x = 1; x <= M; x++) {
            if (grid[y][x] > maxVal) {
                maxVal = grid[y][x];
            }
        }
    }

    return maxVal;
}

// 実行部
const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
console.log(imosMaxValue(input));

module.exports = { imosMaxValue };
