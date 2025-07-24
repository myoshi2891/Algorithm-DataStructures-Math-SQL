// 以下は、Node.js (v18.16.1) と `fs` モジュールを用いて、mod P 上での加算・減算・乗算を高速に処理するコードです。
// 各クエリに対する結果を出力しつつ、**処理時間**と**メモリ使用量**も出力しています。

// ---

// ### ✅ 要件整理

// * **演算は mod P 上**
// * X の初期値は 1
// * クエリ数は最大 200000
// * P は 10^8 以上 2×10^9 以下の素数

// ---

// ### ✅ 実装（Node.js）

// ```javascript
const fs = require('fs');

/**
 * 標準入力からデータを読み取り、mod P 上で加算・減算・乗算を行う
 * @param {string} input - 入力文字列（PとQ、その後のクエリ）
 * @returns {string[]} - 各クエリの結果（文字列の配列）
 */
function processQueries(input) {
  const lines = input.trim().split('\n');
  const [P, Q] = lines[0].split(' ').map(BigInt); // P: 素数, Q: クエリ数
  let X = 1n; // 初期値X
  const result = [];

  for (let i = 1; i <= Q; i++) {
    const [q, y] = lines[i].split(' ').map(BigInt);
    if (q === 1n) {
      X = (X + y) % P;
    } else if (q === 2n) {
      X = (X - y + P) % P;
    } else if (q === 3n) {
      X = (X * y) % P;
    }
    result.push(X.toString());
  }

  return result;
}

// --- メイン処理 ---
const start = process.hrtime.bigint(); // 処理時間測定開始

const input = fs.readFileSync('/dev/stdin', 'utf8');
const result = processQueries(input);

// 結果を出力
console.log(result.join('\n'));

const end = process.hrtime.bigint(); // 処理時間測定終了

// --- パフォーマンス出力 ---
const memoryUsage = process.memoryUsage();
console.error(`実行時間: ${(end - start) / 1_000_000n} ms`);
console.error(`使用メモリ: ${Math.round(memoryUsage.rss / 1024 / 1024)} MB`);

// ### ✅ 補足

// * `BigInt` を使用：`P` が 10^9 を超えるため通常の `Number` では精度不足になります。
// * `X = (X - Y + P) % P;` のように減算では負数対策を入れています。
// * 処理時間やメモリの出力は `stderr` に出力（`console.error`）することで、標準出力に影響を与えず、ジャッジ形式にも対応可能です。

// ---

// ### ✅ 実行方法（Linux / Mac / WSL）

// ```bash
// node solution.js < input.txt
// ```

// ---

// ご希望があれば、クエリ結果をファイル出力するようにもできます。必要であれば教えてください。
