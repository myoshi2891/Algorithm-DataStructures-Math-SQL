// 以下は、指定された制約（Node.js 18.16.1、`fs` 使用、時間制限 1 秒、メモリ制限 1024 MiB）を考慮して、高速に動作するJavaScript（Node.js）プログラムです。

// ### ✅ アルゴリズムの要点

// * 実際に2次元配列を行ごとに交換すると時間がかかるため、\*\*「インデックスだけを並び替える」\*\*ことで高速化しています。
// * `rowMap[i]` を使って、現在の `i` 行目がどの元の行に対応しているかを保持します。
// * 各取得操作では `rowMap[x - 1]` を参照して、元の配列から直接値を取得します。

// ---

// ### ✅ コード（`fs` 利用、処理時間・メモリに配慮）

// ```javascript
const fs = require('fs');

/**
 * 入力を標準入力から読み込み、各操作を処理して取得結果を出力する
 */
function main() {
    const input = fs.readFileSync('/dev/stdin', 'utf8').split(/\s+/);
    let idx = 0;

    const N = parseInt(input[idx++]); // グリッドサイズ

    // 初期の行列を読み込む
    const grid = Array.from({ length: N }, () =>
        Array.from({ length: N }, () => parseInt(input[idx++])),
    );

    const Q = parseInt(input[idx++]); // クエリ数

    // 行インデックスのマッピング（実際の行を操作せずインデックスで管理）
    const rowMap = Array.from({ length: N }, (_, i) => i);

    const output = [];

    for (let q = 0; q < Q; q++) {
        const type = parseInt(input[idx++]);
        const x = parseInt(input[idx++]) - 1; // 0-based index
        const y = parseInt(input[idx++]) - 1;

        if (type === 1) {
            // 交換操作: 行 x と 行 y を入れ替える
            [rowMap[x], rowMap[y]] = [rowMap[y], rowMap[x]];
        } else {
            // 取得操作: 現在の x 行目の y 列目の値を出力
            output.push(grid[rowMap[x]][y]);
        }
    }

    console.log(output.join('\n'));
}

main();
// ```

// ---

// ### ✅ 特徴

// * **高速**: 各クエリは O(1) で処理できます（インデックス操作のみ）。
// * **省メモリ**: 2次元配列（最大 500x500）＋1次元の行マッピング配列（500）でメモリ使用も効率的。
// * **シンプルな構造**: 実行時間・メモリ制限内で確実に収まります。

// ---

// ### ✅ 実行方法（例）

// ```bash
// node solution.js < input.txt
// ```

// ---

// 必要があれば、`標準入力の代わりにファイルを使いたい`や`結果をファイルに出力したい`といった要望にも対応できます。
