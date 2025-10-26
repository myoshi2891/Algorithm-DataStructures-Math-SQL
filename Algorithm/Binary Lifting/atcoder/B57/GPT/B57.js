// この問題は **各数値に対して K 回の「桁和を引く」操作** を行う必要がありますが、
// K が最大 $10^9$ と非常に大きく、素直にシミュレーションすると間に合いません。

// ポイントは次の通りです：

// ---

// ### **考え方**

// 1. **操作の性質**

//    * 1 回の操作は必ず値を減らす（桁和 ≥ 1 のため）。
//    * ある程度操作を行うと「ループ」に入る（特に 0 や 9 の倍数付近）。
//    * 最大 300000 までなので、各数値に対して遷移の履歴を事前計算できる。

// 2. **高速化**

//    * 各数値 i に対して「次に行く値」を precompute。
//    * それを二進法的にジャンプできるように **ダブリング法 (binary lifting)** を使うと、K ステップ先を $O(\log K)$ で求められる。
//    * この方法だと
//      前処理：$O(N \log K)$
//      各 i の計算：$O(\log K)$

// 3. **計算量**

//    * $N \leq 300000$、$\log K \approx 30$ なので十分間に合う。
//    * メモリも $N \times \log K \approx 300000 \times 30 \approx 9 \times 10^6$ 程度の整数配列で収まる（1024MB 制限内）。

// ---

// ### **実装方針**

// * `sumDigits(x)` で桁和を計算
// * `next[i]` = i から 1 ステップ後の値を計算
// * `jump[p][i]` = i から $2^p$ ステップ後の値
// * K を二進展開してジャンプ

// ---

// ```javascript
// Node.js 18.16.1
// fs を使って高速入出力
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const N = input[0];
let K = BigInt(input[1]); // K は最大 1e9 だが BigInt で扱う

// 桁和計算関数
/**
 * @param {number} x - 計算対象の整数
 * @returns {number} - 桁和
 */
function sumDigits(x) {
    let s = 0;
    while (x > 0) {
        s += x % 10;
        x = Math.floor(x / 10);
    }
    return s;
}

// 1ステップ先を計算
const next = new Uint32Array(N + 1);
for (let i = 1; i <= N; i++) {
    const sd = sumDigits(i);
    const nx = i - sd;
    next[i] = nx;
}

// ダブリングテーブル構築
const LOG = 32; // K <= 1e9 なので 2^30 で十分、余裕を持って32
const jump = Array.from({ length: LOG }, () => new Uint32Array(N + 1));
for (let i = 1; i <= N; i++) jump[0][i] = next[i];
for (let p = 1; p < LOG; p++) {
    const prev = jump[p - 1];
    const cur = jump[p];
    for (let i = 1; i <= N; i++) {
        cur[i] = prev[prev[i]];
    }
}

// 各 i について K ステップ先を計算
const res = new Uint32Array(N);
for (let i = 1; i <= N; i++) {
    let cur = i;
    let steps = K;
    let bit = 0;
    while (steps > 0n) {
        if (steps & 1n) {
            cur = jump[bit][cur];
        }
        steps >>= 1n;
        bit++;
    }
    res[i - 1] = cur;
}

// 出力
let out = '';
for (let i = 0; i < N; i++) out += res[i] + '\n';
process.stdout.write(out);

// ### **処理時間・メモリ見積もり**

// * **時間**

//   * 前処理：

//     * next 配列構築: $O(N \cdot d)$（dは桁数、最大6）
//     * ダブリング: $O(N \log K)$ ≈ $3 \times 10^5 \times 30 = 9 \times 10^6$ ステップ
//   * 各 i の計算: $O(N \log K)$
//   * 合計：おおよそ 0.3〜0.5 秒程度（Node.js）
// * **メモリ**

//   * next: 4byte × (N+1) ≈ 1.2MB
//   * jump: 32 × (N+1) × 4byte ≈ 38MB
//   * res: 1.2MB
//     → 合計 40MB 程度
