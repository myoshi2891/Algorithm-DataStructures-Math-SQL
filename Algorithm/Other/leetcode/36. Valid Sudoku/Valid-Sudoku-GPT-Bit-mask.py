# ```python
# Runtime
# 3
# ms
# Beats
# 82.14%
# Memory
# 17.82
# MB
# Beats
# 43.86%
from typing import List

class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        """
        9x9 の数独盤面が有効かを判定する関数（ビットマスク版）
        
        Parameters
        ----------
        board : List[List[str]]
            9x9 の数独盤面。各マスは '1'-'9' または '.'（空）を表す。

        Returns
        -------
        bool
            盤面が有効であれば True、無効であれば False

        計算量
        ----
        時間計算量: O(81) ≒ O(1)（9x9固定）
        空間計算量: O(27) ≒ O(1)（行・列・ボックスごとに整数1つを保持）
        """
        # 各行・列・ボックスを9ビット整数で管理
        rows: List[int] = [0] * 9
        cols: List[int] = [0] * 9
        boxes: List[int] = [0] * 9

        for r in range(9):
            for c in range(9):
                val: str = board[r][c]
                if val == '.':
                    continue

                num: int = int(val)
                mask: int = 1 << (num - 1)  # 対応するビットを立てる
                box_index: int = (r // 3) * 3 + (c // 3)

                # 既に同じ数字が出ているかを確認
                if (rows[r] & mask) or (cols[c] & mask) or (boxes[box_index] & mask):
                    return False

                # ビットを立てて登録
                rows[r] |= mask
                cols[c] |= mask
                boxes[box_index] |= mask

        return True
# ```

# ---

# ### ✅ 実装の特徴

# * **時間計算量:**
#   9x9 固定なので 81 回のループで O(1) 扱い。
# * **空間計算量:**
#   `rows`・`cols`・`boxes` 計 27 個の整数のみ保持 → O(1)。
# * **メモリ効率:**
#   Python の `set` を使うより遥かに省メモリかつ高速。

# このまま LeetCode に提出可能で、**Pylance で型エラーは発生しません**。

# ---

# 希望すれば、**Set を使うシンプル実装**も Python で提示可能です。
# そちらも確認されますか？
