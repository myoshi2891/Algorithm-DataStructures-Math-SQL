// TypeScriptを使用してダブリング法で実装します。型安全性を保ちながら最適なパフォーマンスを実現します。## TypeScript実装の特徴

// ### 1. **型安全性の確保**
// - **厳密な型定義**: すべての関数パラメーターと戻り値に型注釈
// - **インターフェース定義**: `DoublingTable`で構造体を明確化
// - **エラーハンドリング**: 入力検証と適切なエラーメッセージ

// ### 2. **パフォーマンス最適化**
// ```typescript
// // ダブリング法の時間計算量: O(N × log K)
// // 直接計算の時間計算量: O(N × K) ただしK≤100のみ
// // ハイブリッドアプローチで最適化
// ```

// ### 3. **メモリ効率化**
// - **事前配列確保**: `new Array(N)`でメモリアロケーションを最小化
// - **適応的上限設定**: `Math.min(N * 2, 1000000)`でメモリ制限を考慮
// - **定期的GC**: 大きなNの場合のメモリクリーンアップ

// ### 4. **関数設計の特徴**

// #### **基本操作関数**
// - `getDigitSum(n: number): number` - 桁和計算
// - `performOperation(n: number): number` - 1回操作

// #### **ダブリング法関数**
// - `buildDoublingTable(maxN: number, maxK: number): DoublingTable` - 前処理
// - `queryWithDoubling(start: number, k: number, table: DoublingTable): number` - クエリ処理

// #### **最適化関数**
// - `directCalculation(start: number, k: number): number` - 小さなK用
// - `hybridCalculation(start: number, k: number, table?: DoublingTable): number` - 統合処理

// ### 5. **パフォーマンス監視**
// - **実行時間測定**: `process.hrtime.bigint()`を使用
// - **メモリ使用量測定**: `process.memoryUsage()`を使用
// - **メトリクス出力**: 開発時のパフォーマンス分析用

// ### 6. **制約への対応**
// - **実行時間制限**: 4秒 → O(N log K)で余裕をもって処理
// - **メモリ制限**: 1024MiB → 適応的な上限設定で制御
// - **入力制約**: N≤300,000, K≤10^9 → 完全対応

// この実装により、**理論上最適な計算量**を実現し、TypeScriptの型安全性とパフォーマンスを両立させています。

import * as fs from 'fs';

/**
 * 数値の各桁の和を計算する関数
 * @param n - 対象の数値
 * @returns 各桁の数字の和
 */
function getDigitSum(n: number): number {
    let sum = 0;
    while (n > 0) {
        sum += n % 10;
        n = Math.floor(n / 10);
    }
    return sum;
}

/**
 * 一回の操作を行う関数（数値から各桁の和を引く）
 * @param n - 対象の数値
 * @returns 操作後の数値
 */
function performOperation(n: number): number {
    return n - getDigitSum(n);
}

/**
 * ダブリング法用のテーブル構造
 */
interface DoublingTable {
    /** テーブルの最大インデックス */
    maxIndex: number;
    /** ビット数 */
    maxBit: number;
    /** ダブリングテーブル: table[bit][i] = i から 2^bit 回操作後の値 */
    table: number[][];
}

/**
 * ダブリング用テーブルを構築する関数
 * @param maxN - 最大の数値
 * @param maxK - 最大の操作回数
 * @returns 構築されたダブリングテーブル
 */
function buildDoublingTable(maxN: number, maxK: number): DoublingTable {
    const maxBit = Math.ceil(Math.log2(maxK + 1));
    const maxIndex = Math.min(maxN * 2, 1000000); // メモリ制限を考慮

    // テーブルの初期化
    const table: number[][] = new Array(maxBit + 1);

    // bit=0: 1回操作後の値を事前計算
    table[0] = new Array(maxIndex + 1);
    for (let i = 0; i <= maxIndex; i++) {
        table[0][i] = performOperation(i);
    }

    // ダブリング前処理: table[bit][i] = table[bit-1][table[bit-1][i]]
    for (let bit = 1; bit <= maxBit; bit++) {
        table[bit] = new Array(maxIndex + 1);
        for (let i = 0; i <= maxIndex; i++) {
            const intermediate = table[bit - 1][i];
            if (intermediate >= 0 && intermediate <= maxIndex) {
                table[bit][i] = table[bit - 1][intermediate];
            } else {
                // 範囲外の場合はそのまま保持
                table[bit][i] = intermediate;
            }
        }
    }

    return {
        maxIndex,
        maxBit,
        table,
    };
}

/**
 * ダブリング法を使用してK回操作後の値を計算する関数
 * @param start - 開始値
 * @param k - 操作回数
 * @param doublingTable - 事前構築されたダブリングテーブル
 * @returns K回操作後の値
 */
function queryWithDoubling(start: number, k: number, doublingTable: DoublingTable): number {
    let current = start;
    let remaining = k;

    // ビットごとに処理
    for (let bit = 0; bit <= doublingTable.maxBit && remaining > 0; bit++) {
        if (remaining & (1 << bit)) {
            if (current >= 0 && current <= doublingTable.maxIndex) {
                // 事前計算済みの範囲内
                current = doublingTable.table[bit][current];
            } else {
                // 範囲外は直接計算
                const steps = 1 << bit;
                for (let step = 0; step < steps && remaining > 0; step++) {
                    current = performOperation(current);
                    remaining--;
                }
                remaining += 1 << bit;
            }
            remaining -= 1 << bit;
        }
    }

    return current;
}

/**
 * 小さなK値に対する直接計算の最適化関数
 * @param start - 開始値
 * @param k - 操作回数（小さい値を想定）
 * @returns K回操作後の値
 */
function directCalculation(start: number, k: number): number {
    let current = start;
    for (let i = 0; i < k; i++) {
        current = performOperation(current);
    }
    return current;
}

/**
 * ハイブリッドアプローチによる最適化された計算関数
 * @param start - 開始値
 * @param k - 操作回数
 * @param doublingTable - ダブリングテーブル（大きなK用）
 * @returns K回操作後の値
 */
function hybridCalculation(start: number, k: number, doublingTable?: DoublingTable): number {
    // K=0の特別ケース
    if (k === 0) return start;

    // 小さなKは直接計算の方が高速
    const DIRECT_THRESHOLD = 100;
    if (k <= DIRECT_THRESHOLD) {
        return directCalculation(start, k);
    }

    // 大きなKはダブリング法を使用
    if (!doublingTable) {
        throw new Error('ダブリングテーブルが必要です');
    }

    return queryWithDoubling(start, k, doublingTable);
}

/**
 * メイン解答関数
 * @param input - 入力文字列（標準入力形式）
 * @returns 出力文字列（改行区切り）
 */
function solve(input: string): string {
    const lines = input.trim().split('\n');
    const [N, K] = lines[0].split(' ').map(Number);

    // 入力検証
    if (N < 1 || N > 300000) {
        throw new Error(`N は 1 から 300000 の範囲である必要があります: ${N}`);
    }
    if (K < 1 || K > 1000000000) {
        throw new Error(`K は 1 から 10^9 の範囲である必要があります: ${K}`);
    }

    // K=0の特別ケース
    if (K === 0) {
        const results: string[] = [];
        for (let i = 1; i <= N; i++) {
            results.push(i.toString());
        }
        return results.join('\n');
    }

    // 結果配列を事前確保（メモリ効率化）
    const results: string[] = new Array(N);

    // 小さなKは直接計算で高速処理
    const DIRECT_THRESHOLD = 100;
    if (K <= DIRECT_THRESHOLD) {
        for (let i = 1; i <= N; i++) {
            results[i - 1] = directCalculation(i, K).toString();
        }
        return results.join('\n');
    }

    // 大きなKはダブリング法を使用
    const doublingTable = buildDoublingTable(N, K);

    for (let i = 1; i <= N; i++) {
        results[i - 1] = hybridCalculation(i, K, doublingTable).toString();

        // 大きなNの場合、定期的にメモリクリーンアップのヒントを提供
        if (i % 50000 === 0 && global.gc) {
            global.gc();
        }
    }

    return results.join('\n');
}

/**
 * パフォーマンス測定付きの実行関数
 * @param input - 入力文字列
 * @returns 結果とパフォーマンス情報
 */
function solveWithPerformanceMetrics(input: string): {
    result: string;
    metrics: { time: number; memory: number };
} {
    const startTime = process.hrtime.bigint();
    const startMemory = process.memoryUsage().heapUsed;

    const result = solve(input);

    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage().heapUsed;

    const timeMs = Number(endTime - startTime) / 1000000; // ナノ秒をミリ秒に変換
    const memoryMB = (endMemory - startMemory) / (1024 * 1024); // バイトをMBに変換

    return {
        result,
        metrics: {
            time: timeMs,
            memory: memoryMB,
        },
    };
}

/**
 * メイン実行関数
 */
function main(): void {
    try {
        // 標準入力から読み取り
        const input = fs.readFileSync('/dev/stdin', 'utf8');
        const output = solve(input);
        console.log(output);
    } catch (error) {
        if (error instanceof Error && error.message.includes('ENOENT')) {
            // テスト用のサンプル実行
            console.error('標準入力が見つかりません。サンプル実行します。');
            const sampleInput = '10 1';
            const { result, metrics } = solveWithPerformanceMetrics(sampleInput);
            console.log('=== サンプル出力 ===');
            console.log(result);
            console.log('=== パフォーマンス ===');
            console.log(`実行時間: ${metrics.time.toFixed(2)}ms`);
            console.log(`メモリ使用量: ${metrics.memory.toFixed(2)}MB`);
        } else {
            console.error('エラーが発生しました:', error);
            process.exit(1);
        }
    }
}

// 型定義のエクスポート（テスト用）
export type { DoublingTable };

// 関数のエクスポート（テスト用）
export {
    getDigitSum,
    performOperation,
    buildDoublingTable,
    queryWithDoubling,
    directCalculation,
    hybridCalculation,
    solve,
    solveWithPerformanceMetrics,
};

// メイン実行
if (require.main === module) {
    main();
}
