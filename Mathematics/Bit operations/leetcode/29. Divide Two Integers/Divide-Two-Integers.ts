
// 次に、同じ問題を **TypeScript 5.1（Node.js 18.16.1）** に対応した関数として実装します。
// クラスは使用せず、**関数ベースで実装**し、**引数と戻り値の型アノテーション**も含め、\*\*LeetCode向け最適化（時間・メモリ）\*\*を考慮しています。

// ---

// ## ✅ TypeScript 実装（除算・乗算・剰余なし）

// ```ts
/**
 * 整数除算を行う関数（乗算、除算、剰余演算子を使わない）
 * @param dividend - 被除数（32ビット符号付き整数範囲）
 * @param divisor - 除数（0 ではない）
 * @returns 商（小数部分は切り捨て、32ビット符号付き整数範囲で制限）
 */
function divide(dividend: number, divisor: number): number {
  const INT_MAX = 2 ** 31 - 1;
  const INT_MIN = -(2 ** 31);

  // オーバーフロー対策
  if (dividend === INT_MIN && divisor === -1) return INT_MAX;

  // 絶対値を BigInt で扱う（JSの number は 2^31 を安全に扱えないため）
  let a: bigint = BigInt(Math.abs(dividend));
  let b: bigint = BigInt(Math.abs(divisor));
  let result: bigint = 0n;

  // ビットシフトを使った引き算ベースの除算
  for (let i = 31; i >= 0; i--) {
    if (a >= (b << BigInt(i))) {
      a -= b << BigInt(i);
      result += 1n << BigInt(i);
    }
  }

  // 符号の決定
  const isNegative: boolean = (dividend > 0) !== (divisor > 0);
  if (isNegative) result = -result;

  // 32ビット範囲に収めて返す
  if (result > BigInt(INT_MAX)) return INT_MAX;
  if (result < BigInt(INT_MIN)) return INT_MIN;
  return Number(result);
}
// ```

// ---

// ### ✅ 補足

// | 項目      | 内容                                                  |
// | ------- | --------------------------------------------------- |
// | 使用禁止演算子 | `*`, `/`, `%` 一切未使用                                 |
// | 使用した演算  | `<<`（ビットシフト）, `BigInt`, `Math.abs()`                |
// | 時間計算量   | `O(log N)` （最大31回ループ）                               |
// | 空間計算量   | `O(1)` （定数サイズのみ使用）                                  |
// | 型安全性    | `dividend`, `divisor` は `number`、中間演算には `bigint` 使用 |
// | 精度問題    | `BigInt` によって `-2^31` なども安全に処理                      |

// ---

// ### ✅ 実行例（Node.jsで確認可能）

// ```ts
// console.log(divide(10, 3));     // 3
// console.log(divide(7, -3));     // -2
// console.log(divide(1, 2));      // 0
// console.log(divide(-2147483648, 1));  // -2147483648
// console.log(divide(-2147483648, -1)); // 2147483647
// ```

// ---

// ご希望があれば、TypeScriptの型推論トレース、図解ステップ解説、あるいは別解（例：再帰やバイナリサーチ応用）などもご提供できます。
