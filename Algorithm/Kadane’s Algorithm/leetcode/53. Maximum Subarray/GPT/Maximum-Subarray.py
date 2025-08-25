# ```python
from typing import List

class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        """
        最大部分配列和を求める関数 (Kadane's Algorithm)

        Parameters
        ----------
        nums : List[int]
            整数配列 (1 <= len(nums) <= 1e5, -1e4 <= nums[i] <= 1e4)

        Returns
        -------
        int
            最大部分配列の和

        計算量
        ------
        時間計算量 : O(n) （配列を1回走査）
        空間計算量 : O(1) （追加の変数は定数個のみ）
        """

        # 初期化: 最初の要素を基準にする
        current_sum: int = nums[0]
        max_sum: int = nums[0]

        # 2つ目の要素以降を走査
        for i in range(1, len(nums)):
            # 「現在の要素だけ取る」か「前の部分和を伸ばす」かを選択
            current_sum = max(nums[i], current_sum + nums[i])
            # 最大値を更新
            max_sum = max(max_sum, current_sum)

        return max_sum
# ```

# ---

# ### ✅ 実装上の注意

# * `List[int]` と戻り値 `int` を型ヒントで明示 → **Pylance でも型エラーが出ない**
# * **Kadane’s Algorithm** を採用しているので `O(n)` 時間、`O(1)` メモリで効率的
# * LeetCode の配列サイズ上限 (`1e5`) に対しても十分高速に動作
