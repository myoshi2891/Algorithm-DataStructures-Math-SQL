// この問題は、指定された位置から開始して隣接する白いボールを青に塗っていくシミュレーション問題です。BFS（幅優先探索）を使用して効率的に解決できます。このソリューションの特徴：

// ## 計算量とメモリ効率
// - **時間計算量**: O(N) - 各ボールは最大1回しか処理されません
// - **空間計算量**: O(N) - ボールの状態を保持する配列とキューが必要です

// ## 最適化のポイント
// 1. **文字列の直接操作を回避**: 文字列を配列に分割して操作し、最後に結合することで効率化
// 2. **BFS使用**: キューを使った幅優先探索で隣接する白いボールを順次処理
// 3. **重複処理の回避**: 一度青に塗ったボールは再度処理されません

// ## 処理の流れ
// 1. 開始位置Xのボールを青に塗り、キューに追加
// 2. キューから位置を取り出し、左右の隣接するボールをチェック
// 3. 隣接するボールが白（'.'）の場合、青（'@'）に塗ってキューに追加
// 4. キューが空になるまで繰り返し

// この実装は制約（N≤100,000、実行時間2秒、メモリ1024MiB）を満たし、効率的にシミュレーションを実行します。

const fs = require('fs');

/**
 * 標準入力を読み込む関数
 * @returns {string[]} 入力行の配列
 */
function readInput() {
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
    return input.split('\n');
}

/**
 * ボール色塗りシミュレーションを実行する関数
 * @param {number} N - ボールの個数
 * @param {number} X - 開始位置（1-indexed）
 * @param {string} A - 初期のボールの色を表す文字列
 * @returns {string} シミュレーション後のボールの色を表す文字列
 */
function simulateBallColoring(N, X, A) {
    // 0-indexedに変換
    const startPos = X - 1;

    // ボールの状態を配列で管理（文字列の直接操作は避ける）
    const balls = A.split('');

    // BFS用のキュー
    const queue = [startPos];

    // 開始位置を青に塗る
    balls[startPos] = '@';

    // BFSでシミュレーション実行
    while (queue.length > 0) {
        const pos = queue.shift();

        // 左隣のボールをチェック (pos-1)
        if (pos > 0 && balls[pos - 1] === '.') {
            balls[pos - 1] = '@';
            queue.push(pos - 1);
        }

        // 右隣のボールをチェック (pos+1)
        if (pos < N - 1 && balls[pos + 1] === '.') {
            balls[pos + 1] = '@';
            queue.push(pos + 1);
        }
    }

    return balls.join('');
}

/**
 * メイン処理関数
 */
function main() {
    const lines = readInput();

    // 入力をパース
    const [N, X] = lines[0].split(' ').map(Number);
    const A = lines[1];

    // シミュレーション実行
    const result = simulateBallColoring(N, X, A);

    // 結果を出力
    console.log(result);
}

// メイン処理実行
main();