# 以下は **Python (CPython 3.11.4)** / **LeetCode 環境** / **Pylance 型チェック対応** の
# `O(n)` 時間・`O(1)` 追加メモリの解法です。

# ---

# ```python
from typing import List

class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        """
        配列 nums に存在しない最小の正の整数を返す

        :param nums: List[int] - 整数配列（順不同、負数や0を含む可能性あり）
        :return: int - 配列に存在しない最小の正の整数

        時間計算量: O(n)
        空間計算量: O(1) 追加メモリ（インプレース処理）
        対応環境: Python (CPython 3.11.4) / LeetCode
        """
        n: int = len(nums)

        # 値を正しい位置に移動する（Cyclic Sort）
        for i in range(n):
            while (
                1 <= nums[i] <= n and
                nums[nums[i] - 1] != nums[i]
            ):
                correct_index: int = nums[i] - 1
                nums[i], nums[correct_index] = nums[correct_index], nums[i]

        # 最初に位置と値が一致しないインデックス+1が答え
        for i in range(n):
            if nums[i] != i + 1:
                return i + 1

        # すべて一致すれば n+1
        return n + 1

# ## 実装ポイント

# 1. **Cyclic Sort（配置スワップ法）**

#    * `1 <= x <= n` の値だけを正しい位置（`x-1` インデックス）に置く
#    * スワップ後も条件を満たせば繰り返す
# 2. **O(n) 時間**

#    * 各要素は最大1回だけ正しい位置に移動
# 3. **O(1) 追加メモリ**

#    * 配列内で直接スワップするため、追加配列は不要
# 4. **Pylance 型安全**

#    * 引数・変数に型を明示 (`List[int]`, `int`)

# ---

# もし希望であれば、この Python 版についても **図解トレース** を作って
# どのように要素が移動していくかを視覚的に説明できます。
