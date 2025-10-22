// 先ほどの **BigInt + 二重ハッシュ** アルゴリズムを TypeScript に移植し、型定義と関数コメントを付けた実装を作成します。
// 要求通り `fs` を使って入力処理を行い、処理時間とメモリ使用量を stderr に出力します。

// ---

// ```typescript
// TypeScript 5.1 / Node.js 18.16.1
// fs を用いた高速入力 + BigInt二重ハッシュによる回文判定
// 実行方法: ts-node index.ts < input.txt

import * as fs from 'fs';

/**
 * 文字列のハッシュ情報を保持する型
 */
type HashData = {
    pow: bigint[]; // base^i % mod
    hf: bigint[]; // 正方向のprefix hash (1-indexed)
    hr: bigint[]; // 逆方向のprefix hash (1-indexed)
};

/**
 * 文字列Sの前方・逆方向のハッシュ配列を構築する
 * @param S 対象文字列
 * @param base 基数 (BigInt)
 * @param mod 素数mod (BigInt)
 * @returns HashData
 */
function buildHash(S: string, base: bigint, mod: bigint): HashData {
    const n = S.length;
    const pow: bigint[] = new Array(n + 1);
    const hf: bigint[] = new Array(n + 1);
    const hr: bigint[] = new Array(n + 1);

    pow[0] = 1n;
    for (let i = 1; i <= n; i++) {
        pow[i] = (pow[i - 1] * base) % mod;
    }

    hf[0] = 0n;
    for (let i = 0; i < n; i++) {
        const val = BigInt(S.charCodeAt(i) - 96);
        hf[i + 1] = (hf[i] * base + val) % mod;
    }

    hr[0] = 0n;
    for (let i = 0; i < n; i++) {
        const val = BigInt(S.charCodeAt(n - 1 - i) - 96);
        hr[i + 1] = (hr[i] * base + val) % mod;
    }

    return { pow, hf, hr };
}

/**
 * 部分文字列のハッシュを取得（1-indexed）
 * @param hf 正方向または逆方向のハッシュ配列
 * @param pow 累乗配列
 * @param l 区間左端 (1-indexed)
 * @param r 区間右端 (1-indexed)
 * @param mod 素数mod
 * @returns 部分ハッシュ値
 */
function getSubHash(hf: bigint[], pow: bigint[], l: number, r: number, mod: bigint): bigint {
    const len = r - l + 1;
    let res = hf[r] - ((hf[l - 1] * pow[len]) % mod);
    res %= mod;
    if (res < 0n) res += mod;
    return res;
}

/**
 * 回文判定クエリを処理する
 * @param N 文字列長
 * @param Q クエリ数
 * @param S 入力文字列
 * @param queries クエリ配列 [ [L, R], ... ]
 * @returns 判定結果配列 ("Yes" | "No")
 */
function solve(N: number, Q: number, S: string, queries: [number, number][]): string[] {
    // 二重ハッシュ用パラメータ
    const MOD1 = 1000000007n;
    const MOD2 = 1000000009n;
    const BASE1 = 1000003n;
    const BASE2 = 1000033n;

    // ハッシュ構築
    const h1 = buildHash(S, BASE1, MOD1);
    const h2 = buildHash(S, BASE2, MOD2);

    const res: string[] = [];

    for (let i = 0; i < Q; i++) {
        const [L, R] = queries[i];

        const fh1 = getSubHash(h1.hf, h1.pow, L, R, MOD1);
        const fh2 = getSubHash(h2.hf, h2.pow, L, R, MOD2);

        const revL = N - R + 1;
        const revR = N - L + 1;

        const rh1 = getSubHash(h1.hr, h1.pow, revL, revR, MOD1);
        const rh2 = getSubHash(h2.hr, h2.pow, revL, revR, MOD2);

        if (fh1 === rh1 && fh2 === rh2) {
            res.push('Yes');
        } else {
            res.push('No');
        }
    }
    return res;
}

// =========================
// 入力処理
// =========================
const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/);
let idx = 0;
const N = Number(input[idx++]);
const Q = Number(input[idx++]);
const S = input[idx++];

const queries: [number, number][] = [];
for (let i = 0; i < Q; i++) {
    const L = Number(input[idx++]);
    const R = Number(input[idx++]);
    queries.push([L, R]);
}

// 実行 & 出力
const startTime = process.hrtime.bigint();
const result = solve(N, Q, S, queries);
const endTime = process.hrtime.bigint();

console.log(result.join('\n'));

// 処理時間・メモリ使用量（stderr出力）
console.error(`Time: ${(Number(endTime - startTime) / 1e6).toFixed(3)} ms`);
console.error(`Memory RSS: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`);

// ### 主なポイント

// * **BigInt** で全てのハッシュ計算を行い、精度劣化を完全に排除。
// * **二重ハッシュ**（異なる基数・mod の2組）で衝突を極小化。
// * 逆方向ハッシュは反転インデックスを使って O(1) 比較。
// * 関数に明確なパラメータ型・戻り値型を付与。
// * 処理時間計測は `process.hrtime.bigint()`、メモリ計測は `process.memoryUsage()`。

// ---

// この TypeScript 版にすれば、Node.js 上でも **すべてのケースで正答** できるはずです。
// 必要ならさらに **ジェネリック化して mod/base を差し替えやすくする** こともできます。
