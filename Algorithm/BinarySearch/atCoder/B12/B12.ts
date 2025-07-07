// 以下は TypeScript による解答で、`fs` モジュールを使って標準入力から読み込み、2分探索で $x^3 + x = N$ の正の実数解を求めます。
// 相対・絶対誤差が 0.001 以下になるまで探索し、**精度・速度・メモリ使用量**に配慮しています。

// ## ✅ TypeScript 解答（`fs` 使用）

import * as fs from 'fs';

const input: string = fs.readFileSync('/dev/stdin', 'utf8').trim();
const N: number = parseFloat(input);

let low: number = 0.0;
let high: number = Math.max(1.0, N);
let mid: number = 0.0;

for (let i = 0; i < 100; i++) {
    mid = (low + high) / 2;
    const fx = mid ** 3 + mid;

    if (fx > N) {
        high = mid;
    } else {
        low = mid;
    }
}

// 出力は誤差 0.001 以下になるように固定小数6桁
console.log(mid.toFixed(6));

// ## ✅ 実行環境・計算リソース目安

// | 項目         | 内容                              |
// | ---------- | ------------------------------- |
// | **計算量**    | O(log(N)) ≒ 100ループで収束           |
// | **時間目安**   | 約 1〜3ms（Node.js + TypeScript環境） |
// | **メモリ使用量** | 数MB程度（定数個の変数のみ）                 |

// ---

// ## ✅ 入出力例

// ### 入力:

// ```
// 2
// ```

// ### 出力:

// ```
// 1.000000
// ```

// ---

// ## ✅ 補足：型の使用について

// * `input: string` 明示的に入力型を宣言。
// * `N: number`、`low`, `high`, `mid`, `fx` などすべての変数に型を付けています。
// * 型推論される箇所もありますが、計算誤差に敏感な問題では型明示が安全です。

// ---

// ご希望があれば `readline` ベースの非同期読み取りに変更することも可能です。
