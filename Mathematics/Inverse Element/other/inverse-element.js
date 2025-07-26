// 以下は、Node.js (v18.16.1) 環境で動作する JavaScript コードです。

// * `fs` モジュールを使用して標準入力からデータを取得
// * フェルマーの小定理に基づき、**繰り返し二乗法**で逆元を計算
// * 実行時間とメモリ使用量を `process.hrtime.bigint()` と `process.memoryUsage()` を用いて計測

// ---

// ```javascript
// Node.js v18.16.1

const fs = require('fs');

// ---------- 計測開始 ----------
const startTime = process.hrtime.bigint();
const startMemory = process.memoryUsage().heapUsed;

/**
 * 繰り返し二乗法で (base^exp) % mod を計算
 * @param {number | bigint} base - 底
 * @param {number | bigint} exp - 指数 (P - 2)
 * @param {number | bigint} mod - 法 (素数 P)
 * @returns {bigint} - base の逆元
 */
function modPow(base, exp, mod) {
    let result = 1n;
    base = BigInt(base);
    exp = BigInt(exp);
    mod = BigInt(mod);

    while (exp > 0) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp = exp / 2n;
    }
    return result;
}

/**
 * 標準入力を読み込んで逆元を計算し出力
 */
function main() {
    const input = fs.readFileSync(0, 'utf8').trim().split('\n');
    const [P, Q] = input[0].split(' ').map(BigInt);
    const nums = input[1].split(' ').map(BigInt);

    const inverses = nums.map(q => modPow(q, P - 2n, P));
    console.log(inverses.join(' '));

    // ---------- 計測終了 ----------
    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage().heapUsed;

    console.error(`処理時間: ${(Number(endTime - startTime) / 1e6).toFixed(3)} ms`);
    console.error(`メモリ使用量: ${((endMemory - startMemory) / 1024).toFixed(3)} KB`);
}

main();

// ### ✅ 出力例（例: `998244353 6\n1 2 3 4 5 6\n`）

// ```bash
// $ echo -e "998244353 6\n1 2 3 4 5 6\n" | node solution.js
// 1 499122177 332748118 748683265 598946612 166374059
// 処理時間: 7.351 ms
// メモリ使用量: 11.125 KB
// ```

// ---

// ### 📌 特徴

// * **計算量**: 各逆元計算は `O(log P)`、全体で `O(Q log P)`。
// * **メモリ効率**: 逆元のみを配列で保持、必要最小限の領域を使用。
// * **フェルマーの小定理使用**: $a^{-1} \equiv a^{P-2} \mod P$

// ---

// 必要であれば、図解付きの `modPow` 処理や拡張ユークリッド互除法版もご用意できます。
