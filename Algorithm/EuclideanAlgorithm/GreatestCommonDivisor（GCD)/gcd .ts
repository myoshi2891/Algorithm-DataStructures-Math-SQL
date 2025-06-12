// 標準入力からデータを読み込む (Node.js 用)
import * as fs from 'fs';

const input: string[] = fs.readFileSync(0, 'utf8').trim().split('\n');

const N: number = parseInt(input[0], 10);
const A: number[] = input.slice(1, N + 1).map(Number);

// ユークリッドの互除法で2数の最大公約数を求める関数
function gcd(a: number, b: number): number {
    while (b !== 0) {
        const temp: number = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// N個の数の最大公約数を求める
let result: number = A[0];
for (let i = 1; i < N; i++) {
    result = gcd(result, A[i]);
}

console.log(result);
