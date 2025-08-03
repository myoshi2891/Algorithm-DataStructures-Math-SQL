// 以下は、Node.js (v18.16.1) + `fs` モジュールを使って、**各生徒の最終的な正解数**を効率的に計算・出力する JavaScript プログラムです。

// * **時間計算量：O(M + N)**（M個の誤答を処理＋N人分の正解数の計算）
// * **空間計算量：O(N)**（各生徒の誤答回数を記録）

// ---

// ### ✅ 解法のポイント

// * 各問題は **N-1人が正解** → 全体の正解数は `M` 問中、自分が間違えた数を引いた `M - 間違えた数`。
// * そこで各生徒について「間違えた回数」をカウントしておけば、全員に対して `M - 間違えた回数` を出力すればよい。

// ---

// ### ✅ 実装コード

// ```javascript
const fs = require('fs');

/**
 * 生徒の正解数を計算する関数
 * @param {number} N - 生徒の人数
 * @param {number} M - 出題された問題数
 * @param {number[]} A - 各問題で間違えた生徒番号の配列（1-indexed）
 * @returns {number[]} - 各生徒の正解数（index: 0-based, 値: 正解数）
 */
function calculateCorrectAnswers(N, M, A) {
    const wrongCounts = new Array(N).fill(0);

    for (let i = 0; i < M; i++) {
        const student = A[i] - 1; // 1-indexed を 0-indexed に変換
        wrongCounts[student]++;
    }

    // 正解数 = M - 間違えた回数
    return wrongCounts.map(wrong => M - wrong);
}

// ===== 標準入力処理 =====
function main() {
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/);
    const N = parseInt(input[0]);
    const M = parseInt(input[1]);
    const A = input.slice(2).map(Number);

    const result = calculateCorrectAnswers(N, M, A);
    console.log(result.join('\n'));
}

main();

// ### ✅ 実行方法

// 次のように実行します（`input.txt` に入力を保存しておく場合）：

// ```bash
// node solution.js < input.txt
// ```

// ---

// ### ✅ 入力例

// ```
// 4 6
// 1 4 1 4 2 1
// ```

// ### ✅ 出力例

// ```
// 3
// 5
// 6
// 4
// ```

// ---

// 必要に応じて、プロファイリング (`console.time()` / `process.memoryUsage()` など) も追加可能です。必要でしたら補足します。
