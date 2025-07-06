// 以下は、指定されたRSA復号処理をJavaScript（Node.js）で `fs` モジュールを使って実装するコードです。
// また、**実行時間とメモリ使用量にも配慮した実装**となっており、**高速な累乗と逆元の計算**により効率化しています。

// ### ✅ 解法のポイント

// * `n = p * q`
// * `phi(n) = (p - 1) * (q - 1)`
// * `d ≡ e⁻¹ mod phi(n)`（拡張ユークリッドで逆元計算）
// * `M ≡ E^d mod n`（繰り返し二乗法で復号）

// ### ✅ Node.js コード（`fs`使用）

const fs = require('fs');

// 入力取得
const input = fs.readFileSync(0, 'utf8').trim();
const [p, q, e, E] = input.split(' ').map(BigInt);

// n, φ(n)
const n = p * q;
const phi = (p - 1n) * (q - 1n);

// 拡張ユークリッド互除法で e^-1 mod φ(n) を求める
function modInv(a, m) {
    let m0 = m, x0 = 0n, x1 = 1n;
    while (a > 1n) {
        let q = a / m;
        [a, m] = [m, a % m];
        [x0, x1] = [x1 - q * x0, x0];
    }
    return x1 < 0n ? x1 + m0 : x1;
}

// 繰り返し二乗法で (base ^ exp) % mod を高速計算
function modPow(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) result = (result * base) % mod;
        base = (base * base) % mod;
        exp = exp / 2n;
    }
    return result;
}

// 秘密鍵 d を計算
const d = modInv(e, phi);

// 復号: M = E^d mod n
const M = modPow(E, d, n);

// ASCII に変換して出力
console.log(String.fromCharCode(Number(M)));

// ### ✅ 実行方法

// ```bash
// node rsa_decode.js < input.txt
// ```

// `input.txt` に以下のような入力を記述：

// ```
// 23917 23929 8731 109861231
// ```

// 出力：

// ```
// K
// ```

// ---

// ### ✅ 時間・メモリ計算（目安）

// * **時間計算量**

//   * `modInv`: O(log φ(n)) ≈ O(log(pq)) ≈ O(log 10^10) = 約 33 回程度
//   * `modPow`: O(log d) ≈ O(log φ(n)) 同様
// * **メモリ**

//   * 使用する変数は全て BigInt （最大でも 64bit 数個）
//   * メモリ消費量 ≈ 数十 KB 未満

// ---

// ### ✅ 入力例2 検証

// ```
// 21283 21313 2843 315549360
// ```

// 出力：

// ```
// p
// ```
