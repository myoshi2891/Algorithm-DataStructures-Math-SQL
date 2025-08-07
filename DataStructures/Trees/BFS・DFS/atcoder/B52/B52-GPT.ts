// 以下は、**TypeScript 5.1 + Node.js 18.16.1** で解くコードです。
// 指定された要件（`fs`使用・処理時間/メモリ効率・関数化）をすべて満たしています。

// ---

// ### ✅ 解法概要

// * **幅優先探索（BFS）** で拡張
// * キューを使って白い隣接ボールを青に塗りながら進む
// * 時間・空間ともに `O(N)`

// ---

// ```ts
// 使用環境: TypeScript 5.1 + Node.js 18.16.1
import * as fs from 'fs';

/**
 * シミュレーション処理関数
 * 
 * @param n - ボールの数（1 ≤ n ≤ 100,000）
 * @param x - 開始位置（1-indexed）
 * @param a - ボールの初期状態（"#"=黒, "."=白）
 * @returns シミュレーション後の状態（"@"=青, "#"=黒, "."=白）
 * 
 * 処理時間: O(n)
 * 使用メモリ: O(n)
 */
function simulateBallColoring(n: number, x: number, a: string): string {
    const balls: string[] = a.split('');
    const queue: number[] = [];

    const start = x - 1; // 0-indexed に変換
    balls[start] = '@';
    queue.push(start);

    while (queue.length > 0) {
        const pos = queue.shift() as number;

        const left = pos - 1;
        if (left >= 0 && balls[left] === '.') {
            balls[left] = '@';
            queue.push(left);
        }

        const right = pos + 1;
        if (right < n && balls[right] === '.') {
            balls[right] = '@';
            queue.push(right);
        }
    }

    return balls.join('');
}

/**
 * 標準入力からデータを読み取り、シミュレーション結果を出力するメイン関数
 */
function main(): void {
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
    const [nStr, xStr] = input[0].split(' ');
    const n = parseInt(nStr, 10);
    const x = parseInt(xStr, 10);
    const a = input[1];

    const result = simulateBallColoring(n, x, a);
    console.log(result);
}

main();
// ```

// ---

// ### ⏱️ 処理時間・🧠 メモリ使用量

// * **時間計算量**: `O(N)`
// * **空間計算量**: `O(N)`

//   * 配列 `balls`, `queue` は最大 `N` 要素
//   * 一度塗ったボールは再訪問しないため無駄なし

// ---

// ### ✅ 注意点

// * `fs.readFileSync('/dev/stdin', 'utf8')` は競プロ用標準構文（AtCoderなど）
// * `queue.shift()` は `undefined` の可能性があるため `as number` で型安全処理
// * `X` は1-indexedで与えられるので `X - 1` に変換する必要あり

// ---

// 必要であれば `tsconfig.json` 設定例なども提示可能です。希望があればお知らせください。
