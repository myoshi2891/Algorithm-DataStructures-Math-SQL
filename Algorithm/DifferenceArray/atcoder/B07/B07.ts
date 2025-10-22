// TypeScriptでこの問題を解く方法も、基本的に **いもす法（差分配列）+ 累積和** によって高速に処理します。
// Node.jsの`fs`モジュールを使って標準入力を読み取ります。

// ## ✅ TypeScript版コード（`fs`使用）
import * as fs from 'fs';

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const T = Number(input[0]);
const N = Number(input[1]);

// 差分配列（T+1サイズで初期化）
const cnt: number[] = new Array(T + 1).fill(0);

// 出勤・退勤を反映
for (let i = 0; i < N; i++) {
    const [L, R] = input[2 + i].split(' ').map(Number);
    cnt[L] += 1;
    cnt[R] -= 1;
}

// 累積和で時刻 t+0.5 にいる人数を求める
let current = 0;
let result = '';
for (let t = 0; t < T; t++) {
    current += cnt[t];
    result += current + '\n';
}

// 出力（まとめて一括で）
process.stdout.write(result);

// // ## 🔍 解説

// // ### 差分配列の考え方（いもす法）

// // 各従業員 `(L, R)` に対して：

// // * `cnt[L] += 1`（L.5 から入店）
// // * `cnt[R] -= 1`（R.5 から不在になる）

// // これを累積すれば、各 `t+0.5` にいる人数がわかる。

// // ---

// // ## 📈 計算量と制約内チェック

// // * `cnt` のサイズは最大 `T + 1 = 500001` 要素 → 約4MB
// // * 時間計算量：

// //   * 差分更新：O(N)
// //   * 累積和＋出力：O(T)
// //   * 合計：**O(N + T)** → 制約内（各最大 500,000）

// // ---

// // ## ✅ 実行環境補足

// // このTypeScriptコードは以下で実行できます：

// // ```bash
// tsc main.ts
// node main.js < input.txt
// ```

// `tsconfig.json`が必要な場合は以下：

// ```json
// {
//   "compilerOptions": {
//     "target": "ES2020",
//     "module": "commonjs",
//     "strict": true,
//     "esModuleInterop": true
//   }
// }
// ```
