// 以下は、問題に対して **TypeScript 5.1 + Node.js 18.16.1** 環境で `fs` を使って処理時間・メモリ消費量に配慮して実装したコードです。

// ---

// ## ✅ TypeScript 解法（TypeScript 5.1）

// ### 🔧 実装ポイント

// * 高さ配列 `height` を `O(N)` 時間で前後2回走査。
// * 各条件 `'A'` / `'B'` に対して **昇順／降順制約**を満たすよう補正。
// * 入力は `fs.readFileSync(0, 'utf-8')` で処理。

// ---

// ```ts
// @ts-check
import * as fs from 'fs';

/**
 * 草の高さの合計として考えられる最小値を計算する関数
 * @param N - 草の本数（1 <= N <= 3000）
 * @param S - 'A' または 'B' からなる長さ N-1 の文字列
 * @returns 高さの合計値（条件を満たす中で最小）
 */
function computeMinimumTotalHeight(N: number, S: string): number {
    const height: number[] = new Array(N).fill(1);

    // 左から順に 'A' の条件に従い高さを増加させる
    for (let i = 0; i < N - 1; i++) {
        if (S[i] === 'A' && height[i] >= height[i + 1]) {
            height[i + 1] = height[i] + 1;
        }
    }

    // 右から順に 'B' の条件に従い高さを調整（降順にする）
    for (let i = N - 2; i >= 0; i--) {
        if (S[i] === 'B' && height[i] <= height[i + 1]) {
            height[i] = height[i + 1] + 1;
        }
    }

    // 合計を返す
    return height.reduce((sum, h) => sum + h, 0);
}

/**
 * エントリーポイント関数（標準入力から読み込み）
 */
function main(): void {
    const input: string[] = fs.readFileSync(0, 'utf-8').trim().split('\n');
    const N: number = parseInt(input[0], 10);
    const S: string = input[1];

    const result: number = computeMinimumTotalHeight(N, S);
    console.log(result);
}

main();
// ```

// ---

// ## ✅ 時間・メモリ効率

// * **時間計算量:** `O(N)`
// * **空間計算量:** `O(N)`（`height` 配列のみ使用）

// ---

// ## ✅ 実行方法（例）

// ファイル名 `main.ts` で保存後、次のようにコンパイル＆実行します：

// ```bash
// tsc main.ts --target es2020
// echo -e "7\nAABBBA" | node main.js
// # 出力: 15
// ```

// ---

// ## ✅ 備考

// * `tsc` で TypeScript を JavaScript にトランスパイル（Node.js 18 実行環境向け）。
// * `--target es2020` 以上を指定すれば `Array.prototype.at()` なども使えます（今回は未使用）。

// ---

// ご希望があれば、トポロジカルソートベースの解法や図解も提供可能です。
