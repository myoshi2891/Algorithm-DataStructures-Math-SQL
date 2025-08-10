// TypeScript版に変更しました。主な変更点と特徴：

// ## TypeScriptの型安全性の活用

// ### 型注釈の追加
// - 全ての変数、パラメータ、戻り値に適切な型を指定
// - `number`、`string`、`number[]`、`string[]`、`void`を明示的に使用
// - TypeScriptの静的型チェックによりランタイムエラーを防止

// ### 関数の型定義
// ```typescript
// function lowerBound(arr: number[], target: number): number
// function insertSorted(arr: number[], value: number): void  
// function findMinDifference(cards: number[], x: number): number
// function solve(input: string): string
// function main(): void
// ```

// ### importの型安全性
// - `import * as fs from 'fs'`でNode.jsのfsモジュールを型安全にインポート
// - TypeScriptコンパイラがfsモジュールの型情報を提供

// ## パフォーマンス特性（JavaScriptと同等）

// ### 時間計算量
// - **クエリ1（カード追加）**: O(n) 
// - **クエリ2（最小差検索）**: O(log n)
// - **全体**: O(Q × n)

// ### メモリ使用量
// - カード配列: O(n) - 最大100,000個の整数
// - TypeScriptのコンパイル後はJavaScriptと同じメモリフットプリント
// - **合計**: O(n) ≈ 400KB程度

// ## TypeScriptの利点
// 1. **コンパイル時型チェック**: 実行前に型エラーを検出
// 2. **IDE支援**: より良いオートコンプリートとリファクタリング
// 3. **保守性**: 型情報により大規模プロジェクトでの保守が容易
// 4. **ランタイム性能**: コンパイル後はJavaScriptと同等の性能

// このTypeScript実装は、元のJavaScript版と同じアルゴリズムを使用しながら、型安全性と開発体験を大幅に向上させています。


import * as fs from 'fs';

/**
 * 二分探索で配列内の値以上の最初の位置を見つける
 * @param arr - ソート済み配列
 * @param target - 検索対象の値
 * @returns 挿入位置のインデックス
 */
function lowerBound(arr: number[], target: number): number {
    let left: number = 0;
    let right: number = arr.length;

    while (left < right) {
        const mid: number = Math.floor((left + right) / 2);
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    return left;
}

/**
 * ソートされた配列に値を挿入する
 * @param arr - ソート済み配列
 * @param value - 挿入する値
 */
function insertSorted(arr: number[], value: number): void {
    const pos: number = lowerBound(arr, value);
    arr.splice(pos, 0, value);
}

/**
 * 整数xと机にあるカードとの差の絶対値の最小値を求める
 * @param cards - ソート済みのカード配列
 * @param x - 比較対象の整数
 * @returns 差の絶対値の最小値、カードがない場合は-1
 */
function findMinDifference(cards: number[], x: number): number {
    if (cards.length === 0) {
        return -1;
    }

    // 二分探索でx以上の最初の値の位置を見つける
    const pos: number = lowerBound(cards, x);

    let minDiff: number = Infinity;

    // pos位置の値との差を確認
    if (pos < cards.length) {
        minDiff = Math.min(minDiff, Math.abs(cards[pos] - x));
    }

    // pos-1位置の値との差を確認
    if (pos > 0) {
        minDiff = Math.min(minDiff, Math.abs(cards[pos - 1] - x));
    }

    return minDiff;
}

/**
 * メインの処理関数
 * @param input - 入力文字列
 * @returns 出力結果
 */
function solve(input: string): string {
    const lines: string[] = input.trim().split('\n');
    const Q: number = parseInt(lines[0]);

    const cards: number[] = []; // ソートされた状態を維持する配列
    const results: number[] = [];

    for (let i = 1; i <= Q; i++) {
        const [query, x]: number[] = lines[i].split(' ').map(Number);

        if (query === 1) {
            // クエリ1: カードを追加
            insertSorted(cards, x);
        } else {
            // クエリ2: 最小差を求める
            const result: number = findMinDifference(cards, x);
            results.push(result);
        }
    }

    return results.join('\n');
}

/**
 * メイン実行関数
 */
function main(): void {
    try {
        const input: string = fs.readFileSync('/dev/stdin', 'utf8');
        const result: string = solve(input);
        console.log(result);
    } catch (error) {
        // 標準入力が使えない場合のテスト用
        const testInput: string = `5
2 30
1 10
2 30
1 40
2 30`;
        const result: string = solve(testInput);
        console.log(result);
    }
}

main();