// この問題は文字列として表現された2つの大きな数の掛け算を行う問題です。筆算の掛け算アルゴリズムを実装します。この解法の特徴：

// **アルゴリズムの説明：**
// 1. 筆算の掛け算と同じ方法で実装
// 2. 各桁同士の掛け算結果を適切な位置に配置
// 3. 繰り上がりを正しく処理

// **時間計算量：** O(m × n) - num1の長さがm、num2の長さがn
// **空間計算量：** O(m + n) - 結果格納用の配列

// **最適化のポイント：**
// - 特殊ケース（"0"）を最初に処理してパフォーマンス向上
// - 配列のインデックス計算を効率化
// - 不要な文字列操作を避けて、最後に一度だけ文字列変換
// - 先頭の0を効率的に除去

// この実装はLeetCodeの制約（文字列長最大200）に対して十分高速で、メモリ使用量も最小限に抑えています。

/**
 * 文字列として表現された2つの非負整数を掛け算する
 * @param {string} num1 - 第1の数値（文字列）
 * @param {string} num2 - 第2の数値（文字列）
 * @return {string} - 掛け算の結果（文字列）
 */
var multiply = function (num1, num2) {
    // 特殊ケース：どちらかが"0"の場合
    if (num1 === '0' || num2 === '0') {
        return '0';
    }

    const m = num1.length;
    const n = num2.length;

    // 結果を格納する配列（最大桁数は m + n）
    const result = new Array(m + n).fill(0);

    // 筆算の掛け算を実装
    // 右端（最下位桁）から処理
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            // 現在の桁の掛け算
            const mul = (num1[i] - '0') * (num2[j] - '0');

            // 結果配列での位置
            const p1 = i + j; // 上位桁
            const p2 = i + j + 1; // 下位桁

            // 現在の値に掛け算結果を加算
            const sum = mul + result[p2];

            // 下位桁に余りを設定
            result[p2] = sum % 10;

            // 上位桁に繰り上がりを加算
            result[p1] += Math.floor(sum / 10);
        }
    }

    // 結果配列を文字列に変換（先頭の0を除去）
    let start = 0;
    while (start < result.length && result[start] === 0) {
        start++;
    }

    return result.slice(start).join('');
};
