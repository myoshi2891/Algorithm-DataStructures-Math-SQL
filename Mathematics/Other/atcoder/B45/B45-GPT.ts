// 以下に、**TypeScript 5.1 + Node.js 18.16.1** を用いた解答を提示します。
// 要件を満たすために：

// * `fs` を使って標準入力を読み込み、
// * 型を明示し、
// * 関数ベースで処理し、
// * 処理時間・メモリの使用量に注意した定数時間（O(1)）実装とします。

// ---

// ### ✅ TypeScript 解答（fs使用・型明示済）

// ```ts
import * as fs from 'fs';

/**
 * 与えられた3つの整数を操作によってすべて0にできるかを判定します。
 * @param a - 整数a（-10^18以上10^18以下のBigInt）
 * @param b - 整数b（-10^18以上10^18以下のBigInt）
 * @param c - 整数c（-10^18以上10^18以下のBigInt）
 * @returns 'Yes' または 'No'
 */
function canMakeAllZero(a: bigint, b: bigint, c: bigint): string {
    const sum: bigint = a + b + c;

    // 操作では合計は不変 → 合計が0でなければ絶対に不可能
    return sum === 0n ? 'Yes' : 'No';
}

/**
 * メイン関数：標準入力から3つの整数を読み取り、canMakeAllZeroで判定し結果を出力します。
 */
function main(): void {
    const input: string = fs.readFileSync('/dev/stdin', 'utf8').trim();
    const [a, b, c]: bigint[] = input.split(/\s+/).map(BigInt);

    const result: string = canMakeAllZero(a, b, c);
    console.log(result);
}

main();
// ```

// ---

// ### ✅ 実行方法（例）

// 以下のようなコマンドで実行できます：

// ```bash
// $ echo "3 -4 1" | ts-node index.ts
// Yes
// ```

// または、ファイル入力の場合：

// ```bash
// $ ts-node index.ts < input.txt
// ```

// ---

// ### ✅ パフォーマンス

// * **時間計算量**：`O(1)`（定数時間）
// * **空間計算量**：`O(1)`（BigInt変数3つ＋入力文字列）
// * **使用メモリ見積もり**：最大でも数百バイト（1024MiB制限内に収まる）

// ---

// ### ✅ 補足

// * **BigInt** を使うことで、`10^18` の制約にも安全に対応。
// * `fs.readFileSync('/dev/stdin', 'utf8')` で標準入力を処理。
// * `map(BigInt)` によりすべての値を安全に `bigint` 型に変換。

// ---

// 必要であれば、`tsconfig.json` の設定例や、ESBuild/TSCでのビルド手順もお伝えできます。
