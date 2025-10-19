// TypeScriptを使用して、効率的な行の交換とマス目の値取得を実装します。この解法の主要なポイントを説明します：

// ## 効率性の工夫

// 1. **行のマッピング配列を使用**：実際の2次元配列の行を物理的に交換する代わりに、`rowMapping`配列で論理的な行インデックスと実際の配列インデックスの対応を管理しています。これにより行の交換がO(1)で実行できます。

// 2. **メモリ効率**：実際のデータは最初に読み込んだ状態のまま保持し、インデックスの管理のみで処理するため、追加のメモリ使用量を最小限に抑えています。

// ## 時間計算量
// - 交換操作：O(1)
// - 取得操作：O(1)
// - 全体：O(Q) where Q はクエリ数

// ## 空間計算量
// - グリッドデータ：O(N²)
// - 行マッピング配列：O(N)
// - 全体：O(N²)

// ## 主要な関数

// - `processGridOperations()`: メイン処理関数（入力文字列から結果配列を返す）
// - `solve()`: ファイル読み込みと問題解決の統合関数
// - `main()`: 実行時間とメモリ使用量の計測付きメイン関数
// - `runTests()`: サンプルケースでのテスト実行関数

// 制約（N≤500, Q≤200000）に対して十分効率的で、実行時間制限1秒とメモリ制限1024MiBを満たす設計になっています。

import * as fs from 'fs';

/**
 * N×Nのマス目に対する行の交換と値の取得を処理する関数
 * @param input 標準入力の文字列
 * @returns 取得操作の結果を配列で返す
 */
function processGridOperations(input: string): number[] {
    const lines = input.trim().split('\n');
    let lineIndex = 0;

    // N（マス目のサイズ）を読み込み
    const N = parseInt(lines[lineIndex++]);

    // 初期のマス目を読み込み
    // メモリ効率のため、行のインデックスマッピングを使用
    const grid: number[][] = [];
    for (let i = 0; i < N; i++) {
        const row = lines[lineIndex++].split(' ').map(Number);
        grid.push(row);
    }

    // 行のマッピング配列（実際の行番号を管理）
    // rowMapping[i] = 論理的なi行目が実際のgrid配列のどのインデックスにあるか
    const rowMapping: number[] = [];
    for (let i = 0; i < N; i++) {
        rowMapping.push(i);
    }

    // クエリ数を読み込み
    const Q = parseInt(lines[lineIndex++]);

    const results: number[] = [];

    // 各クエリを処理
    for (let q = 0; q < Q; q++) {
        const query = lines[lineIndex++].split(' ').map(Number);
        const operation = query[0];

        if (operation === 1) {
            // 交換操作：x行目とy行目を交換
            const x = query[1] - 1; // 0-indexedに変換
            const y = query[2] - 1; // 0-indexedに変換

            // 行のマッピングを交換（実際の配列は移動しない）
            const temp = rowMapping[x];
            rowMapping[x] = rowMapping[y];
            rowMapping[y] = temp;
        } else if (operation === 2) {
            // 取得操作：マス(x,y)の値を取得
            const x = query[1] - 1; // 0-indexedに変換
            const y = query[2] - 1; // 0-indexedに変換

            // 現在のx行目が実際にはどの行にあるかを確認
            const actualRowIndex = rowMapping[x];
            const value = grid[actualRowIndex][y];
            results.push(value);
        }
    }

    return results;
}

/**
 * ファイルから入力を読み込んで問題を解く関数
 * @param inputFilePath 入力ファイルのパス（省略時は標準入力）
 * @returns 結果の配列
 */
function solve(inputFilePath?: string): number[] {
    let input: string;

    if (inputFilePath) {
        // ファイルから読み込み
        input = fs.readFileSync(inputFilePath, 'utf8');
    } else {
        // 標準入力から読み込み（Node.jsの場合）
        input = fs.readFileSync(0, 'utf8');
    }

    return processGridOperations(input);
}

/**
 * メイン実行関数
 */
function main(): void {
    try {
        const startTime = process.hrtime.bigint();
        const initialMemory = process.memoryUsage();

        // 問題を解く
        const results = solve();

        // 結果を出力
        results.forEach((result) => console.log(result));

        // 処理時間とメモリ使用量を計測（デバッグ用）
        const endTime = process.hrtime.bigint();
        const finalMemory = process.memoryUsage();

        const executionTime = Number(endTime - startTime) / 1_000_000; // ミリ秒
        const memoryDiff = (finalMemory.heapUsed - initialMemory.heapUsed) / 1024; // KB

        // デバッグ情報（標準エラー出力）
        console.error(`実行時間: ${executionTime.toFixed(2)}ms`);
        console.error(`メモリ使用量の変化: ${memoryDiff.toFixed(2)}KB`);
    } catch (error) {
        console.error('エラーが発生しました:', error);
        process.exit(1);
    }
}

// テスト用の関数
/**
 * サンプル入力でテストを実行する関数
 */
function runTests(): void {
    const testCase1 = `3
1 2 3
4 5 6
7 8 9
7
2 2 1
1 1 2
2 2 1
2 1 3
1 2 3
2 2 3
2 3 2`;

    const testCase2 = `2
8 16
32 64
3
2 2 1
1 1 2
2 2 1`;

    console.log('テストケース1:');
    const result1 = processGridOperations(testCase1);
    console.log(result1); // [4, 1, 6, 9, 2]

    console.log('\nテストケース2:');
    const result2 = processGridOperations(testCase2);
    console.log(result2); // [32, 8]
}

// スクリプトが直接実行された場合はmain関数を実行
if (require.main === module) {
    // テストを実行したい場合はこちらをコメントアウト
    // runTests();

    // 実際の処理を実行
    main();
}

export { processGridOperations, solve };