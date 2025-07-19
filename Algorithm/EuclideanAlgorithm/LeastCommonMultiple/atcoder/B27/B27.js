// 以下に、Node.js (`fs` モジュール使用) を用いて制限内で最小公倍数（LCM）を求める実装を提示します。

// ## ✅ 特徴

// * 入力: `fs.readFileSync("/dev/stdin", "utf8")`（AtCoderなどで利用可）
// * 最小公倍数計算: `LCM(a, b) = a / GCD(a, b) * b`（オーバーフロー対策済）
// * 使用アルゴリズム: **ユークリッドの互除法** によるGCD計算

// ---

// ### ✅ 実装コード（Node.js, JavaScript）

const fs = require("fs");

/**
 * 最小公倍数を求める関数
 * @param {bigint} a - 正整数 A
 * @param {bigint} b - 正整数 B
 * @returns {bigint} - aとbの最小公倍数（LCM）
 */
function lcm(a, b) {
    return (a / gcd(a, b)) * b;
}

/**
 * 最大公約数（GCD）をユークリッドの互除法で求める関数
 * @param {bigint} a - 整数 a
 * @param {bigint} b - 整数 b
 * @returns {bigint} - aとbの最大公約数
 */
function gcd(a, b) {
    while (b !== 0n) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// 入力読み込み
const input = fs.readFileSync("/dev/stdin", "utf8").trim().split(" ");
const A = BigInt(input[0]);
const B = BigInt(input[1]);

// 最小公倍数を出力
console.log(lcm(A, B).toString());

// ### ✅ 実行性能

// * **時間計算量**: O(log(min(A, B)))（ユークリッドの互除法）
// * **空間計算量**: O(1)
// * **BigInt**を用いることで **2^53 を超える範囲の整数にも対応**（例: `998244353 * 998244853`）

// ---

// ### ✅ サンプル入出力確認

// **入力:**

// ```
// 25 30
// ```

// **出力:**

// ```
// 150
// ```

// **入力:**

// ```
// 998244353 998244853
// ```

// **出力:**

// ```
// 996492287418565109
// ```
