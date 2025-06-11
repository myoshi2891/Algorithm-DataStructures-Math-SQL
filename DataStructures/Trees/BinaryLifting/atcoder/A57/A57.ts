import * as fs from 'fs';

// 入力処理
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\s+/);
let idx = 0;

const N = parseInt(input[idx++]);
const Q = parseInt(input[idx++]);
const A = input.slice(idx, idx + N).map((v) => parseInt(v) - 1); // 0-indexed
idx += N;

// 定数：最大ビット数（2^30 > 10^9）
const LOG = 30;

// doubling[k][i] := i番の穴から2^k日後にいる穴の番号
const doubling: number[][] = Array.from({ length: LOG }, () => Array(N).fill(0));

// 初期（1日後）
for (let i = 0; i < N; i++) {
    doubling[0][i] = A[i];
}

// ダブリング表作成：2^k 日後をすべて事前計算
for (let k = 1; k < LOG; k++) {
    for (let i = 0; i < N; i++) {
        doubling[k][i] = doubling[k - 1][doubling[k - 1][i]];
    }
}

const result: number[] = [];

for (let q = 0; q < Q; q++) {
    let x = parseInt(input[idx++]) - 1; // 0-indexed
    let y = parseInt(input[idx++]);

    for (let k = 0; k < LOG; k++) {
        if ((y >> k) & 1) {
            x = doubling[k][x];
        }
    }
    result.push(x + 1); // 1-indexedで戻す
}

console.log(result.join('\n'));
