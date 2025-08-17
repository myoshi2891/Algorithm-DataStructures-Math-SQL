# ```python
from typing import List

class Solution:
    def jump(self, nums: List[int]) -> int:
        """
        最小ジャンプ回数を求める関数

        Parameters
        ----------
        nums : List[int]
            各インデックスでジャンプできる最大距離を表す配列

        Returns
        -------
        int
            最後のインデックスに到達するための最小ジャンプ回数

        Notes
        -----
        - 計算量: O(n) （各要素を一度だけ処理する）
        - メモリ使用量: O(1) （追加の大きなデータ構造を使用しない）
        """
        n: int = len(nums)
        if n <= 1:
            return 0

        jumps: int = 0          # 最小ジャンプ回数
        current_end: int = 0    # 現在のジャンプで到達できる範囲の終端
        farthest: int = 0       # 現時点で到達可能な最も遠い位置

        for i in range(n - 1):
            # i から到達可能な最も遠い位置を更新
            farthest = max(farthest, i + nums[i])

            # 現在のジャンプ範囲の終端に到達したらジャンプ回数を増やす
            if i == current_end:
                jumps += 1
                current_end = farthest

                # 最後のインデックスに届くなら終了
                if current_end >= n - 1:
                    break

        return jumps
# ```

# ---

# ## ✅ ポイント

# * **型定義**: `nums: List[int] -> int` で Pylance による型エラーを防止
# * **処理時間**: `O(n)` （配列を1回走査するだけ）
# * **メモリ使用量**: `O(1)` （必要な変数は `jumps`, `current_end`, `farthest` のみ）
# * **LeetCode提出形式**: `class Solution` + `def jump(self, nums: List[int]) -> int:` に準拠

# ---

# 👉 このまま LeetCode (Python 3, CPython 3.11.4) で提出可能です。

# ご希望なら、この Python 実装を **図解付き（TypeScript版のようにステップごとに説明）** にして解説しましょうか？
