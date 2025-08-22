// ```typescript
/**
 * pow 関数
 * @param {number} x - 基数 ( -100.0 < x < 100.0 )
 * @param {number} n - 指数 ( -2^31 <= n <= 2^31 - 1 )
 * @returns {number} - x の n 乗 ( x^n )
 *
 * 処理内容:
 * - n が負の場合は 1/x^(-n) を計算
 * - 高速累乗法 (Exponentiation by Squaring) を用いて O(log n) 時間で計算
 *
 * 計算量:
 * 時間計算量: O(log |n|)  
 * 空間計算量: O(1) （再帰を使わずループで処理するため）
 *
 * 実行環境: TypeScript 5.1 / Node.js 18.16.1 / LeetCode
 */
function myPow(x: number, n: number): number {
    let N: number = n;

    // 負の指数の場合は逆数に変換
    if (N < 0) {
        x = 1 / x;
        N = -N;
    }

    let result: number = 1.0;
    let base: number = x;

    while (N > 0) {
        // n が奇数なら現在の base を結果に掛ける
        if (N % 2 === 1) {
            result *= base;
        }
        // base を自乗し、指数を半分に
        base *= base;
        N = Math.floor(N / 2);
    }

    return result;
}
// ```

// ---

// ⚡ **ポイント**

// * **高速累乗法 (Exponentiation by Squaring)** を採用しており、`O(log |n|)` で計算できるため大きな指数でも高速です。
// * **while ループ**により **スタック消費を抑えて O(1) 空間**で処理します。
// * LeetCode の提出形式（クラス不要・関数のみ）に準拠しています。

