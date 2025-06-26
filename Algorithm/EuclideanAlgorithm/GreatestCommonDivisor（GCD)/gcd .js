// 標準入力からデータを読み込む (Node.js 用)
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split('\n');

const N = parseInt(input[0], 10);
const A = input.slice(1, N + 1).map(Number);

// ユークリッドの互除法で2数の最大公約数を求める関数
function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// N個の数の最大公約数を求める
let result = A[0];
for (let i = 1; i < N; i++) {
    result = gcd(result, A[i]);
}

console.log(result);
