const input = require('fs').readFileSync('/dev/stdin', 'utf-8').trim().split(/\s+/);
let idx = 0;

const N = parseInt(input[idx++]);
const Q = parseInt(input[idx++]);

const A = input.slice(idx, idx + N).map((v) => parseInt(v) - 1); // 0-indexed
idx += N;

const LOG = 30; // 2^30 > 10^9

// doubling[k][i]: 穴 i から 2^k 日後にいる穴
const doubling = Array.from({ length: LOG }, () => Array(N).fill(0));

// 初期化（1日後）
for (let i = 0; i < N; i++) {
    doubling[0][i] = A[i];
}

// ダブリングの事前計算
for (let k = 1; k < LOG; k++) {
    for (let i = 0; i < N; i++) {
        doubling[k][i] = doubling[k - 1][doubling[k - 1][i]];
    }
}

const result = [];

for (let q = 0; q < Q; q++) {
    let x = parseInt(input[idx++]) - 1; // 0-indexed
    let y = parseInt(input[idx++]);

    for (let k = 0; k < LOG; k++) {
        if ((y >> k) & 1) {
            x = doubling[k][x];
        }
    }
    result.push(x + 1); // back to 1-indexed
}

console.log(result.join('\n'));
