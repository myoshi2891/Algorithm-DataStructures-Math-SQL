// 以下は、JavaScript（Node.js 18.16.1）で、与えられた整数 `a` と巨大な指数 `b` に対して、
// `a^b mod 1000000007` を高速に計算するプログラムです。

// ### ✅ 特徴

// * **高速べき乗法（繰り返し二乗法）** を使用
// * **BigInt対応**（`b` は最大 `10^18` まで扱える）
// * `fs` モジュールで標準入力から読み込み
// * 計算時間は最大でも **O(log b)**、メモリも極めて少なく済みます

// ---

// ### ✅ コード（`a^b mod 1000000007`）

// ```javascript
// Node.js 18.16.1 環境を想定
const fs = require('fs');

const MOD = 1000000007n;

/**
 * a^b % mod を繰り返し二乗法で計算する
 * @param {bigint} base - 底（a）
 * @param {bigint} exponent - 指数（b）
 * @param {bigint} mod - 法（1000000007）
 * @returns {bigint} - a^b % mod の結果
 */
function modPow(base, exponent, mod) {
    let result = 1n;
    base = base % mod;
    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exponent = exponent / 2n;
    }
    return result;
}

// 入力読み込み
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split(' ');
const a = BigInt(input[0]);
const b = BigInt(input[1]);

// 計算して出力
const result = modPow(a, b, MOD);
console.log(result.toString());

// ### ✅ 実行方法

// UNIX環境（Linux / macOS）などで、次のようにファイルから入力できます：

// ```bash
// node main.js < input.txt
// ```

// ---

// ### ✅ 補足

// | 特性     | 内容                          |
// | ------ | --------------------------- |
// | 時間計算量  | `O(log b)`                  |
// | メモリ使用量 | 約数百 KB 以下                   |
// | 安全性    | `BigInt` 使用で `10^18` まで対応可能 |
