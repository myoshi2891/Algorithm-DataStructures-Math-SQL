# ```python
from typing import List

class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        """
        9x9 の数独盤面が有効かを判定する関数（Setを用いたシンプル実装）

        Parameters
        ----------
        board : List[List[str]]
            9x9 の数独盤面。各マスは '1'-'9' または '.'（空）を表す

        Returns
        -------
        bool
            盤面が有効であれば True、無効であれば False

        計算量
        ----
        時間計算量: O(81) ≒ O(1)（9x9固定）
        空間計算量: O(81) ≒ O(1)（各行・列・ボックスでSetを使用）
        """
        # 各行・列・3x3ボックスの数字を格納するセット
        rows: List[set[str]] = [set() for _ in range(9)]
        cols: List[set[str]] = [set() for _ in range(9)]
        boxes: List[set[str]] = [set() for _ in range(9)]

        for r in range(9):
            for c in range(9):
                val: str = board[r][c]
                if val == '.':
                    continue

                box_index: int = (r // 3) * 3 + (c // 3)

                # 既に同じ数字が存在する場合は無効
                if val in rows[r] or val in cols[c] or val in boxes[box_index]:
                    return False

                # 登録
                rows[r].add(val)
                cols[c].add(val)
                boxes[box_index].add(val)

        return True
# ```

# ---

# ### ✅ 実装の特徴

# * **時間計算量:**
#   盤面固定なので 81 回の確認で終了 → O(1)
# * **空間計算量:**
#   `rows`・`cols`・`boxes` で合計最大 81 個の要素 → O(1) 扱い
# * **可読性重視**
#   ビット演算より分かりやすく、デバッグしやすい

# ---

# こちらは**理解しやすさ重視の標準実装**です。
# 一方で、**ビットマスク版の方が高速かつ省メモリ**です。

# ---

# ご希望であれば、**2つの実装の速度差を Python で簡単にベンチマーク**するコードも提示できます。
# 試してみますか？
