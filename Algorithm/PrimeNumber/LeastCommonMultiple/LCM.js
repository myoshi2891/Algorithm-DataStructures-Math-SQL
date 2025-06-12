// 標準入力からの読み込み（Node.js用）
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split('\n');

const N = parseInt(input[0]);
const A = input.slice(1).map(Number);

// 最大公約数（GCD）を求める関数
function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

// 最小公倍数（LCM）を求める関数
function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

// 配列全体のLCMを計算
let result = A[0];
for (let i = 1; i < N; i++) {
    result = lcm(result, A[i]);
}

console.log(result);
