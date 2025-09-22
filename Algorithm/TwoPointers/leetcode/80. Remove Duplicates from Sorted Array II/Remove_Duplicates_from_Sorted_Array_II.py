# ## 🔎 問題分析

# * 入力はソート済み → 同じ要素は隣接して出現する。
# * 各要素を **最大2回** 残す。
# * 配列の長さは変えられない → 先頭 `k` に正しい結果を格納。

# ---

# ## 🚀 アルゴリズム

# * **2ポインタ法** を採用。
# * 書き込み位置 `write` を管理。
# * 各 `num` を処理するとき、`nums[write-2] != num` なら書き込み可。
# * O(n) 時間, O(1) 空間。

# ---

# ## ✅ 実装（LeetCode提出形式）

# ```python
from typing import List


class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        """
        Remove duplicates from sorted array such that each unique element
        appears at most twice. Modify nums in-place and return the new length.

        Args:
            nums (List[int]): Sorted integer array

        Returns:
            int: The length of modified array with each element appearing at most twice.
        """
        n: int = len(nums)
        if n <= 2:
            return n

        write: int = 2  # 最初の2要素は必ず残せる
        for read in range(2, n):
            if nums[read] != nums[write - 2]:
                nums[write] = nums[read]
                write += 1

        return write


# ```

# ---

# ## 🔍 動作例

# * 入力: `nums = [1,1,1,2,2,3]`

#   * 出力: `5`
#   * `nums = [1,1,2,2,3,_]`

# * 入力: `nums = [0,0,1,1,1,1,2,3,3]`

#   * 出力: `7`
#   * `nums = [0,0,1,1,2,3,3,_,_]`

# ---

# ## ⏱ 計算量

# * **時間計算量**: O(n)
# * **空間計算量**: O(1) （インプレース）
