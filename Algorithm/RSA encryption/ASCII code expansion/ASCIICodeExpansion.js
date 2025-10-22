// 以下は、**RSA復号処理 + ASCIIコード展開（28ビット → 7ビット×4分割）** を行うJavaScriptコードです。
// `fs` モジュールで標準入力から値を取得し、**実行時間・メモリの消費を抑えた実装**になっています。

// ---

// ## ✅ 処理概要

// 1. 入力：`n`, `e`, `E`
// 2. φ(n) を求めるために、`n` を素因数分解 → `p`, `q` を得る
// 3. `φ(n) = (p-1)(q-1)` を計算
// 4. `d = e⁻¹ mod φ(n)` を求める（拡張ユークリッド）
// 5. `M = E^d mod n`（繰り返し二乗法）
// 6. `M` を28ビットで見て、7ビットごとに区切って文字列化

// ---

// ## ✅ コード（Node.js）

const fs = require('fs');

// 入力取得
const input = fs.readFileSync(0, 'utf8').trim();
const [nRaw, eRaw, Eraw] = input.split(' ').map(BigInt);

const n = nRaw;
const e = eRaw;
const E = Eraw;

// 素因数分解（p, q）
// n は 10^10 以下なので √n まで試せば良い
function findFactors(n) {
    const sqrtN = BigInt(Math.floor(Math.sqrt(Number(n))));
    for (let i = 2n; i <= sqrtN; i++) {
        if (n % i === 0n) {
            return [i, n / i];
        }
    }
    return [1n, n]; // fallback
}

// 拡張ユークリッド互除法で逆元を求める
function modInv(a, m) {
    let m0 = m,
        x0 = 0n,
        x1 = 1n;
    while (a > 1n) {
        const q = a / m;
        [a, m] = [m, a % m];
        [x0, x1] = [x1 - q * x0, x0];
    }
    return x1 < 0n ? x1 + m0 : x1;
}

// 繰り返し二乗法で a^b % m を高速計算
function modPow(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp = exp / 2n;
    }
    return result;
}

// 1. 素因数分解
const [p, q] = findFactors(n);

// 2. φ(n) = (p-1)(q-1)
const phi = (p - 1n) * (q - 1n);

// 3. 秘密鍵 d = e^-1 mod φ(n)
const d = modInv(e, phi);

// 4. 復号処理 M = E^d mod n
const M = modPow(E, d, n);

// 5. 28ビットを 7ビット × 4 に分割し ASCII 変換
const chars = [];
let temp = M;
for (let i = 0; i < 4; i++) {
    const charCode = Number(temp & 0b1111111n); // 下位7ビット
    if (charCode !== 0) {
        chars.unshift(String.fromCharCode(charCode));
    }
    temp >>= 7n;
}

// 出力
console.log(chars.join(''));

// ## ✅ 実行例

// ### 入力:

// ```
// 3995747143 3007 602607029
// ```

// ### 出力:

// ```
// PAIZ
// ```

// ---

// ## ✅ 実行時間・メモリ分析

// | ステップ            | 時間計算量       | 備考                        |
// | --------------- | ----------- | ------------------------- |
// | 素因数分解           | O(√n)       | n ≤ 10^10 なので最大 10^5 回ループ |
// | 逆元計算（modInv）    | O(log φ(n)) | log(10^10) ≈ 33 回以下       |
// | 繰り返し二乗法（modPow） | O(log d)    | 非常に高速                     |
// | ビット操作＆変換        | O(1)        | 最大4文字分                    |
// | **総メモリ使用量**     | 数百 KB 程度    | BigInt 計算のために多少のオーバーヘッドあり |

// ---

// ## ✅ 補足

// * 暗号文（`E`）が 28 ビットの復号文 `M` を生成する前提です。
// * `M` は ASCII コードの7ビット（0〜127）範囲の文字しか使わない設計です。

// ---

// ご希望があれば、RSAの暗号化側（E = M^e mod n）コードや、多文字列対応の拡張版なども提供可能です。お気軽にどうぞ！
