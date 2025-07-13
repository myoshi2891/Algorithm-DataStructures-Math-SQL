// 以下はTypeScriptで実装した**最長共通接頭辞 (Longest Common Prefix)** の関数です。

// ### 特徴

// * `fs` モジュールで**処理時間**と**メモリ消費量**を`log.txt`に出力します。
// * 処理は関数ベースで実装。
// * パラメータと戻り値はすべてコメント付き。

// ---

// ```typescript
import * as fs from 'fs';

/**
 * 最長共通接頭辞を求める関数
 * @param strs - string型の配列（最長共通接頭辞を求める対象）
 * @returns string - 最長共通接頭辞。共通部分がなければ空文字を返す。
 */
function longestCommonPrefix(strs: string[]): string {
    if (strs.length === 0) return "";

    let prefix = strs[0];

    for (let i = 1; i < strs.length; i++) {
        // prefixが一致しなくなるまで短くしていく
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (prefix === "") return "";
        }
    }

    return prefix;
}

/**
 * パフォーマンス計測と結果ログ出力用の関数
 * @param strs - string型の配列（最長共通接頭辞を求める対象）
 * @param outputPath - ログファイルの出力先パス
 */
function runWithPerformanceLog(strs: string[], outputPath: string): void {
    const startTime = process.hrtime.bigint(); // 高精度時間計測
    const startMem = process.memoryUsage().heapUsed;

    const result = longestCommonPrefix(strs);

    const endTime = process.hrtime.bigint();
    const endMem = process.memoryUsage().heapUsed;

    const timeElapsedMs = Number(endTime - startTime) / 1_000_000; // ミリ秒に変換
    const memoryUsageKb = (endMem - startMem) / 1024; // KBに変換

    const logData = `
==== Longest Common Prefix Execution ====
Input: ${JSON.stringify(strs)}
Output: ${result}
Time Elapsed: ${timeElapsedMs.toFixed(3)} ms
Memory Usage: ${memoryUsageKb.toFixed(3)} KB
=========================================
`;

    fs.writeFileSync(outputPath, logData);
}

// サンプル実行
const example1 = ["flower", "flow", "flight"];
const example2 = ["dog", "racecar", "car"];

runWithPerformanceLog(example1, 'log_example1.txt');
runWithPerformanceLog(example2, 'log_example2.txt');
// ```

// ---

// ## 実行環境

// * TypeScript 5.1
// * Node.js 18.16.1

// ## 出力ファイル

// * `log_example1.txt`
// * `log_example2.txt`

// それぞれに**処理時間**と**メモリ消費量**が記録されます。

// ---

// ## 補足

// * `process.hrtime.bigint()` を使うことでナノ秒精度の時間計測ができます。
// * `process.memoryUsage().heapUsed` はNode.jsのヒープ領域の消費メモリ（バイト）を返します。
// * `fs.writeFileSync` を使うことで、非同期制御なしで確実にログが出力されます。
