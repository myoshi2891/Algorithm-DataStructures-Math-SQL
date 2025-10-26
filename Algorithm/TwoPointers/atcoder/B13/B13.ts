// * 入力は `fs.readFileSync` を使用して一括で読み取り、
// * アルゴリズムは **しゃくとり法（Two Pointers）** を用いて、計算量 `O(N)` で解を導きます。
// * 実行時間・メモリともに制限内（1秒 / 1024MiB）に収まるように実装しています。

// ---

// ### ✅ TypeScript 実装（`fs`使用・最適化済）

import * as fs from 'fs';

// 入力取得・分割
const input: string[] = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, K]: number[] = input[0].split(' ').map(Number);
const A: number[] = input[1].split(' ').map(Number);

// Two Pointers（しゃくとり法）で全連続部分列のうち合計 <= K の個数を数える
let count: number = 0;
let sum: number = 0;
let right: number = 0;

for (let left = 0; left < N; left++) {
    while (right < N && sum + A[right] <= K) {
        sum += A[right];
        right++;
    }

    count += right - left;

    if (right === left) {
        // A[left] > K のとき、right も一緒に進める
        right++;
    } else {
        sum -= A[left];
    }
}

console.log(count);

// ### ✅ 入力例

// ```
// 7 50
// 11 12 16 22 27 28 31
// ```

// 出力：

// ```
// 13
// ```

// ---

// ### ✅ 工夫ポイント

// | 項目     | 内容                                                   |
// | ------ | ---------------------------------------------------- |
// | 入力     | `fs.readFileSync("/dev/stdin", "utf8")` により高速な一括読み取り |
// | アルゴリズム | `O(N)` のしゃくとり法で、重複計算回避                               |
// | メモリ    | `A[]`と定数変数のみで、メモリ使用量は`O(N)`                          |
// | 型      | `number[]`や`number`を明示し、TypeScriptでの型安全確保            |

// ---

// ### ⏱ パフォーマンス評価（目安）

// | 項目     | 規模     | 備考              |
// | ------ | ------ | --------------- |
// | 最大 N   | 10⁵    | ループ最大 2×10⁵ 回   |
// | 実行時間   | ≒ 数十ms | 1秒以内で十分に収まる     |
// | メモリ使用量 | ≒ 数MB  | 1024MiB 制限に余裕あり |
