import * as fs from 'fs';

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, Q] = input[0].split(' ').map(Number);
const S = input[1];
const queries = input.slice(2).map((line) => line.split(' ').map(Number));

// 定数
const MOD = 10n ** 9n + 7n;
const BASE = 31n;

// 1文字ずつ数値化してハッシュ計算
const hash: bigint[] = Array(N + 1).fill(0n);
const power: bigint[] = Array(N + 1).fill(1n);

// 前計算: prefix hash & power
for (let i = 0; i < N; i++) {
    const code = BigInt(S.charCodeAt(i) - 97 + 1); // 'a'→1, 'b'→2, ...
    hash[i + 1] = (hash[i] * BASE + code) % MOD;
    power[i + 1] = (power[i] * BASE) % MOD;
}

// 区間[l, r]のハッシュを取得（1-indexed）
function getHash(l: number, r: number): bigint {
    const raw = hash[r] - ((hash[l - 1] * power[r - l + 1]) % MOD);
    return (raw + MOD) % MOD; // 負にならないように調整
}

const result: string[] = [];
for (const [a, b, c, d] of queries) {
    result.push(getHash(a, b) === getHash(c, d) ? 'Yes' : 'No');
}

console.log(result.join('\n'));
