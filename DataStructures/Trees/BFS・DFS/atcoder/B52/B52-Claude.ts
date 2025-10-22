// TypeScriptバージョンでボール色塗りシミュレーションを実装します。TypeScriptバージョンでの主な改善点：

// ## 型安全性の向上
// - **型定義**: `BallColor`型でボールの色を厳密に定義
// - **関数パラメータ・戻り値**: 全ての関数で型注釈を明記
// - **変数宣言**: 明示的な型注釈でコンパイル時エラーを防止

// ## パフォーマンス最適化
// - **キューの実装改善**: `shift()`の代わりにインデックス管理を使用してO(1)操作を実現
// - **メモリ効率**: 事前にキュー用配列を確保し、メモリ再配置を最小化
// - **型アサーション**: `as BallColor[]`で不要な型チェックを回避

// ## コードの可読性・保守性
// - **関数分離**: 入力パース処理を独立した関数に分離
// - **明確な型定義**: インターfaces不要の簡潔な型定義
// - **詳細なコメント**: 各関数の制約と動作を明記

// ## 計算量
// - **時間計算量**: O(N) - 各ボールは最大1回のみ処理
// - **空間計算量**: O(N) - ボール状態配列とキュー用配列

// この実装はTypeScript 5.1の機能を活用し、制約（N≤100,000、実行時間2秒、メモリ1024MiB）を満たす高速で型安全なソリューションです。

import * as fs from 'fs';

/**
 * ボールの色を表す型定義
 */
type BallColor = '#' | '.' | '@';

/**
 * 標準入力を読み込む関数
 * @returns {string[]} 入力行の配列
 */
function readInput(): string[] {
    const input: string = fs.readFileSync('/dev/stdin', 'utf8').trim();
    return input.split('\n');
}

/**
 * ボール色塗りシミュレーションを実行する関数
 * @param {number} N - ボールの個数 (1 ≤ N ≤ 100,000)
 * @param {number} X - 開始位置（1-indexed） (1 ≤ X ≤ N)
 * @param {string} A - 初期のボールの色を表す文字列（'#' = 黒, '.' = 白）
 * @returns {string} シミュレーション後のボールの色を表す文字列（'#' = 黒, '.' = 白, '@' = 青）
 */
function simulateBallColoring(N: number, X: number, A: string): string {
    // 0-indexedに変換
    const startPos: number = X - 1;

    // ボールの状態を配列で管理（文字列の直接操作は避けてメモリ効率化）
    const balls: BallColor[] = A.split('') as BallColor[];

    // BFS用のキュー（配列のshift()よりもインデックス管理の方が高速）
    const queue: number[] = new Array(N);
    let queueStart: number = 0;
    let queueEnd: number = 0;

    // 開始位置を青に塗る
    balls[startPos] = '@';
    queue[queueEnd++] = startPos;

    // BFSでシミュレーション実行
    while (queueStart < queueEnd) {
        const pos: number = queue[queueStart++];

        // 左隣のボールをチェック (pos-1)
        if (pos > 0 && balls[pos - 1] === '.') {
            balls[pos - 1] = '@';
            queue[queueEnd++] = pos - 1;
        }

        // 右隣のボールをチェック (pos+1)
        if (pos < N - 1 && balls[pos + 1] === '.') {
            balls[pos + 1] = '@';
            queue[queueEnd++] = pos + 1;
        }
    }

    return balls.join('');
}

/**
 * 入力をパースする関数
 * @param {string[]} lines - 入力行の配列
 * @returns {{N: number, X: number, A: string}} パース済みの入力データ
 */
function parseInput(lines: string[]): { N: number; X: number; A: string } {
    const [N, X]: number[] = lines[0].split(' ').map(Number);
    const A: string = lines[1];

    return { N, X, A };
}

/**
 * メイン処理関数
 */
function main(): void {
    const lines: string[] = readInput();
    const { N, X, A } = parseInput(lines);

    // シミュレーション実行
    const result: string = simulateBallColoring(N, X, A);

    // 結果を出力
    console.log(result);
}

// メイン処理実行
main();
