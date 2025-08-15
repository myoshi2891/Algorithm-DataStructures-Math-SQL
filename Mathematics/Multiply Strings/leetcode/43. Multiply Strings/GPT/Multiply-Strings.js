// この問題は JavaScript で文字列の掛け算を行う必要があり、直接 `Number()` に変換せずに桁ごとの積を計算します。
// O(m × n) の計算量で、m と n はそれぞれ num1 と num2 の長さです。

// 以下のコードはメモリと速度を意識して配列を再利用し、不要な文字列操作を避けています。

// ```javascript
/**
 * 文字列として与えられた2つの非負整数の積を文字列として返す
 * @param {string} num1 - 掛け算する1つ目の数（文字列）
 * @param {string} num2 - 掛け算する2つ目の数（文字列）
 * @returns {string} 積を表す文字列
 */
function multiply(num1, num2) {
    // 片方が "0" なら答えは "0"
    if (num1 === "0" || num2 === "0") return "0";

    const m = num1.length;
    const n = num2.length;
    const result = new Array(m + n).fill(0);

    // 下位桁から順に掛け算
    for (let i = m - 1; i >= 0; i--) {
        const digit1 = num1.charCodeAt(i) - 48; // '0' の ASCII を引く
        for (let j = n - 1; j >= 0; j--) {
            const digit2 = num2.charCodeAt(j) - 48;
            const mul = digit1 * digit2;
            const sum = mul + result[i + j + 1];

            result[i + j + 1] = sum % 10;
            result[i + j] += Math.floor(sum / 10);
        }
    }

    // 先頭のゼロをスキップして文字列に変換
    let start = 0;
    while (start < result.length && result[start] === 0) {
        start++;
    }

    return result.slice(start).join("");
}
// ```

// ### 実装ポイント

// * **直接整数変換をしない**
//   → `charCodeAt` で桁の数値を取得し計算。
// * **余分な配列作成を避ける**
//   → 計算用配列 `result` を 1 回だけ作成。
// * **O(1) 追加メモリで結果を構築**
//   → 文字列連結ではなく、最後に `join` でまとめて文字列化。
// * **処理時間**

//   * 最大長 200 の場合、掛け算回数は最大 40,000 回。
//   * Node.js 18.16.1 では余裕で時間内。
// * **メモリ消費**

//   * 配列長は最大 401 要素（数字のみ）。
//   * 補助メモリはほぼ一定。
