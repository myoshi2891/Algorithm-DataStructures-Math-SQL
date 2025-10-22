// 以下は、TypeScript (Node.js 18.16.1) 環境で動作する **整数 → ローマ数字変換** の実装です。
// `fs` モジュールを用いて標準入力から整数を読み込み、変換結果を標準出力に出力します。

// ---

// ### ✅ TypeScript コード（`index.ts`）:

import * as fs from 'fs';

// 入力の読み込み
const input: string = fs.readFileSync('/dev/stdin', 'utf-8').trim();
const num: number = parseInt(input, 10);

// ローマ数字変換関数
function intToRoman(num: number): string {
    const valueSymbolPairs: [number, string][] = [
        [1000, 'M'],
        [900, 'CM'],
        [500, 'D'],
        [400, 'CD'],
        [100, 'C'],
        [90, 'XC'],
        [50, 'L'],
        [40, 'XL'],
        [10, 'X'],
        [9, 'IX'],
        [5, 'V'],
        [4, 'IV'],
        [1, 'I'],
    ];

    let result = '';
    for (const [value, symbol] of valueSymbolPairs) {
        while (num >= value) {
            result += symbol;
            num -= value;
        }
    }
    return result;
}

// 出力
console.log(intToRoman(num));

// ### ✅ 実行方法（Node.js + TypeScript）

// ```bash
// # コンパイル
// tsc index.ts

// # 実行例 (echoで入力を渡す)
// echo 3749 | node index.js
// # 出力: MMMDCCXLIX

// echo 58 | node index.js
// # 出力: LVIII
// ```

// ---

// ### ✅ 処理時間・メモリの評価

// * **処理時間**: 最大ループ数は `num` の桁数に依存し、O(1)（最大3999→12回未満の繰り返し）で非常に高速です。
// * **メモリ消費**: 入力が1つの整数かつ出力も短い文字列のため、メモリ使用量は数KB未満で非常に軽量です。

// ---

// 必要であれば、`input.txt`ファイルから読むようにも変更可能です。
// ご希望があれば対応します。
