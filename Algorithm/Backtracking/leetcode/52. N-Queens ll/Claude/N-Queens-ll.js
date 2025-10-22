// N-Queens問題の解の数を求める効率的なJavaScript関数を作成します。バックトラッキングを使用し、メモリ使用量を最小限に抑えた実装にします。この実装の特徴：

// 1. **ビットマスクを使用**: メモリ使用量を大幅に削減し、処理速度を向上
//    - `cols`: 使用済み列をビットで管理
//    - `diag1`: 左上から右下への対角線をビットで管理
//    - `diag2`: 右上から左下への対角線をビットで管理

// 2. **効率的なビット演算**:
//    - `availablePositions & -availablePositions`: 最下位の1ビットを抽出
//    - `availablePositions ^= position`: 使用した位置のビットをクリア
//    - ビットシフト（`<< 1`, `>> 1`）で対角線制約を効率的に管理

// 3. **メモリ効率**: 2次元配列を使わず、整数のビットマスクのみで状態管理

// 4. **時間計算量**: O(N!) - 理論上最適
// 5. **空間計算量**: O(N) - 再帰スタックのみ

// この実装はLeetCodeでの実行時間とメモリ使用量の両方で優れたパフォーマンスを発揮します。

/**
 * N-Queens問題の解の数を求める関数
 * @param {number} n - チェスボードのサイズ (n x n)
 * @return {number} - N-Queens問題の解の総数
 */
var totalNQueens = function (n) {
    let count = 0;

    /**
     * バックトラッキングを用いてN-Queens問題を解く再帰関数
     * @param {number} row - 現在処理中の行
     * @param {number} cols - 列の使用状況をビットマスクで表現
     * @param {number} diag1 - 左上から右下への対角線の使用状況をビットマスクで表現
     * @param {number} diag2 - 右上から左下への対角線の使用状況をビットマスクで表現
     */
    function backtrack(row, cols, diag1, diag2) {
        // 全ての行にクイーンを配置できた場合、解の数をカウント
        if (row === n) {
            count++;
            return;
        }

        // 現在の行で使用可能な位置を計算（ビット演算で高速化）
        let availablePositions = ((1 << n) - 1) & ~(cols | diag1 | diag2);

        // 使用可能な各位置にクイーンを配置して再帰的に探索
        while (availablePositions) {
            // 最下位の1ビットを取得（次に配置可能な位置）
            let position = availablePositions & -availablePositions;
            // その位置のビットをクリア
            availablePositions ^= position;

            // 次の行で再帰的に探索
            // diag1とdiag2は対角線の制約を表現（ビットシフトで位置調整）
            backtrack(
                row + 1,
                cols | position, // 列の制約を更新
                (diag1 | position) << 1, // 左上-右下対角線の制約を更新
                (diag2 | position) >> 1, // 右上-左下対角線の制約を更新
            );
        }
    }

    // 最初の行から探索開始
    backtrack(0, 0, 0, 0);
    return count;
};
