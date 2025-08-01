// 以下は、与えられた問題に対する **JavaScript (Node.js 18.16.1)** による解答です。

// この問題は、操作の履歴を出力する必要があるので、**目標の `(X, Y)` から `(1, 1)` に逆戻りする逆操作を考えると効率的**です。

// ---

// ### ✅ アルゴリズム概要（逆操作）

// * 操作は2種類：

//   1. `x ← x + y`
//   2. `y ← x + y`
// * 逆操作では：

//   * `x > y` のとき、直前は `x ← x + y` なので、`x ← x - y`
//   * `y > x` のとき、直前は `y ← x + y` なので、`y ← y - x`
// * このように `x` または `y` が 1 に到達するまで操作を戻していきます。

// ---

// ### ✅ コード（Node.js, fs 使用）

// ```javascript
// 使用Node.js: v18.16.1
const fs = require('fs');

/**
 * 与えられたX, Yを (1, 1) からの操作列で構築する手順を返す。
 * @param {number} X - 目標の x の値
 * @param {number} Y - 目標の y の値
 * @returns {string} - 操作回数と各操作後の (x, y) のリストを文字列で返す
 */
function findOperations(X, Y) {
  const path = [];
  let x = X, y = Y;

  // 逆から構築
  while (!(x === 1 && y === 1)) {
    path.push([x, y]);
    if (x > y) {
      x -= y;
    } else {
      y -= x;
    }
  }

  path.reverse(); // 初期状態 (1, 1) から順に並べる

  let output = path.length + '\n';
  for (const [a, b] of path) {
    output += `${a} ${b}\n`;
  }
  return output;
}

// ---- 入出力処理部 ----
function main() {
  const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/).map(Number);
  const [X, Y] = input;
  const result = findOperations(X, Y);
  console.log(result);
}

main();
// ```

// ---

// ### ✅ 実行例

// #### 入力:

// ```
// 5 2
// ```

// #### 出力:

// ```
// 3
// 1 2
// 3 2
// 5 2
// ```

// ---

// ### ✅ 計算量・メモリ

// * 時間計算量: `O(log(max(X, Y)))`（ユークリッドの互除法に類似）
// * 空間計算量: `O(K)` （操作のステップ数に比例）

// ---

// ### ✅ 注意点

// * 入力 `(X, Y)` の最大公約数は 1 なので、確実に `(1, 1)` に到達可能。
// * 各ステップで操作内容を記録し、最終的に逆順に出力すればOK。
