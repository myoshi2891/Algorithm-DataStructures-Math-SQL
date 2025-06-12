import * as fs from 'fs';

// 標準入力の読み込み
const input = fs.readFileSync(0, 'utf8').trim().split('\n');

const N: number = parseInt(input[0]);
const A: number[] = input.slice(1).map(Number);

// 最大公約数（GCD）を求める関数（ユークリッドの互除法）
function gcd(a: number, b: number): number {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// 最小公倍数（LCM）を求める関数
function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
}

// 配列全体に対してLCMを求める
let result: number = A[0];
for (let i = 1; i < N; i++) {
    result = lcm(result, A[i]);
}

console.log(result);
