# N-Queens問題をバックトラッキングで解くPythonコードを作成します。効率性を重視し、型ヒントとコメントを含めて実装します。このN-Queens問題の解法について説明します：

# ## アルゴリズムの特徴

# **時間計算量**: O(N!) - 各行で可能な位置を試すため
# **空間計算量**: O(N) - 再帰スタック、board配列、制約セットで線形

# ## 最適化のポイント

# 1. **効率的な制約チェック**: 
#    - `set`を使用してO(1)で攻撃チェック
#    - 列制約: `cols`セット
#    - 対角線制約: `diag1` (row-col), `diag2` (row+col)

# 2. **メモリ効率**:
#    - `board`配列で各行のクイーン位置のみ保存
#    - 2次元配列は結果生成時のみ作成

# 3. **バックトラッキング最適化**:
#    - 制約違反を早期検出
#    - 状態の追加/削除を高速化

# ## 型安全性
# - 全ての関数に型ヒントを明示
# - Pylanceエラーを回避するための適切な型宣言
# - `set[int]`記法でPython 3.9+対応

# このソリューションは制約内(n ≤ 9)で効率的に動作し、全ての有効な解を生成します。　
from typing import List


class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        """
        N-Queens問題を解く関数
        
        Args:
            n (int): チェス盤のサイズ (n x n)
        
        Returns:
            List[List[str]]: 全ての解の配列。各解は文字列の配列で表現される
        """
        result: List[List[str]] = []
        board: List[int] = [-1] * n  # board[i] = j は i行目のクイーンがj列目にあることを示す
        
        # 対角線の攻撃チェック用のセット（メモリ効率とO(1)チェックのため）
        diag1: set[int] = set()  # 左上から右下への対角線 (row - col)
        diag2: set[int] = set()  # 右上から左下への対角線 (row + col)
        cols: set[int] = set()   # 使用済みの列
        
        def is_safe(row: int, col: int) -> bool:
            """
            指定した位置にクイーンを配置できるかチェック
            
            Args:
                row (int): 行番号
                col (int): 列番号
            
            Returns:
                bool: 配置可能ならTrue
            """
            return (col not in cols and 
                   (row - col) not in diag1 and 
                   (row + col) not in diag2)
        
        def place_queen(row: int, col: int) -> None:
            """
            クイーンを配置し、制約を更新
            
            Args:
                row (int): 行番号
                col (int): 列番号
            """
            board[row] = col
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)
        
        def remove_queen(row: int, col: int) -> None:
            """
            クイーンを除去し、制約を復元
            
            Args:
                row (int): 行番号
                col (int): 列番号
            """
            board[row] = -1
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)
        
        def board_to_strings() -> List[str]:
            """
            現在のboard配列を文字列配列に変換
            
            Returns:
                List[str]: チェス盤の文字列表現
            """
            return [''.join('Q' if board[row] == col else '.' 
                           for col in range(n)) 
                   for row in range(n)]
        
        def backtrack(row: int) -> None:
            """
            バックトラッキングでN-Queens問題を解く
            
            Args:
                row (int): 現在処理中の行番号
            """
            # ベースケース: 全ての行にクイーンを配置完了
            if row == n:
                result.append(board_to_strings())
                return
            
            # 現在の行の各列を試す
            for col in range(n):
                if is_safe(row, col):
                    place_queen(row, col)
                    backtrack(row + 1)  # 再帰的に次の行を処理
                    remove_queen(row, col)  # バックトラック
        
        backtrack(0)
        return result