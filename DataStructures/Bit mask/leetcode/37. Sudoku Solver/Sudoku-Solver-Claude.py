# Runtime
# 1808
# ms
# Beats
# 52.41%
# Memory
# 17.92
# MB
# Beats
# 62.04%

# Time Limit Exceededが発生したのは、最も効率的でないセル探索順序が原因です。空のセルを見つけるたびに最初から探索するのではなく、より効率的な最適化を実装します。Time Limit Exceededを解決するために、以下の最適化を実装しました：

# **主要な最適化ポイント：**

# 1. **事前計算によるセット管理**
#    - 各行・列・ボックスで使用済みの数字をSetで管理
#    - 毎回全体をチェックせず、O(1)での制約確認

# 2. **空セルの事前収集**
#    - 最初に全ての空セルを収集してリスト化
#    - 毎回探索する必要がなく、直接インデックスアクセス

# 3. **使用可能数字の効率計算**
#    - セット演算で使用可能な数字を一度に計算
#    - 不要なループを削減

# 4. **メモリ効率の向上**
#    - セットの追加/削除でO(1)操作
#    - 重複チェックが高速化

# **計算量改善：**
# - **従来**: 各セルで9×9の全体チェック → O(81)
# - **最適化後**: セット操作での制約チェック → O(1)

# **特に効果的な場面：**
# - 空セルが多いケース（提供されたテストケースのような）
# - 制約が複雑に絡み合うケース

# この実装により、Time Limit Exceededを回避しつつ、LeetCodeの厳しい時間制限内での実行が可能になります。

# from typing import List, Optional, Tuple, Set
from typing import List, Tuple, Set

class Solution:
    def solveSudoku(self, board: List[List[str]]) -> None:
        """
        数独パズルを解く関数（boardを直接変更する）
        
        Args:
            board: 9x9の数独ボード（'.'は空のセル、'1'-'9'は既に配置された数字）
        
        Returns:
            None（boardを直接変更する）
        """
        # 制約セットを事前計算
        rows: List[Set[str]] = [set() for _ in range(9)]
        cols: List[Set[str]] = [set() for _ in range(9)]
        boxes: List[Set[str]] = [set() for _ in range(9)]
        empty_cells: List[Tuple[int, int]] = []
        
        # 初期状態を設定
        for i in range(9):
            for j in range(9):
                if board[i][j] == '.':
                    empty_cells.append((i, j))
                else:
                    val = board[i][j]
                    rows[i].add(val)
                    cols[j].add(val)
                    boxes[self._get_box_index(i, j)].add(val)
        
        self._solve_optimized(board, empty_cells, 0, rows, cols, boxes)
    
    def _solve_optimized(self, board: List[List[str]], empty_cells: List[Tuple[int, int]], 
                        idx: int, rows: List[Set[str]], cols: List[Set[str]], 
                        boxes: List[Set[str]]) -> bool:
        """
        最適化されたバックトラッキング解法
        
        Args:
            board: 9x9の数独ボード
            empty_cells: 空のセルのリスト
            idx: 現在処理中のセルインデックス
            rows: 各行で使用済みの数字セット
            cols: 各列で使用済みの数字セット
            boxes: 各ボックスで使用済みの数字セット
            
        Returns:
            bool: 解けた場合はTrue、解けない場合はFalse
        """
        if idx == len(empty_cells):
            return True  # すべての空セルが埋まった
        
        row, col = empty_cells[idx]
        box_idx = self._get_box_index(row, col)
        
        # 使用可能な数字を事前計算
        used = rows[row] | cols[col] | boxes[box_idx]
        available = {'1', '2', '3', '4', '5', '6', '7', '8', '9'} - used
        
        for num in available:
            # 数字を配置
            board[row][col] = num
            rows[row].add(num)
            cols[col].add(num)
            boxes[box_idx].add(num)
            
            # 再帰的に次のセルを処理
            if self._solve_optimized(board, empty_cells, idx + 1, rows, cols, boxes):
                return True
            
            # バックトラック
            board[row][col] = '.'
            rows[row].remove(num)
            cols[col].remove(num)
            boxes[box_idx].remove(num)
        
        return False
    
    def _get_box_index(self, row: int, col: int) -> int:
        """
        指定された座標の3x3ボックスインデックスを取得
        
        Args:
            row: 行インデックス
            col: 列インデックス
            
        Returns:
            int: ボックスインデックス（0-8）
        """
        return (row // 3) * 3 + (col // 3)