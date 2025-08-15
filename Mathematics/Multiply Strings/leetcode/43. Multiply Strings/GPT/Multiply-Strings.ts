// 以下は TypeScript 版の最適化実装です。
// 処理時間・メモリの消費を意識して、ループは最小限・配列は一度だけ作成しています。

// ```typescript
/**
 * 文字列として与えられた2つの非負整数の積を文字列として返す
 * @param num1 掛け算する1つ目の数（文字列）
 * @param num2 掛け算する2つ目の数（文字列）
 * @returns 積を表す文字列
 */
function multiply(num1: string, num2: string): string {
    // "0" の場合は即座に返す（不要な計算を避ける）
    if (num1 === "0" || num2 === "0") return "0";

    const m: number = num1.length;
    const n: number = num2.length;
    const result: number[] = new Array(m + n).fill(0);

    // 下位桁から掛け算
    for (let i = m - 1; i >= 0; i--) {
        const digit1: number = num1.charCodeAt(i) - 48; // '0' の ASCII を引く
        for (let j = n - 1; j >= 0; j--) {
            const digit2: number = num2.charCodeAt(j) - 48;
            const mul: number = digit1 * digit2;
            const sum: number = mul + result[i + j + 1];

            result[i + j + 1] = sum % 10;
            result[i + j] += Math.floor(sum / 10);
        }
    }

    // 先頭のゼロをスキップ
    let start: number = 0;
    while (start < result.length && result[start] === 0) {
        start++;
    }

    return result.slice(start).join("");
}
// ```

// ---

// ### 実装の特徴

// * **整数変換禁止ルールに準拠**
//   → `charCodeAt` を使い、文字→数値変換を高速に実行。
// * **O(m × n) 時間計算量**

//   * 最大長 200 なら最大 40,000 回の掛け算。
// * **メモリ効率**

//   * 計算配列 `result` は 401 要素以内で固定。
//   * 追加の文字列連結は最後に一度だけ。

