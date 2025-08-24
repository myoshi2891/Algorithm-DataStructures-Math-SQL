# N-Queens問題の解の数を求めるPython実装を作成します。LeetCodeの形式に合わせ、型アノテーションとパフォーマンス最適化に重点を置いた実装にします。このPython実装の特徴：

# 1. **LeetCode形式準拠**:
#    - `class Solution` でクラス定義
#    - `totalNQueens` メソッドでLeetCodeの要求仕様に対応
#    - CPython 3.11.4に最適化

# 2. **型アノテーション完備**:
#    - 全てのパラメータと返却値に型ヒントを追加
#    - Pylanceによる型チェックに対応
#    - `int` 型を明示的に指定

# 3. **パフォーマンス最適化**:
#    - **ビットマスク操作**: メモリ使用量を大幅削減
#    - **再帰による解の数集計**: 不要なリスト作成を回避
#    - **ビット演算**: `&`, `|`, `^`, `<<`, `>>`による高速計算

# 4. **メモリ効率**:
#    - **時間計算量**: O(N!) - 理論上最適
#    - **空間計算量**: O(N) - 再帰スタックのみ
#    - 2次元リストやセット構造を使用せず、整数ビットマスクのみで状態管理

# 5. **LeetCode最適化ポイント**:
#    - 早期リターンによる不要な計算の回避
#    - インライン関数による関数呼び出しオーバーヘッド削減
#    - ガベージコレクション負荷の最小化

# この実装は、Python特有の動的型付けによるオーバーヘッドを最小限に抑え、ビット操作による高速化でLeetCodeでの実行時間とメモリ使用量の両方で優秀な結果を得られます。

class Solution:
    def totalNQueens(self, n: int) -> int:
        """
        N-Queens問題の解の数を求めるメソッド
        
        Args:
            n: チェスボードのサイズ (n x n)
            
        Returns:
            N-Queens問題の解の総数
        """
        def backtrack(row: int, cols: int, diag1: int, diag2: int) -> int:
            """
            バックトラッキングを用いてN-Queens問題を解く再帰関数
            
            Args:
                row: 現在処理中の行
                cols: 列の使用状況をビットマスクで表現
                diag1: 左上から右下への対角線の使用状況をビットマスクで表現
                diag2: 右上から左下への対角線の使用状況をビットマスクで表現
                
            Returns:
                現在の状態から可能な解の数
            """
            # 全ての行にクイーンを配置できた場合、解を1つカウント
            if row == n:
                return 1
            
            count: int = 0
            # 現在の行で使用可能な位置を計算（ビット演算で高速化）
            available_positions: int = ((1 << n) - 1) & ~(cols | diag1 | diag2)
            
            # 使用可能な各位置にクイーンを配置して再帰的に探索
            while available_positions:
                # 最下位の1ビットを取得（次に配置可能な位置）
                position: int = available_positions & -available_positions
                # その位置のビットをクリア
                available_positions ^= position
                
                # 次の行で再帰的に探索し、解の数を加算
                # diag1とdiag2は対角線の制約を表現（ビットシフトで位置調整）
                count += backtrack(
                    row + 1,
                    cols | position,           # 列の制約を更新
                    (diag1 | position) << 1,  # 左上-右下対角線の制約を更新
                    (diag2 | position) >> 1   # 右上-左下対角線の制約を更新
                )
            
            return count
        
        # 最初の行から探索開始
        return backtrack(0, 0, 0, 0)