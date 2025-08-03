# 以下は、指定された条件に従った Python (CPython 3.11.4) の解答例です。
# Runtime
# 0
# ms
# Beats
# 100.00%
# Memory
# 19.04
# MB
# Beats
# 53.05%

# * **O(log n)** の計算量を実現するために **二分探索** を使用します。
# * **型アノテーション** を付与し、**Pylance** でも型エラーが出ないようにしています。
# * **処理時間** は O(log n)、**追加メモリ使用量** は O(1) です。

# ```python
from typing import List

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        """
        パラメータ:
            nums: List[int]  昇順ソート済み整数配列
            target: int      探索する値
        戻り値:
            List[int]        targetの開始位置と終了位置 [start, end]
                             見つからない場合 [-1, -1]
        """

        # 内部関数: target以上の最初の位置を探す二分探索
        def lower_bound(nums: List[int], target: int) -> int:
            left: int = 0
            right: int = len(nums)
            while left < right:
                mid: int = (left + right) // 2
                if nums[mid] < target:
                    left = mid + 1
                else:
                    right = mid
            return left

        # 内部関数: targetより大きい最初の位置を探す二分探索
        def upper_bound(nums: List[int], target: int) -> int:
            left: int = 0
            right: int = len(nums)
            while left < right:
                mid: int = (left + right) // 2
                if nums[mid] <= target:
                    left = mid + 1
                else:
                    right = mid
            return left

        start: int = lower_bound(nums, target)
        end: int = upper_bound(nums, target) - 1

        # 範囲が正しく target を含むか確認
        if start <= end and start < len(nums) and nums[start] == target:
            return [start, end]
        else:
            return [-1, -1]
# ```

# ---

# ### 処理時間・メモリ解析

# 1. **処理時間**

#    * `lower_bound` と `upper_bound` はそれぞれ O(log n)
#    * 合計でも **O(log n)**

# 2. **メモリ使用量**

#    * 追加メモリは、定数個の変数のみ **O(1)**

# 3. **実行例**

# ```python
# solution = Solution()
# print(solution.searchRange([5,7,7,8,8,10], 8))  # [3,4]
# print(solution.searchRange([5,7,7,8,8,10], 6))  # [-1,-1]
# print(solution.searchRange([], 0))              # [-1,-1]
# ```

# ---

# もし希望であれば、この実装を**左右スキャンO(n)** の実装や、**bisectモジュール利用版** と比較して、実行時間・メモリ差を図解して解説することも可能です。

# 必要ですか？
