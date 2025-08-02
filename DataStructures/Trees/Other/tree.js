// 以下に、**Node.js 18.16.1** の環境で動作し、`fs` を用いて標準入力を読み込み、**隣接行列を構築して出力するコード**を提示します。

// * 処理時間とメモリ効率に配慮（`Array(N).fill(0).map(...` で効率的に初期化）
// * グラフサイズ最大 2000 でも問題なく動作
// * `readFileSync('/dev/stdin')` で標準入力に対応（競プロ形式）

// ---

// ### ✅ 解答コード（JavaScript / Node.js）

// ```javascript
const fs = require('fs');

/**
 * 標準入力から木の情報を読み取り、隣接行列を生成して出力します。
 * @returns {void}
 */
function solve() {
  const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
  const N = parseInt(input[0], 10); // 頂点数

  // 隣接行列の初期化（全て0）
  const adj = Array.from({ length: N }, () => Array(N).fill(0));

  // 各辺の入力を処理し、隣接行列を更新
  for (let i = 1; i < input.length; i++) {
    const [aStr, bStr] = input[i].split(' ');
    const a = parseInt(aStr, 10) - 1; // 0-based index
    const b = parseInt(bStr, 10) - 1;

    adj[a][b] = 1;
    adj[b][a] = 1; // 無向グラフなので対称
  }

  // 出力
  for (let i = 0; i < N; i++) {
    console.log(adj[i].join(' '));
  }
}

solve();

// ### 💡実行方法（例: 入力ファイルあり）

// ```bash
// node index.js < input.txt
// ```

// `input.txt` の内容が以下のようであれば：

// ```
// 6
// 1 2
// 1 3
// 3 4
// 4 5
// 3 6
// ```

// 以下が出力されます：

// ```
// 0 1 1 0 0 0
// 1 0 0 0 0 0
// 1 0 0 1 0 1
// 0 0 1 0 1 0
// 0 0 0 1 0 0
// 0 0 1 0 0 0
// ```

// ---

// ### ✅ 時間・メモリの目安

// * **計算量**: `O(N^2)`（最大で 2000×2000 = 4,000,000 回のアクセス、現代のPCでは余裕）
// * **メモリ使用量**: 約 `32MB`（2000×2000 の整数配列）

// ---

// 必要があれば、`BigInt` や `TypedArray` によるさらなる高速化・省メモリ対応も可能です。希望があれば対応します。
