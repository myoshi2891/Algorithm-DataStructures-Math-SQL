// この問題を分析してTypeScriptで解決します。

// 問題の理解：
// - N人の生徒がM問のクイズに参加
// - i問目では、Ai番目の生徒以外の全員が正解
// - 各生徒の最終的な正解数を求める

// つまり、各生徒の正解数は「総問題数M - その生徒が間違えた問題数」となります。このTypeScriptソリューションの特徴：

// **アルゴリズムの効率性：**
// - 時間計算量: O(M + N) - 各問題を1回ずつ処理し、各生徒の結果を1回ずつ計算
// - 空間計算量: O(N) - 生徒数分の配列のみを使用

// **メモリ効率の工夫：**
// - `wrongCount`配列で各生徒の間違い数のみを追跡
// - 不要なデータ構造を避け、必要最小限のメモリ使用

// **処理時間の最適化：**
// - 単純なカウンティングアルゴリズムで最小限の計算
// - 配列の初期化と反復処理のみで複雑な計算を回避

// **関数設計：**
// - `calculateCorrectAnswers()`: メインロジック（生徒数、問題数、間違えた生徒配列 → 正解数配列）
// - `parseInput()`: 入力解析（入力文字列 → 構造化データ）
// - `formatOutput()`: 出力整形（正解数配列 → 出力文字列）

// **入力例1での動作：**
// - N=4, M=6, 間違えた生徒: [1,4,1,4,2,1]
// - 生徒1: 3回間違い → 6-3=3問正解
// - 生徒2: 1回間違い → 6-1=5問正解
// - 生徒3: 0回間違い → 6-0=6問正解
// - 生徒4: 2回間違い → 6-2=4問正解

// 制約内での動作保証：
// - N, M ≤ 200,000でも十分高速
// - メモリ使用量は1024MiB制限内
// - 実行時間は1秒制限内

import * as fs from 'fs';

/**
 * 各生徒の正解数を計算する関数
 * @param n - 生徒の人数
 * @param m - 問題数
 * @param wrongAnswers - 各問題で間違えた生徒の番号の配列
 * @returns 各生徒の正解数の配列
 */
function calculateCorrectAnswers(n: number, m: number, wrongAnswers: number[]): number[] {
    // 各生徒の間違えた問題数をカウント
    const wrongCount = new Array(n + 1).fill(0); // 1-indexedなのでn+1で初期化

    // 各問題で間違えた生徒をカウント
    for (const studentId of wrongAnswers) {
        wrongCount[studentId]++;
    }

    // 各生徒の正解数を計算（総問題数 - 間違えた問題数）
    const correctCounts: number[] = [];
    for (let i = 1; i <= n; i++) {
        correctCounts.push(m - wrongCount[i]);
    }

    return correctCounts;
}

/**
 * 入力データを解析する関数
 * @param input - 標準入力の文字列
 * @returns パースされたデータ {n: 生徒数, m: 問題数, wrongAnswers: 間違えた生徒の配列}
 */
function parseInput(input: string): { n: number; m: number; wrongAnswers: number[] } {
    const lines = input.trim().split('\n');
    const [n, m] = lines[0].split(' ').map(Number);
    const wrongAnswers = lines[1].split(' ').map(Number);

    return { n, m, wrongAnswers };
}

/**
 * 結果を出力形式に変換する関数
 * @param correctCounts - 各生徒の正解数の配列
 * @returns 出力文字列
 */
function formatOutput(correctCounts: number[]): string {
    return correctCounts.join('\n');
}

/**
 * メイン処理関数
 */
function main(): void {
    try {
        // 標準入力から読み込み
        const input = fs.readFileSync('/dev/stdin', 'utf8');

        // 処理時間計測開始
        const startTime = process.hrtime.bigint();

        // 入力データの解析
        const { n, m, wrongAnswers } = parseInput(input);

        // 各生徒の正解数を計算
        const correctCounts = calculateCorrectAnswers(n, m, wrongAnswers);

        // 結果を出力
        const output = formatOutput(correctCounts);
        console.log(output);

        // 処理時間計測終了
        const endTime = process.hrtime.bigint();
        const executionTime = Number(endTime - startTime) / 1_000_000; // ナノ秒からミリ秒に変換

        // デバッグ情報（実際の提出時はコメントアウト）
        // console.error(`実行時間: ${executionTime.toFixed(2)}ms`);
        // console.error(`メモリ使用量: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    } catch (error) {
        console.error('エラーが発生しました:', error);
        process.exit(1);
    }
}

// プログラム実行
main();