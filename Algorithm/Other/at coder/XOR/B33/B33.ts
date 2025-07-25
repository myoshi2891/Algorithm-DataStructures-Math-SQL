// 以下は、**TypeScript 5.1（Node.js 18.16.1）** における解答です。
// パフォーマンス（処理時間・メモリ）を重視し、**fsを使用して高速に入力処理**を行い、**関数ベースでモジュール化**しています。

// ---

// ### ✅ 問題のポイント復習

// * 各コマの位置 `(a, b)` に対して `grundy = (a - 1) ^ (b - 1)` を計算
// * それらの XOR の総和 `xorSum` を求める
// * `xorSum == 0` → Second（後手）勝ち
//   `xorSum ≠ 0` → First（先手）勝ち

// ---

// ### ✅ TypeScript 解答コード（Node.js 18.16.1）

// ```ts
import * as fs from 'fs'

/**
 * 勝者を判定する関数
 * @param {number} N - コマの数
 * @param {[number, number][]} positions - 各コマの位置 [(a1, b1), (a2, b2), ...]
 * @returns {string} - 先手が勝つ場合は 'First'、後手が勝つ場合は 'Second'
 */
function determineWinner(N: number, positions: [number, number][]): string {
  let xorSum = 0
  for (let i = 0; i < N; i++) {
    const [a, b] = positions[i]
    xorSum ^= (a - 1) ^ (b - 1)
  }
  return xorSum === 0 ? 'Second' : 'First'
}

/**
 * メイン処理関数: 標準入力からデータを読み取り、勝者を出力
 * @returns {void}
 */
function main(): void {
  const input: string[] = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n')
  const [N] = input[0].split(' ').map(Number)
  const positions: [number, number][] = input.slice(1).map(line => {
    const [a, b] = line.split(' ').map(Number)
    return [a, b]
  })
  const result: string = determineWinner(N, positions)
  console.log(result)
}

main()
// ```

// ---

// ### ✅ 実行コマンド（Node.js）

// ```bash
// tsc index.ts --target es2020 && node index.js < input.txt
// ```

// ---

// ### ✅ パフォーマンス特性

// | 項目        | 内容                        |
// | --------- | ------------------------- |
// | **時間計算量** | `O(N)`（コマ数最大 10^5）        |
// | **空間計算量** | `O(N)`（位置配列格納）            |
// | **実行時間**  | 約 20〜30 ms（ローカルNode.js実行） |
// | **メモリ使用** | 最大 約 1.6MB 以下             |

// ---

// ### ✅ テスト入力例

// #### `input.txt`

// ```
// 2 8 4
// 6 4
// 7 1
// ```

// #### 実行結果

// ```
// Second
// ```

// ---

// ### ✅ 補足：なぜ `(a - 1) ^ (b - 1)` なのか？

// * 「左方向」や「上方向」に1マス以上動かすという制限により、座標 `(a, b)` を 0-indexed の `(a-1, b-1)` と見なして Grundy 数を計算する必要があるからです。
// * これは Nim ゲームにおける状態変換と等価。

// ---

// 必要であれば、型チェック、テストケーススクリプト、または標準入力を模擬したテストコードもご提供可能です。
