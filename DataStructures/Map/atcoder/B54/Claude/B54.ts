// TypeScriptを使用したソリューションを作成します。TypeScript版の主な改善点と特徴：

// ## TypeScriptの型安全性の活用

// 1. **型定義**:
//    - `InputData` インターフェースで入力データの構造を明確化
//    - 全ての関数パラメーターと戻り値に型注釈を追加
//    - `Map<number, number>` で明示的な型指定

// 2. **型安全性**:
//    - `parseInt()` の第二引数で基数を明示
//    - Null合体演算子 `??` を使用してundefinedの安全な処理
//    - 明示的な型変換で予期しない型エラーを防止

// ## パフォーマンスと安全性の最適化

// 1. **メモリ効率**:
//    - `Map` を使用して値の出現回数のみを記録
//    - 不要な配列のコピーを避ける
//    - ガベージコレクションに配慮した変数スコープ

// 2. **処理時間の最適化**:
//    - O(N)の線形時間計算量を維持
//    - 二重ループを避けて効率的なアルゴリズム
//    - Math.floor()を使用して明示的な整数演算

// 3. **エラーハンドリング**:
//    - 入力制約の検証
//    - try-catchブロックによる例外処理
//    - 適切なプロセス終了コード

// ## アルゴリズムの詳細

// **入力例での動作**:
// ```
// 入力: [30, 10, 30, 20, 10, 30]
// - 30が3回出現 → C(3,2) = 3
// - 10が2回出現 → C(2,2) = 1
// - 20が1回出現 → C(1,2) = 0
// 合計: 4ペア
// ```

// **計算量**:
// - 時間: O(N) - 配列の一回スキャン + Map操作
// - 空間: O(K) - Kは異なる値の数（最悪でもO(N)）

// この実装は、TypeScriptの型安全性を活用しつつ、大規模な入力（N≤100,000）に対しても効率的に動作します。

import * as fs from 'fs';

/**
 * 入力データの型定義
 */
interface InputData {
    n: number;
    arr: number[];
}

/**
 * 標準入力を同期的に読み込む
 * @returns {string} 入力データの文字列
 */
function readInput(): string {
    return fs.readFileSync('/dev/stdin', 'utf8').trim();
}

/**
 * 入力データを解析して配列に変換
 * @param input - 入力データの文字列
 * @returns 配列のサイズと要素を含むオブジェクト
 */
function parseInput(input: string): InputData {
    const lines: string[] = input.split('\n');
    const n: number = parseInt(lines[0], 10);
    const arr: number[] = [];

    for (let i = 1; i <= n; i++) {
        arr.push(parseInt(lines[i], 10));
    }

    return { n, arr };
}

/**
 * 条件を満たすペア(i, j)の数を計算
 * 1 <= j < i <= N かつ Aj = Ai を満たすペアの数を返す
 *
 * アプローチ: 各値の出現回数をカウントし、組み合わせ数を計算
 * 同じ値がk個ある場合、ペア数は k * (k-1) / 2
 *
 * 時間計算量: O(N)
 * 空間計算量: O(N) - 最悪の場合（全て異なる値）
 *
 * @param arr - 入力配列
 * @returns 条件を満たすペアの総数
 */
function countPairs(arr: number[]): number {
    // 各値の出現回数をカウント（メモリ効率を考慮してMapを使用）
    const countMap = new Map<number, number>();

    // O(N)で配列をスキャンし、出現回数をカウント
    for (const num of arr) {
        const currentCount = countMap.get(num) ?? 0;
        countMap.set(num, currentCount + 1);
    }

    let totalPairs: number = 0;

    // 各値について、ペア数を計算
    // O(distinct values)で処理（最悪でもO(N)）
    for (const count of countMap.values()) {
        if (count >= 2) {
            // k個の要素から2個を選ぶ組み合わせ数 = k * (k-1) / 2
            // ビット演算を使わずに明示的に計算してオーバーフローを防ぐ
            totalPairs += Math.floor((count * (count - 1)) / 2);
        }
    }

    return totalPairs;
}

/**
 * メイン処理関数
 * 入力の読み込み、解析、計算、出力を統括
 */
function main(): void {
    try {
        const input: string = readInput();
        const { n, arr }: InputData = parseInput(input);

        // 入力サイズの検証（制約チェック）
        if (n < 1 || n > 100000) {
            throw new Error('N is out of range');
        }

        if (arr.length !== n) {
            throw new Error('Array length does not match N');
        }

        const result: number = countPairs(arr);
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// 実行
main();