// TypeScript版に変更しました。主な変更点：

// **型安全性の向上：**
// - 関数パラメータに明示的な型注釈（`string`）
// - 戻り値の型注釈（`: string`）
// - 変数宣言時の型注釈（`number`, `number[]`）

// **TypeScript特有の最適化：**
// - `Number()` 関数を使用して文字から数値への変換を明示的に実行
// - より厳密な型チェックによりランタイムエラーのリスク軽減

// **パフォーマンス特性は変わらず：**
// - **時間計算量：** O(m × n)
// - **空間計算量：** O(m + n)

// TypeScript 5.1の型システムを活用することで、コンパイル時の型チェックが強化され、より安全で保守性の高いコードになっています。LeetCodeでの実行時間とメモリ使用量は JavaScript版と同等の効率性を保持しています。

/**
 * 文字列として表現された2つの非負整数を掛け算する
 * @param num1 - 第1の数値（文字列）
 * @param num2 - 第2の数値（文字列）
 * @returns 掛け算の結果（文字列）
 */
function multiply(num1: string, num2: string): string {
    // 特殊ケース：どちらかが"0"の場合
    if (num1 === '0' || num2 === '0') {
        return '0';
    }

    const m: number = num1.length;
    const n: number = num2.length;

    // 結果を格納する配列（最大桁数は m + n）
    const result: number[] = new Array(m + n).fill(0);

    // 筆算の掛け算を実装
    // 右端（最下位桁）から処理
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            // 現在の桁の掛け算
            const mul: number = Number(num1[i]) * Number(num2[j]);

            // 結果配列での位置
            const p1: number = i + j; // 上位桁
            const p2: number = i + j + 1; // 下位桁

            // 現在の値に掛け算結果を加算
            const sum: number = mul + result[p2];

            // 下位桁に余りを設定
            result[p2] = sum % 10;

            // 上位桁に繰り上がりを加算
            result[p1] += Math.floor(sum / 10);
        }
    }

    // 結果配列を文字列に変換（先頭の0を除去）
    let start: number = 0;
    while (start < result.length && result[start] === 0) {
        start++;
    }

    return result.slice(start).join('');
}
