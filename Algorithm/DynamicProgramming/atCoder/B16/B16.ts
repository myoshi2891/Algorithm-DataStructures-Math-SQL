// 以下は、TypeScript 5.1 + Node.js 18.16.1 環境で、`fs`を使って**最小ジャンプコスト**を求める実装です。
// 処理時間・メモリ効率を重視し、\*\*動的計画法 + 空間最適化（O(1)メモリ）\*\*を採用しています。

// ---

// ### ✅ TypeScript 実装（最小メモリ使用版）

// ```ts
import * as fs from 'fs';

function main(input: string): void {
  const lines: string[] = input.trim().split('\n');
  const N: number = parseInt(lines[0]);
  const h: number[] = lines[1].split(' ').map(Number);

  if (N === 2) {
    console.log(Math.abs(h[1] - h[0]));
    return;
  }

  let prev2: number = 0;  // dp[i-2]
  let prev1: number = Math.abs(h[1] - h[0]);  // dp[i-1]

  for (let i = 2; i < N; i++) {
    const cost1: number = prev1 + Math.abs(h[i] - h[i - 1]);
    const cost2: number = prev2 + Math.abs(h[i] - h[i - 2]);
    const curr: number = Math.min(cost1, cost2);
    prev2 = prev1;
    prev1 = curr;
  }

  console.log(prev1);
}

main(fs.readFileSync('/dev/stdin', 'utf8'));

// ### ✅ 入力形式（標準入力）

// ```
// N
// h1 h2 h3 ... hN
// ```

// ---

// ### ✅ 処理量・メモリ量の評価

// | 指標      | 内容                                      |
// | ------- | --------------------------------------- |
// | 時間計算量   | O(N)                                    |
// | 空間計算量   | O(1)（DP配列なし）                            |
// | 標準入力    | `fs.readFileSync('/dev/stdin', 'utf8')` |
// | 最大対応サイズ | N ≤ 10⁵                                 |

// ---

// ### ✅ 例：入出力

// #### 入力

// ```
// 6
// 30 10 60 10 60 50
// ```

// #### 出力

// ```
// 40
// ```

// ---

// ### 🔎 備考

// * 型安全を重視しつつ、パフォーマンスに優れたコードです。
// * テスト用途では `input.txt` を `fs.readFileSync('input.txt', 'utf8')` などに変更してください。
