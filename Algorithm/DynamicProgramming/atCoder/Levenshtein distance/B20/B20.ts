// 以下は、**TypeScript 5.1 + Node.js 18.16.1** 環境で、`fs` を使用しつつ、\*\*編集距離（Levenshtein距離）\*\*を求める最小操作回数を返すコードです。

// ---

// ## ✅ 解法ポイント

// * 操作1: 削除
// * 操作2: 変更
// * 操作3: 挿入

// これらの操作による最小編集距離を **動的計画法（DP）** で求めます。
// 文字数上限が 2000 なので、`O(N×M)` のアルゴリズムで間に合います。

// ---

// ## ✅ TypeScriptコード（`fs`使用、ローリング配列で省メモリ）

import * as fs from 'fs';

/**
 * 文字列 S を T に一致させるのに必要な最小の操作回数を求める関数
 * 操作には、削除・挿入・変更の3種類を許す
 *
 * @param s - 元の文字列
 * @param t - 目標の文字列
 * @returns 最小操作回数（number）
 */
function minEditDistance(s: string, t: string): number {
  const n: number = s.length;
  const m: number = t.length;

  // メモリ節約のために2行のローリング配列使用（O(m)空間）
  const dp: number[][] = Array.from({ length: 2 }, () => new Array(m + 1).fill(0));

  // 初期化：sが空のとき、tにするには挿入操作のみ
  for (let j = 0; j <= m; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= n; i++) {
    const curr = i % 2;
    const prev = 1 - curr;
    dp[curr][0] = i; // tが空のとき、削除操作のみ

    for (let j = 1; j <= m; j++) {
      if (s[i - 1] === t[j - 1]) {
        dp[curr][j] = dp[prev][j - 1]; // 変更不要
      } else {
        dp[curr][j] = Math.min(
          dp[prev][j] + 1,     // 削除
          dp[curr][j - 1] + 1, // 挿入
          dp[prev][j - 1] + 1  // 変更
        );
      }
    }
  }

  return dp[n % 2][m];
}

// 標準入力から読み取り（Node.js環境向け）
const input: string[] = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const S: string = input[0];
const T: string = input[1];

// 結果出力
console.log(minEditDistance(S, T));

// ## ✅ 実行・性能情報（目安）

// | 項目       | 値                     |
// | -------- | --------------------- |
// | 時間計算量    | `O(N × M)`（最大 4百万）    |
// | 空間計算量    | `O(M)`（ローリング配列）       |
// | 実行時間（目安） | 約 40ms～100ms（Node.js） |
// | メモリ使用量   | 約 8～16MB（M = 2000時）   |

// ---

// ## ✅ 実行例

// 入力:

// ```
// tokyo
// kyoto
// ```

// 出力:

// ```
// 4
// ```
