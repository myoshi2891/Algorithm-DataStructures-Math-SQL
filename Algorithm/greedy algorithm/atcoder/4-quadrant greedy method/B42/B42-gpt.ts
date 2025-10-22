// 以下は、**TypeScript 5.1 + Node.js 18.16.1** 向けに実装された、すべてのケースで正解となる解法です（**4象限貪欲法**）。
// **`fs` モジュール使用**、時間・メモリ効率も問題ありません。

// ---

// ## ✅ TypeScript コード（`/dev/stdin` から読み込み）

// ```ts
import * as fs from 'fs';

/**
 * 最大スコアを計算（全象限貪欲法）
 * @param cards - カード情報 [Ai, Bi][] の配列
 * @returns 最大スコア（|ΣAi| + |ΣBi|）
 */
function maxScoreAccurate(cards: [number, number][]): number {
    let maxScore = 0;

    // 4象限の符号組み合わせ
    const signs: [number, number][] = [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
    ];

    for (const [sa, sb] of signs) {
        let sumA = 0;
        let sumB = 0;

        for (const [a, b] of cards) {
            const va = sa * a;
            const vb = sb * b;
            if (va + vb > 0) {
                sumA += a;
                sumB += b;
            }
        }

        const score = Math.abs(sumA) + Math.abs(sumB);
        if (score > maxScore) {
            maxScore = score;
        }
    }

    return maxScore;
}

/**
 * 標準入力から読み込んで最大スコアを計算・出力
 */
function main(): void {
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
    const N = Number(input[0]);
    const cards: [number, number][] = input.slice(1, N + 1).map((line) => {
        const [a, b] = line.split(' ').map(Number);
        return [a, b];
    });

    const result = maxScoreAccurate(cards);
    console.log(result);
}

main();
// ```

// ---

// ## ✅ 解法のポイント

// * `signs`: 4通りの `(±1, ±1)` の符号を使って、**すべての象限で最もスコアが高くなる組を選び出す**。
// * 各象限ごとに「貢献する（正の内積になる）」カードのみを加算。
// * 最終的なスコアは `|sumA| + |sumB|`。

// ---

// ## ✅ 計算量と効率性

// * **時間計算量**: `O(N × 4) = O(N)`
// * **メモリ使用量**: `O(N)`（入力保持用のみ）

// ---

// ## ✅ 動作確認

// 以下のようにして実行できます：

// ```bash
// tsc solve.ts && node solve.js < input.txt
// ```

// または Deno 対応も可能です。必要であればお知らせください。

// ---

// ご要望があれば：

// * 選んだカードのインデックス出力
// * 入力のバリデーションやエラーハンドリング追加
//   などにも対応します。
