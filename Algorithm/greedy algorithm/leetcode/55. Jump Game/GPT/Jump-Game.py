# では **Python (CPython 3.11.4)** 向けに、LeetCode 提出形式で **class Solution + メソッド定義** を行い、型アノテーションを明示したものを示します。
# Greedy 法を用いるため **O(n) 時間, O(1) 空間** です。

# ---

# ## 実装 (Python / LeetCode 提出形式)

# ```python
from typing import List

class Solution:
    def canJump(self, nums: List[int]) -> bool:
        """
        判定: 配列 nums の最初の位置から最後の位置まで到達できるか

        Parameters
        ----------
        nums : List[int]
            各位置の最大ジャンプ長を格納した整数配列

        Returns
        -------
        bool
            最後のインデックスに到達可能なら True、できなければ False
        """
        max_reach: int = 0  # 到達可能な最大インデックス

        for i, step in enumerate(nums):
            if i > max_reach:
                # 現在位置が到達可能範囲外なら到達できない
                return False
            max_reach = max(max_reach, i + step)
            if max_reach >= len(nums) - 1:
                # 最後のインデックスに到達可能と判明したら即終了
                return True

        return True
# ```

# ---

# ## 🔎 処理時間・メモリ消費

# * **時間計算量**: O(n)
#   → 配列を一度走査するだけ。
# * **空間計算量**: O(1)
#   → `max_reach` のみ使用。

# ---

# ✅ このコードは **Pylance** における型チェック (`List[int]`, `bool`) にも対応済みで、
# そのまま **LeetCode (Python3, CPython 3.11.4)** に提出可能です。
