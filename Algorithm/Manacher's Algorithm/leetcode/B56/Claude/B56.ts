// TypeScript版での主な改善点と特徴：

// ## 型安全性の向上

// 1. **厳密な型定義**: 全ての変数、パラメータ、戻り値に型を明示
// 2. **インターフェース定義**: `Query`と`InputData`で構造化されたデータ型
// 3. **型推論の活用**: TypeScriptの型推論機能を適切に利用

// ## メモリ効率化の考慮

// 1. **適切な配列初期化**: `new Array(n).fill(0)`でメモリを効率的に確保
// 2. **不要なオブジェクト生成を避ける**: プリミティブ型を優先使用
// 3. **文字列操作の最適化**: 必要最小限の文字列処理

// ## パフォーマンス最適化

// 1. **事前計算**: Manacher's algorithmでO(N)時間での前処理
// 2. **クエリ処理**: O(1)時間での高速回文判定
// 3. **メモリアクセス最適化**: 配列アクセスパターンを考慮

// ## 型定義の詳細

// - `Query`: クエリの開始・終了位置を格納
// - `InputData`: 入力全体の構造化表現
// - 関数の型注釈により、入出力の型を明確化

// ## 計算量
// - **時間計算量**: O(N + Q)
// - **空間計算量**: O(N)

// この実装により、TypeScript 5.1環境でも制約条件下で効率的に動作し、型安全性を保ちながら高速な回文判定が可能です。

import * as fs from 'fs';

/**
 * Manacher's algorithmを使用して回文の半径配列を計算
 * @param s - 入力文字列
 * @returns 各位置での最長回文の半径を格納した配列
 */
function manacher(s: string): number[] {
    // 文字間に特殊文字を挿入して奇数長にする
    const processed: string = '#' + s.split('').join('#') + '#';
    const n: number = processed.length;
    const radius: number[] = new Array(n).fill(0);
    let center: number = 0;
    let right: number = 0;

    for (let i: number = 0; i < n; i++) {
        // 対称性を利用して初期値を設定
        if (i < right) {
            radius[i] = Math.min(right - i, radius[2 * center - i]);
        }

        // 回文を拡張
        while (
            i + radius[i] + 1 < n &&
            i - radius[i] - 1 >= 0 &&
            processed[i + radius[i] + 1] === processed[i - radius[i] - 1]
        ) {
            radius[i]++;
        }

        // centerとrightを更新
        if (i + radius[i] > right) {
            center = i;
            right = i + radius[i];
        }
    }

    return radius;
}

/**
 * 指定された範囲が回文かどうかを判定
 * @param radius - Manacher's algorithmで計算された半径配列
 * @param l - 開始位置（1-indexed）
 * @param r - 終了位置（1-indexed）
 * @returns 回文の場合true、そうでなければfalse
 */
function isPalindrome(radius: number[], l: number, r: number): boolean {
    // 1-indexedを0-indexedに変換
    const startIdx: number = l - 1;
    const endIdx: number = r - 1;

    // 処理済み文字列での位置計算
    const center: number = startIdx + endIdx + 1; // 中心位置
    const len: number = endIdx - startIdx + 1; // 部分文字列の長さ

    // 必要な半径と実際の半径を比較
    return radius[center] >= len;
}

/**
 * クエリ情報の型定義
 */
interface Query {
    l: number;
    r: number;
}

/**
 * 入力データの型定義
 */
interface InputData {
    n: number;
    q: number;
    s: string;
    queries: Query[];
}

/**
 * 入力データをパース
 * @param input - 標準入力の内容
 * @returns パースされた入力データ
 */
function parseInput(input: string): InputData {
    const lines: string[] = input.trim().split('\n');
    const [n, q]: number[] = lines[0].split(' ').map(Number);
    const s: string = lines[1];

    const queries: Query[] = [];
    for (let i: number = 0; i < q; i++) {
        const [l, r]: number[] = lines[2 + i].split(' ').map(Number);
        queries.push({ l, r });
    }

    return { n, q, s, queries };
}

/**
 * メイン処理関数
 * @param input - 標準入力の内容
 * @returns 結果の出力文字列
 */
function solve(input: string): string {
    const data: InputData = parseInput(input);

    // Manacher's algorithmで事前計算
    const radius: number[] = manacher(data.s);

    const results: string[] = [];

    // 各クエリを処理
    for (const query of data.queries) {
        if (isPalindrome(radius, query.l, query.r)) {
            results.push('Yes');
        } else {
            results.push('No');
        }
    }

    return results.join('\n');
}

// 標準入力から読み込み
const input: string = fs.readFileSync('/dev/stdin', 'utf8');
console.log(solve(input));
