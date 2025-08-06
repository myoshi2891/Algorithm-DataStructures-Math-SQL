// この問題は対応の取れているカッコ列で、どの位置のカッコ同士が対応しているかを見つける問題ですね。スタックを使って効率的に解決できます。このTypeScriptソリューションの主な特徴：

// ## アルゴリズムの説明
// 1. **スタックを使用**: 開きカッコ `(` の位置をスタックに保存
// 2. **閉じカッコ処理**: 閉じカッコ `)` に遭遇したとき、スタックから最新の開きカッコの位置を取得してペアを作成
// 3. **ソート**: 問題の条件 `max(li, ri) < max(li+1, ri+1)` に従ってペアをソート

// ## パフォーマンス最適化
// - **時間計算量**: O(n log n) - スタック処理がO(n)、ソートがO(n log n)
// - **空間計算量**: O(n) - スタックとペア配列の使用
// - **メモリ効率**: 不要な配列コピーを避け、インプレース処理を重視

// ## 関数設計
// - `findBracketPairs()`: カッコの対応を見つける核心処理
// - `sortPairs()`: 出力条件に合わせたソート
// - `solve()`: メイン処理をまとめる関数
// - `measurePerformance()`: 実行時間とメモリ使用量を測定

// 例として `(())()` の場合：
// - 1文字目 `(` → スタックに1を追加
// - 2文字目 `(` → スタックに2を追加  
// - 3文字目 `)` → スタックから2を取得、ペア[2,3]を作成
// - 4文字目 `)` → スタックから1を取得、ペア[1,4]を作成
// - 5文字目 `(` → スタックに5を追加
// - 6文字目 `)` → スタックから5を取得、ペア[5,6]を作成

// ソート後: [2,3], [1,4], [5,6] となり、期待される出力と一致します。

import * as fs from 'fs';

/**
 * カッコ列の対応を見つける関数
 * @param s - 対応の取れているカッコ列
 * @returns 対応するカッコのペアの配列 [左の位置, 右の位置]
 */
function findBracketPairs(s: string): number[][] {
    const stack: number[] = []; // 開きカッコの位置を保存するスタック
    const pairs: number[][] = []; // 対応するカッコのペア
    
    // 各文字を順番に処理
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            // 開きカッコの場合、位置をスタックに追加（1-indexedに変換）
            stack.push(i + 1);
        } else {
            // 閉じカッコの場合、対応する開きカッコをスタックから取得
            const openPos = stack.pop()!;
            const closePos = i + 1; // 1-indexedに変換
            pairs.push([openPos, closePos]);
        }
    }
    
    return pairs;
}

/**
 * カッコのペアを指定された順序でソートする関数
 * 条件: max(li, ri) < max(li+1, ri+1)
 * @param pairs - カッコのペアの配列
 * @returns ソート済みのカッコのペアの配列
 */
function sortPairs(pairs: number[][]): number[][] {
    return pairs.sort((a, b) => {
        const maxA = Math.max(a[0], a[1]);
        const maxB = Math.max(b[0], b[1]);
        return maxA - maxB;
    });
}

/**
 * メイン処理関数
 * @param input - 入力文字列（カッコ列）
 * @returns 結果の文字列
 */
function solve(input: string): string {
    const s = input.trim();
    
    // カッコの対応を見つける
    const pairs = findBracketPairs(s);
    
    // 指定された順序でソート
    const sortedPairs = sortPairs(pairs);
    
    // 結果を文字列形式で出力
    return sortedPairs.map(pair => `${pair[0]} ${pair[1]}`).join('\n');
}

// メモリと時間の使用量を監視するための関数
function measurePerformance<T>(fn: () => T): { result: T, time: number, memory: number } {
    const startTime = process.hrtime.bigint();
    const startMemory = process.memoryUsage().heapUsed;
    
    const result = fn();
    
    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage().heapUsed;
    
    const time = Number(endTime - startTime) / 1000000; // ミリ秒に変換
    const memory = Math.max(0, endMemory - startMemory); // バイト
    
    return { result, time, memory };
}

// 入力の読み取りと処理
const input = fs.readFileSync('/dev/stdin', 'utf8');

const { result, time, memory } = measurePerformance(() => solve(input));

console.log(result);

// デバッグ用（実際の提出時はコメントアウト）
// console.error(`実行時間: ${time.toFixed(2)}ms`);
// console.error(`メモリ使用量: ${(memory / 1024 / 1024).toFixed(2)}MB`);