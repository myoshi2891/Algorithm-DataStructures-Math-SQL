// 了解しました。
// この問題は **N, Q が最大 100,000** なので、各クエリを O(1) で判定するために **文字列ハッシュ（ローリングハッシュ）** を使います。

// ### アルゴリズム概要

// 1. **前方ハッシュ** と **逆方向ハッシュ** を構築（累積和方式）。
// 2. 各クエリ `[L, R]` について、

//    * `S[L, R]` の前方ハッシュと、逆方向のハッシュを比較。
// 3. 完全一致すれば回文 → `Yes`、そうでなければ `No`。

// 計算量:

// * 前処理: O(N)
// * クエリ: O(1)
// * 全体: O(N + Q)

// メモリ:

// * ハッシュ配列2本と累乗配列 → O(N)

// ---

// ```javascript
// // Node.js 18.16.1
// // fsを用いて入力を処理
// const fs = require('fs');
// const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/);

// // =========================
// // 関数: 回文判定クエリ処理
// // N: 文字列長 (number)
// // Q: クエリ数 (number)
// // S: 入力文字列 (string)
// // queries: クエリ配列 [ [L, R], ... ] (number[][])
// // 戻り値: 判定結果配列 (string[])
// // =========================
// function solve(N, Q, S, queries) {
//     const base = 911382323; // 基数
//     const mod = 1000000007; // 大きな素数

//     // 前方ハッシュと累乗を構築
//     const pow = new Array(N + 1).fill(0);
//     const hashF = new Array(N + 1).fill(0); // 前方ハッシュ
//     const hashR = new Array(N + 1).fill(0); // 逆方向ハッシュ

//     pow[0] = 1;
//     for (let i = 1; i <= N; i++) {
//         pow[i] = (pow[i - 1] * base) % mod;
//     }

//     // 前方ハッシュ
//     for (let i = 0; i < N; i++) {
//         hashF[i + 1] = (hashF[i] * base + (S.charCodeAt(i) - 96)) % mod;
//     }

//     // 逆方向ハッシュ
//     for (let i = 0; i < N; i++) {
//         hashR[i + 1] = (hashR[i] * base + (S.charCodeAt(N - 1 - i) - 96)) % mod;
//     }

//     // 部分ハッシュ取得関数
//     const getHash = (l, r) => {
//         // [l, r] 1-indexed
//         const len = r - l + 1;
//         return (hashF[r] - (hashF[l - 1] * pow[len]) % mod + mod) % mod;
//     };
//     const getHashRev = (l, r) => {
//         // 逆方向の [l, r] は S を反転した時の位置
//         const len = r - l + 1;
//         return (hashR[r] - (hashR[l - 1] * pow[len]) % mod + mod) % mod;
//     };

//     const res = [];
//     for (let i = 0; i < Q; i++) {
//         let [L, R] = queries[i];
//         const h1 = getHash(L, R);
//         const h2 = getHashRev(N - R + 1, N - L + 1);
//         res.push(h1 === h2 ? 'Yes' : 'No');
//     }
//     return res;
// }

// // =========================
// // 入力処理
// // =========================
// let idx = 0;
// const N = Number(input[idx++]);
// const Q = Number(input[idx++]);
// const S = input[idx++];
// const queries = [];
// for (let i = 0; i < Q; i++) {
//     const L = Number(input[idx++]);
//     const R = Number(input[idx++]);
//     queries.push([L, R]);
// }

// // 実行 & 出力
// const startTime = process.hrtime.bigint();
// const result = solve(N, Q, S, queries);
// const endTime = process.hrtime.bigint();
// console.log(result.join('\n'));

// // 処理時間とメモリ消費量出力（デバッグ用）
// console.error(`Time: ${(Number(endTime - startTime) / 1e6).toFixed(3)} ms`);
// console.error(`Memory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`);
// ```

// ---

// ### 実装のポイント

// * **ローリングハッシュ**を使い、部分文字列の比較を O(1) に短縮。
// * `getHashRev` では、S を反転した位置に対応させて比較。
// * `charCodeAt(i) - 96` は 'a' → 1 にするため。
// * `pow` 配列を使って累乗を事前計算。
// * 実行時間計測は `process.hrtime.bigint()`、メモリは `process.memoryUsage()`。

// ---

// もし望めば、このコードを **ダブルハッシュ** にして衝突をさらに減らすこともできます。
// このままでも、制約下で十分高速かつ安全に動作します。

// 原因を確認したところ、** JavaScript の `Number`（倍精度浮動小数点）で大きな整数の乗算や剰余を繰り返すと丸め誤差が発生 ** し、ハッシュ値が正しく計算されずに誤判定が多発していました（特に大きめの基数や累乗を使うと顕著になります）。元の実装ではこの丸め誤差のために多数のクエリが誤判定になっていました。

// 修正方針：

// 1. 全てのハッシュ計算を **BigInt** に変更して精度の問題を解消。
// 2. 衝突（ハッシュ衝突）対策として **二重ハッシュ**（2つの異なる mod/base）を使い、実用上の衝突確率を極小化。

// 以下が修正版のコードです。要求どおり `fs` を使い、関数化・パラメータ／戻り値のコメントを付けています。実行時間・メモリは stderr に出力します。

// ```javascript
// Node.js 18.16.1
// 入力は標準入力から読み込む (fs)
// BigInt + 二重ハッシュで修正済み

const fs = require('fs');

const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/);
let idx = 0;
const N = Number(input[idx++]);
const Q = Number(input[idx++]);
const S = input[idx++];

// =========================
// ヘルパー: ハッシュ構築
// buildHash(S, base, mod)
//  - S: 文字列
//  - base: BigInt
//  - mod: BigInt
// 戻り値: { pow: BigInt[], hf: BigInt[], hr: BigInt[] }
//   pow[i] = base^i % mod
//   hf[i] = prefix hash up to i (1-indexed)
//   hr[i] = prefix hash of reversed S up to i (1-indexed)
// =========================
function buildHash(S, base, mod) {
    const n = S.length;
    const pow = new Array(n + 1);
    const hf = new Array(n + 1);
    const hr = new Array(n + 1);
    pow[0] = 1n;
    for (let i = 1; i <= n; i++) pow[i] = (pow[i - 1] * base) % mod;

    hf[0] = 0n;
    for (let i = 0; i < n; i++) {
        const val = BigInt(S.charCodeAt(i) - 96); // 'a' -> 1
        hf[i + 1] = (hf[i] * base + val) % mod;
    }

    hr[0] = 0n;
    for (let i = 0; i < n; i++) {
        const val = BigInt(S.charCodeAt(n - 1 - i) - 96);
        hr[i + 1] = (hr[i] * base + val) % mod;
    }

    return { pow, hf, hr };
}

// 部分ハッシュ取得（1-indexed）
// getSubHash(hf, pow, l, r, mod) -> BigInt
function getSubHash(hf, pow, l, r, mod) {
    const len = r - l + 1;
    // (hf[r] - hf[l-1] * pow[len]) % mod
    let res = hf[r] - ((hf[l - 1] * pow[len]) % mod);
    res %= mod;
    if (res < 0n) res += mod;
    return res;
}

// =========================
// 二重ハッシュのパラメータ（BigInt）
// =========================
const MOD1 = 1000000007n;
const MOD2 = 1000000009n;
// 比較的衝突が起きにくい基数（適度に大きいが BigInt なので安全）
const BASE1 = 1000003n;
const BASE2 = 1000033n;

// 構築（2系統）
const h1 = buildHash(S, BASE1, MOD1);
const h2 = buildHash(S, BASE2, MOD2);

// クエリ読み込み
const queries = [];
for (let i = 0; i < Q; i++) {
    const L = Number(input[idx++]);
    const R = Number(input[idx++]);
    queries.push([L, R]);
}

// メイン処理関数
// solve(N, Q, queries) -> string[] ("Yes"/"No")
function solve(N, Q, queries) {
    const out = [];
    for (let i = 0; i < Q; i++) {
        const [L, R] = queries[i];

        // 正方向ハッシュ（両方）
        const fh1 = getSubHash(h1.hf, h1.pow, L, R, MOD1);
        const fh2 = getSubHash(h2.hf, h2.pow, L, R, MOD2);

        // 逆方向に対応する区間: reversed index = N - R + 1 〜 N - L + 1
        const revL = N - R + 1;
        const revR = N - L + 1;
        const rh1 = getSubHash(h1.hr, h1.pow, revL, revR, MOD1);
        const rh2 = getSubHash(h2.hr, h2.pow, revL, revR, MOD2);

        if (fh1 === rh1 && fh2 === rh2) out.push('Yes');
        else out.push('No');
    }
    return out;
}

// 実行＆出力
const start = process.hrtime.bigint();
const ans = solve(N, Q, queries);
const end = process.hrtime.bigint();

console.log(ans.join('\n'));

// デバッグ情報（stderr）
console.error(`Time: ${Number(end - start) / 1e6} ms`);
console.error(`Memory RSS: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`);
// ```

// ### 変更点（要点）

// * 元の実装では `Number` を用いていたため、累乗や乗算で 2^53 を超え丸め誤差が発生 → ハッシュが一致しないケースが発生していました。 → **BigInt に切り替え**。
// * 衝突リスク軽減のため **二重ハッシュ（MOD1, MOD2）** を採用。
// * 文字列の逆向きハッシュは反転したインデックスの区間を比較する方式で問題ありません（元のロジックは正しい）。

// ### 性能

// * 時間: 前処理 O(N)、各クエリ O(1) → 全体 O(N + Q)。
// * メモリ: 配列は O(N)（ここでは pow/hf/hr をそれぞれ 2 系統で保持）。
