// 以下は、TypeScript を用いて **整数が回文かどうかを判定する**プログラムです。
// `fs` を使って標準入力から値を読み取り、**整数変換なし**（文字列に変換しない）で回文を判定します。

// ---

// ### ✅ 要件まとめ

// * `fs` 使用による標準入力対応。
// * `x` を文字列に変換せずに回文か判定。
// * 計算量とメモリ量を抑えた実装。

// ---

// ### ✅ TypeScript 実装（`fs` 使用・整数のみ）

// palindrome.ts
import * as fs from 'fs';

function isPalindrome(x: number): boolean {
    // 負の数や10の倍数（ただし0は除く）は回文にならない
    if (x < 0 || (x % 10 === 0 && x !== 0)) return false;

    let reverted = 0;
    let original = x;

    // 半分だけ反転させる
    while (x > reverted) {
        reverted = reverted * 10 + x % 10;
        x = Math.floor(x / 10);
    }

    // xが奇数桁の時はreverted/10で中央の数字を削除
    return x === reverted || x === Math.floor(reverted / 10);
}

// 標準入力から読み込む
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
const x = parseInt(input);

console.time('exec');
const result = isPalindrome(x);
console.timeEnd('exec');

console.log(result);
// ### ✅ 使用方法（例）

// 以下のように、値を標準入力に渡して実行します：

// ```bash
// echo 121 | ts-node palindrome.ts
// # 出力: true
// ```

// ```bash
// echo -121 | ts-node palindrome.ts
// # 出力: false
// ```

// ```bash
// echo 10 | ts-node palindrome.ts
// # 出力: false
// ```

// ---

// ### ✅ 計算量・メモリ使用量

// * 時間計算量：O(log₁₀(x))（最大で10桁程度）
// * 空間計算量：O(1)（定数変数のみ使用）

// ---

// ### ✅ 解法ポイント（Follow up 対応）

// * **文字列変換を避ける**ため、整数の下位桁から数を逆に構築。
// * 逆数が元の数と一致すれば回文。
// * 途中で反転数が元の数を超えたら、中央を跨いだので比較可能。
