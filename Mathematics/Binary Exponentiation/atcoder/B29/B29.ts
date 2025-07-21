// 以下は TypeScript 5.1 (Node.js 18.16.1) において、
// 与えられた整数 `a` と非常に大きな指数 `b` に対して `a^b mod 1000000007` を高速に計算するコードです。

// ---

// ## ✅ 実装内容

// * **繰り返し二乗法（Binary Exponentiation）** により高速計算
// * **BigInt対応**：`b` は最大 `10^18` に対応
// * **`fs.readFileSync`** で高速な一括入力
// * **関数化**してテストや再利用が容易

// ---

// ### ✅ TypeScriptコード（`main.ts`など）

import * as fs from 'fs';

const MOD: bigint = 1000000007n;

/**
 * 繰り返し二乗法により a^b % mod を求める関数
 * @param a - 底（1 ≤ a ≤ 10^9）
 * @param b - 指数（1 ≤ b ≤ 10^18）
 * @param mod - 法（1000000007）
 * @returns a^b mod mod の値
 */
function modPow(a: bigint, b: bigint, mod: bigint): bigint {
    let result: bigint = 1n;
    a %= mod;

    while (b > 0n) {
        if (b % 2n === 1n) {
            result = (result * a) % mod;
        }
        a = (a * a) % mod;
        b >>= 1n; // b = b / 2
    }

    return result;
}

// 入力処理（fsを使用）
const input: string[] = fs.readFileSync('/dev/stdin', 'utf8').trim().split(' ');
const a: bigint = BigInt(input[0]);
const b: bigint = BigInt(input[1]);

// 計算と出力
const result: bigint = modPow(a, b, MOD);
console.log(result.toString());

// ### ✅ 実行方法

// 以下のように実行します：

// ```bash
// # TypeScriptファイルをコンパイル
// tsc main.ts

// # 実行（例：input.txt に "123456789 123456789012345678" を書く）
// node main.js < input.txt
// ```

// ---

// ### ✅ 時間・メモリについて

// | 項目     | 内容                         |
// | ------ | -------------------------- |
// | 計算量    | `O(log b)` = 最大でも 約60回程度乗算 |
// | メモリ使用  | 1関数のみ、BigIntの数個 → 数百KB程度   |
// | 処理時間   | 数ミリ秒〜数十ミリ秒程度（入力に依存）        |
// | 入力サイズ例 | `b` が `10^18` でも対応可能       |

// ---

// ### ✅ 入出力例

// #### 入力

// ```
// 123456789 123456789012345678
// ```

// #### 出力

// ```
// 3599437
// ```