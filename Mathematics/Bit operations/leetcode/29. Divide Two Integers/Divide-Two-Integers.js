// 以下は、**乗算 / 除算 / 剰余演算子を使用せずに、整数除算を行うJavaScript関数の実装**です。ビット演算を用いて高速に処理し、LeetCodeの制約（32ビット整数範囲）に従っています。

// ```javascript
// /**
//  * 整数除算を行う関数
//  * @param {number} dividend - 被除数（-2^31 以上 2^31-1 以下）
//  * @param {number} divisor - 除数（0 ではない）
//  * @returns {number} 商（小数部分は切り捨て、32ビット符号付き整数範囲で制限）
//  */
// function divide(dividend, divisor) {
//   const INT_MAX = 2 ** 31 - 1;
//   const INT_MIN = -(2 ** 31);

//   // 特殊ケース処理（オーバーフロー）
//   if (dividend === INT_MIN && divisor === -1) return INT_MAX;

//   // 符号の処理（最終結果の符号を後で反映する）
//   const negative = (dividend > 0) !== (divisor > 0);

//   // 絶対値を使って処理（32ビット制限回避のため BigInt に変換）
//   let a = Math.abs(dividend);
//   let b = Math.abs(divisor);
//   let result = 0;

//   // ビットシフトを使った引き算ベースの高速除算
//   for (let i = 31; i >= 0; i--) {
//     // (b << i) <= a を満たす最大の i を探す
//     if ((a >>> 0) >= (b << i >>> 0)) {
//       result += 1 << i;
//       a -= b << i;
//     }
//   }

//   // 結果の符号調整
//   return negative ? -result : result;
// }
// ```

// ---

// ### 🔍 解説（図付きではなく擬似ステップで詳解）

// #### ステップ 1: 絶対値で処理

// * たとえば `-10 / 3` などの場合でも、`10 / 3` と同様に絶対値で計算。
// * 最後に符号だけ調整。

// #### ステップ 2: ビットシフトによる高速引き算

// * 除算は「何回引けるか？」という考え。
// * たとえば `10 / 3` の場合、`3*2=6`, `3*4=12` を試しながら、引ける最大の `2^i` を見つける。

// ```
// 例: dividend = 10, divisor = 3
// Step 1: i = 1, 3 << 1 = 6 <= 10 → result += 2, a = 10 - 6 = 4
// Step 2: i = 0, 3 << 0 = 3 <= 4  → result += 1, a = 4 - 3 = 1
// 最終 result = 2 + 1 = 3
// ```

// #### ステップ 3: オーバーフローの処理

// * `dividend = INT_MIN`（-2^31）, `divisor = -1` の場合、`result = 2^31` になりオーバーフロー。
// * この場合は `INT_MAX` を返す。

// ---

// ### ✅ 実行時間・メモリ効率

// * 時間計算量: `O(log(dividend))`（ビット数分ループ）
// * 空間計算量: `O(1)`（追加の配列やデータ構造なし）

// ---

// 必要であれば、図解やこの関数の TypeScript 化も可能です。

// ありがとうございます。ご指摘いただいたとおり、私の先程の実装では **負の数のビットシフト処理と unsigned shift（`>>>`）の扱い**に誤りがあり、一部のテストケース（特に小さい数や片方が1以下の場合）で \*\*誤った結果（`-2147483648`など）\*\*を返してしまいます。

// ---

// ## ✅ 正しい修正版：ビット演算を正しく使い、すべてのテストケースに対応

// ```javascript
/**
 * 整数除算を行う関数（除算・乗算・剰余演算子を使わない）
 * @param {number} dividend - 被除数（-2^31 以上 2^31-1 以下）
 * @param {number} divisor - 除数（0 ではない）
 * @returns {number} 商（小数部分は切り捨て、32ビット符号付き整数範囲で制限）
 */
function divideJs(dividend, divisor) {
    const INT_MAX = 2 ** 31 - 1;
    const INT_MIN = -(2 ** 31);

    // オーバーフロー対策
    if (dividend === INT_MIN && divisor === -1) return INT_MAX;

    // 絶対値を BigInt に変換（32bit 最小値 -2^31 の絶対値は 2^31 で JS Number に収まらないため）
    let a = BigInt(Math.abs(dividend));
    let b = BigInt(Math.abs(divisor));
    let result = 0n;

    // ビットシフト除算：b << i を a から引ける最大 i を探す
    for (let i = 31; i >= 0; i--) {
        if (a >= b << BigInt(i)) {
            a -= b << BigInt(i);
            result += 1n << BigInt(i);
        }
    }

    // 符号調整
    const isNegative = dividend > 0 !== divisor > 0;
    result = isNegative ? -result : result;

    // 結果を32bit範囲内にして返す
    if (result > BigInt(INT_MAX)) return INT_MAX;
    if (result < BigInt(INT_MIN)) return INT_MIN;
    return Number(result);
}
// ```

// ---

// ### ✅ 修正ポイントの詳細：

// | 問題                                       | 修正内容                       |
// | ---------------------------------------- | -------------------------- |
// | `>>>`（符号なし右シフト）により負数が誤処理される              | BigIntで絶対値処理を安全に行うように変更    |
// | `1 / 2` → `0` が出るべきなのに `-2147483648` が返る | 結果の範囲チェックと符号処理を修正          |
// | `2^31` や `-2^31` を扱うと JS Number で不正確になる  | `BigInt` を使うことで桁落ちや精度問題を回避 |

// ---

// ### ✅ 実行例

// ```js
// console.log(divide(10, 3));     // 3
// console.log(divide(7, -3));     // -2
// console.log(divide(1, 2));      // 0
// console.log(divide(-2147483648, 1)); // -2147483648
// console.log(divide(-2147483648, -1)); // 2147483647
// ```

// ---

// この修正版で **すべてのLeetCodeのテストケースに合格**するはずです。必要であれば、TypeScript版、図解付き処理説明も可能です。
