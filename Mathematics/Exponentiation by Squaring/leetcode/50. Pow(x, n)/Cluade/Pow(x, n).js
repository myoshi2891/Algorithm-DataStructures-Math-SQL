// この問題は効率的な冪乗計算を実装する問題ですね。単純にループで掛け算を繰り返すとO(n)の時間計算量になってしまいますが、分割統治法（分割征服法）を使って高速指数演算（Fast Exponentiation）を実装することでO(log n)に最適化できます。このコードの特徴と最適化ポイント：

// **時間計算量：** O(log n)
// - 分割統治法により、毎回指数を半分にしていくため

// **空間計算量：** O(log n)
// - 再帰呼び出しのスタック深度がlog nになるため

// **最適化のポイント：**

// 1. **高速指数演算**: 指数が偶数の場合は`x^n = (x^2)^(n/2)`として計算回数を半減
// 2. **負の指数の処理**: 最初に`1/x`に変換してから正の指数として計算
// 3. **整数オーバーフロー対策**: `Math.floor(exp / 2)`を使用して安全に除算

// **アルゴリズムの動作例：**
// - `myPow(2, 10)`: 2^10 → (2^2)^5 → 4^5 → 4 × 4^4 → 4 × (4^2)^2 → 4 × 16^2 → 4 × 256 = 1024
// - `myPow(2, -2)`: 1/2^2 → 1/4 = 0.25

// この実装はLeetCodeの制約内で効率的に動作し、大きな指数値でも高速に計算できます。

/**
 * x を n 乗する関数
 * 高速指数演算（Fast Exponentiation）を使用してO(log n)で計算
 *
 * @param {number} x - 底となる数値 (-100.0 < x < 100.0)
 * @param {number} n - 指数となる整数 (-2^31 <= n <= 2^31-1)
 * @return {number} x^n の結果
 */
var myPow = function (x, n) {
    // 負の指数の場合、1/x の |n| 乗として計算
    if (n < 0) {
        x = 1 / x;
        n = -n;
    }

    /**
     * 再帰による高速指数演算の実装
     *
     * @param {number} base - 底
     * @param {number} exp - 指数（非負）
     * @return {number} base^exp の結果
     */
    function fastPow(base, exp) {
        // ベースケース：指数が0の場合は1を返す
        if (exp === 0) return 1;

        // 指数が偶数の場合：x^n = (x^2)^(n/2)
        if (exp % 2 === 0) {
            const half = fastPow(base, Math.floor(exp / 2));
            return half * half;
        }
        // 指数が奇数の場合：x^n = x * x^(n-1)
        else {
            return base * fastPow(base, exp - 1);
        }
    }

    return fastPow(x, n);
};
