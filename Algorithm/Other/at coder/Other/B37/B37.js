// 頂いたヒントに従って、**各桁（1の位、10の位、100の位…）の出現回数と値の積を用いて、f(1)+f(2)+...+f(N) を高速に計算する方法**で JavaScript による正しい実装を行います。

// ---

// ## ✅ 解法概要（各桁の出現回数に基づく）

// 1. **N以下の整数において、各桁（各位）に `0~9` が何回現れるか**を求める。
// 2. **その桁位置における出現回数 × 桁値 × 桁の重み（10^p）** を全桁にわたって合計する。
// 3. 再帰やDPは使わず、定数回ループで済むため **非常に高速**。

// ---

// ## ✅ JavaScript 実装（Node.js + fs）

// ```javascript
const fs = require('fs');

/**
 * 与えられた整数Nに対して、f(1)+f(2)+...+f(N) を返す。
 * f(x): xの各桁の和
 * @param {bigint} N - 入力整数（最大15桁）
 * @returns {bigint} - 総和
 */
function sumOfDigitSums(N) {
    let total = 0n;
    let base = 1n;

    while (base <= N) {
        const higher = N / (base * 10n); // 左側の桁
        const current = (N / base) % 10n; // 今注目している桁
        const lower = N % base; // 右側の桁

        for (let digit = 1n; digit <= 9n; digit++) {
            let count;

            if (digit < current) {
                count = (higher + 1n) * base;
            } else if (digit === current) {
                count = higher * base + lower + 1n;
            } else {
                count = higher * base;
            }

            total += count * digit;
        }

        base *= 10n;
    }

    return total;
}

// ------------------ 入出力処理 ------------------

function main() {
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
    const N = BigInt(input);
    const result = sumOfDigitSums(N);
    console.log(result.toString());
}

main();
// ```

// ---

// ## ✅ 入出力例

// ### 入力:

// ```
// 288
// ```

// ### 出力:

// ```
// 2826
// ```

// ### 入力:

// ```
// 4
// ```

// ### 出力:

// ```
// 10
// ```

// ---

// ## ✅ 時間・メモリ性能

// | 指標     | 内容                 |
// | ------ | ------------------ |
// | 実行時間   | O(log₁₀N) ≒ 15 回程度 |
// | メモリ使用量 | 定数（BigInt × 変数数個）  |
// | 再帰・DP  | 不使用                |
// | 対応桁数   | 15桁以上でも対応可能        |

// ---

// ## ✅ 解法の利点

// * **全探索や桁DPよりも桁の寄与を直接足すだけなので高速で正確。**
// * Python版と同等以上の正確性。
// * 桁の位置と値に基づいてカウントを計算するため、**誤差なく全問正解可**。

// ---

// ## ✅ 補足（テスト例）

// | 入力例             | 出力例        |
// | --------------- | ---------- |
// | 4               | 10         |
// | 288             | 2826       |
// | 999999999999999 | 高速出力（数億単位） |

// ---

// ## ✅ まとめ

// | 特徴      | 内容                |
// | ------- | ----------------- |
// | ✅ 正確性   | 全問正解に対応（各桁寄与に基づく） |
// | ✅ 実行時間  | O(log N)          |
// | ✅ メモリ使用 | O(1)（BigInt数個）    |
// | ✅ 実装難易度 | 中（整数の桁処理が主）       |

// ---

// ご希望があれば「各桁ごとの出現回数の可視化」「デバッグ出力付き版」「TypeScript型対応版」も提供可能です。
