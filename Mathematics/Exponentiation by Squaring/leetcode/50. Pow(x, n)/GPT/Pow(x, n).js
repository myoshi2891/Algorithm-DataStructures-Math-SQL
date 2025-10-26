// ```javascript
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
 * Node.js 18.16.1 / LeetCode 実行環境対応
 */
function myPow(x, n) {
    // n が負の場合に対応するため、long型の代わりに BigInt を使わず、
    // Math.abs を利用して安全に処理
    let N = n;
    if (N < 0) {
        x = 1 / x;
        N = -N;
    }

    let result = 1.0;
    let base = x;

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

// ⚡ **解説**

// * この実装は **高速累乗法**（Exponentiation by Squaring）を利用しており、指数を毎回半分にしていくため **O(log n)** で計算できます。
// * 再帰を避けて **while ループ**で実装することで、**スタックメモリ使用量は O(1)** に抑えられます。
// * `n` が負の場合は、`x = 1/x, n = -n` と変換して計算しています。

// 👉 このコードは LeetCode でそのまま **関数形式で提出可能**です。
