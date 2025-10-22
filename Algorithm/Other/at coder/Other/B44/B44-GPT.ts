// 以下は、指定された制約（TypeScript 5.1 + Node.js 18.16.1、`fs`使用、処理時間とメモリに配慮）に適した **TypeScript 解法** です。

// ---

// ### ✅ 戦略の要点

// * 行の入れ替えを直接2次元配列で行うと非効率なため、**行インデックスのマッピング**（`rowMap`）のみを更新することで、すべての操作を **O(1)** で処理できます。
// * 取得操作では `rowMap[x]` を参照して、元の `grid[rowMap[x]][y]` を取得します。

// ---

// ### ✅ TypeScriptコード

// ```ts
import * as fs from 'fs';

/**
 * 指定された形式の標準入力を受け取り、取得クエリに対応する値を出力する
 * @param input 標準入力（空白区切り文字列）
 * @returns 取得操作に対する出力結果の配列
 */
function processGridOperations(input: string): number[] {
    const tokens = input.trim().split(/\s+/);
    let idx = 0;

    const N = parseInt(tokens[idx++], 10); // グリッドサイズ

    // グリッドの初期化（N x N）
    const grid: number[][] = Array.from({ length: N }, () =>
        Array.from({ length: N }, () => parseInt(tokens[idx++], 10)),
    );

    const Q = parseInt(tokens[idx++], 10); // クエリ数

    // 行のマッピング（論理上の行番号 -> 実際の行インデックス）
    const rowMap: number[] = Array.from({ length: N }, (_, i) => i);

    const result: number[] = [];

    for (let i = 0; i < Q; i++) {
        const queryType = parseInt(tokens[idx++], 10);
        const x = parseInt(tokens[idx++], 10) - 1; // 0-based index
        const y = parseInt(tokens[idx++], 10) - 1;

        if (queryType === 1) {
            // 行の入れ替え（論理的なインデックスを交換）
            [rowMap[x], rowMap[y]] = [rowMap[y], rowMap[x]];
        } else if (queryType === 2) {
            // 値の取得（実際のインデックスを参照）
            result.push(grid[rowMap[x]][y]);
        }
    }

    return result;
}

// 標準入力からデータを読み取り、処理後に出力
function main(): void {
    const input: string = fs.readFileSync('/dev/stdin', 'utf8');
    const output = processGridOperations(input);
    console.log(output.join('\n'));
}

main();
// ```

// ---

// ### ✅ 使用方法

// 上記コードを `main.ts` に保存した場合、以下の手順で実行できます：

// ```bash
// # コンパイル
// tsc main.ts

// # 実行（例: 入力ファイル input.txt を使用）
// node main.js < input.txt
// ```

// ---

// ### ✅ 処理性能

// * **計算量**：全操作は O(Q)、各操作 O(1)
// * **メモリ使用**：500×500 数字（最大25万要素）＋ インデックス配列（500要素）程度 ⇒ 約1〜2MB 以内
// * **制限内で安定して動作**（1秒 / 1024MiB）

// ---

// 必要であれば、ESModules形式（`import fs from 'fs'`）や `readline` を使った逐次処理にも対応可能です。ご希望があればお知らせください。
