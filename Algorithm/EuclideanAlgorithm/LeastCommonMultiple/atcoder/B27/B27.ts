// 以下に、TypeScript 5.1 + Node.js 18.16.1 環境向けに、**標準入力から整数 A, B を読み取り、最小公倍数（LCM）を計算して出力するコード**を提示します。

// ---

// ## ✅ 特徴

// * `fs.readFileSync('/dev/stdin', 'utf-8')` で入力を読み込み
// * `BigInt` を使用して **64bit を超える積にも対応**
// * GCD: ユークリッドの互除法による計算（`O(log(min(A,B)))`）
// * TypeScriptで **型定義明示**

// ---

// ## ✅ TypeScript 実装コード

import * as fs from 'fs';

/**
 * 最大公約数を求める関数（ユークリッドの互除法）
 * @param a - 整数 a（BigInt）
 * @param b - 整数 b（BigInt）
 * @returns aとbの最大公約数（BigInt）
 */
function gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
        const temp: bigint = b;
        b = a % b;
        a = temp;
    }
    return a;
}

/**
 * 最小公倍数を求める関数
 * @param a - 整数 a（BigInt）
 * @param b - 整数 b（BigInt）
 * @returns aとbの最小公倍数（BigInt）
 */
function lcm(a: bigint, b: bigint): bigint {
    return (a / gcd(a, b)) * b;
}

/**
 * 標準入力を読み込んで最小公倍数を計算し出力する関数
 */
function main(): void {
    const input: string = fs.readFileSync('/dev/stdin', 'utf-8').trim();
    const [aStr, bStr]: string[] = input.split(' ');
    const a: bigint = BigInt(aStr);
    const b: bigint = BigInt(bStr);

    const result: bigint = lcm(a, b);
    console.log(result.toString()); // BigIntの文字列出力
}

main();

// ## ✅ 処理性能

// * **時間計算量**: `O(log(min(A, B)))` （GCDの計算がボトルネック）
// * **空間計算量**: `O(1)` （定数領域のみ使用）
// * **使用メモリ**: 数個の `BigInt` のみ（\~数百バイト）
// * **入力制約**: `1 ≤ A, B ≤ 10^9` でも **安全に処理**

// ---

// ## ✅ サンプル確認

// 入力（例）:

// ```
// 998244353 998244853
// ```

// 出力:

// ```
// 996492287418565109
// ```

// ---

// ご希望に応じて `Promise` や非同期 `fs/promises` 対応にも変更可能です。さらに処理性能評価が必要であれば `console.time()` などを追加できます。
