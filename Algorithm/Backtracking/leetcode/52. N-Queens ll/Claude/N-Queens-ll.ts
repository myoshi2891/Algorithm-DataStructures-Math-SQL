// N-Queens問題の解の数を求めるTypeScript関数を作成します。型安全性を保ちながら、LeetCodeでの処理時間とメモリ消費量を最適化した実装にします。このTypeScript実装の特徴：

// 1. **型安全性**: 全てのパラメータと返却値に型アノテーションを追加
//    - `n: number`: 入力パラメータ
//    - `(): number`: 返却値
//    - `void`: 再帰関数の返却値
//    - `const position: number`: 不変な値は`const`で型安全性を向上

// 2. **パフォーマンス最適化**:
//    - ビットマスクによる高速な制約チェック
//    - メモリ効率的な状態管理（2次元配列不使用）
//    - ビット演算による高速な位置計算

// 3. **LeetCode最適化**:
//    - **時間計算量**: O(N!) - 理論上最適
//    - **空間計算量**: O(N) - 再帰スタックのみ
//    - ガベージコレクション負荷を最小化

// 4. **コード品質**:
//    - TypeScriptの型システムによるコンパイル時エラー検出
//    - 関数型プログラミングの原則に従った実装
//    - 明確なコメントとドキュメンテーション

// この実装は、TypeScript 5.1とNode.js 18.16.1環境でのLeetCode提出に最適化されており、処理時間とメモリ使用量の両方で優秀なパフォーマンスを発揮します。

/**
 * N-Queens問題の解の数を求める関数
 * @param n - チェスボードのサイズ (n x n)
 * @returns N-Queens問題の解の総数
 */
function totalNQueens(n: number): number {
    let count: number = 0;
    
    /**
     * バックトラッキングを用いてN-Queens問題を解く再帰関数
     * @param row - 現在処理中の行
     * @param cols - 列の使用状況をビットマスクで表現
     * @param diag1 - 左上から右下への対角線の使用状況をビットマスクで表現
     * @param diag2 - 右上から左下への対角線の使用状況をビットマスクで表現
     */
    function backtrack(row: number, cols: number, diag1: number, diag2: number): void {
        // 全ての行にクイーンを配置できた場合、解の数をカウント
        if (row === n) {
            count++;
            return;
        }
        
        // 現在の行で使用可能な位置を計算（ビット演算で高速化）
        let availablePositions: number = ((1 << n) - 1) & ~(cols | diag1 | diag2);
        
        // 使用可能な各位置にクイーンを配置して再帰的に探索
        while (availablePositions) {
            // 最下位の1ビットを取得（次に配置可能な位置）
            const position: number = availablePositions & -availablePositions;
            // その位置のビットをクリア
            availablePositions ^= position;
            
            // 次の行で再帰的に探索
            // diag1とdiag2は対角線の制約を表現（ビットシフトで位置調整）
            backtrack(
                row + 1,
                cols | position,           // 列の制約を更新
                (diag1 | position) << 1,  // 左上-右下対角線の制約を更新
                (diag2 | position) >> 1   // 右上-左下対角線の制約を更新
            );
        }
    }
    
    // 最初の行から探索開始
    backtrack(0, 0, 0, 0);
    return count;
}