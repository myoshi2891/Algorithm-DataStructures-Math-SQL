// 以下は、指定された「カエルの最小コスト移動経路」問題に対する **TypeScript** 実装です。
// Node.js 環境（v18.16.1）に適応し、**`fs` モジュールで入力を受け取り、実行時間・メモリ効率に配慮**しています。

// ---

// ## ✅ TypeScript 実装（`main.ts`）

// ```ts
import * as fs from 'fs';

// 標準入力の読み込み
const input: string[] = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const N: number = parseInt(input[0], 10);
const h: number[] = input[1].split(' ').map(Number);

// 最小コストDP配列と経路復元用の配列
const dp: number[] = new Array(N).fill(Infinity);
const prev: number[] = new Array(N).fill(-1);

dp[0] = 0;

for (let i = 1; i < N; i++) {
    const cost1 = dp[i - 1] + Math.abs(h[i] - h[i - 1]);
    if (cost1 < dp[i]) {
        dp[i] = cost1;
        prev[i] = i - 1;
    }

    if (i > 1) {
        const cost2 = dp[i - 2] + Math.abs(h[i] - h[i - 2]);
        if (cost2 < dp[i]) {
            dp[i] = cost2;
            prev[i] = i - 2;
        }
    }
}

// 経路復元
const path: number[] = [];
let current: number = N - 1;
while (current !== -1) {
    path.push(current + 1); // 足場番号を1-indexedに変換
    current = prev[current];
}
path.reverse();

// 出力
console.log(path.length);
console.log(path.join(' '));

// ## 💡 実装のポイント

// * 時間計算量：`O(N)`
// * 空間計算量：`O(N)`（`dp` と `prev` の2配列）
// * 経路復元では、前の足場インデックスを逆順でたどってから `.reverse()` します。

// ---

// ## 📦 コンパイルと実行

// ```bash
// # コンパイル
// tsc main.ts

// # 実行（テスト用）
// node main.js < input.txt
// ```

// ---

// ## 🧪 動作確認（例）

// **入力**

// ```
// 6
// 30 10 60 10 60 50
// ```

// **出力**

// ```
// 4
// 1 3 5 6
// ```

// ---

// ## ✅ 型安全かつ高速・低メモリな構成です

// * `number[]` を適切に使用
// * `Math.abs()` によるジャンプコスト計算
// * `fs.readFileSync('/dev/stdin')` で高速読み込み
