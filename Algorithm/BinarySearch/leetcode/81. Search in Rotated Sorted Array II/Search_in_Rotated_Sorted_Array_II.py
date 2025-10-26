## ✅ Python 実装（LeetCode 回答フォーマット）

# ```python
from typing import List


class Solution:
    def search(self, nums: List[int], target: int) -> bool:
        left: int = 0
        right: int = len(nums) - 1

        while left <= right:
            mid: int = (left + right) // 2
            if nums[mid] == target:
                return True

            # duplicates skip
            while left < mid and nums[left] == nums[mid] and nums[right] == nums[mid]:
                left += 1
                right -= 1

            # 左半分がソート済み
            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            else:
                # 右半分がソート済み
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1

        return False


# ```

# ---

# ## 🔎 解析まとめ

# * **時間計算量**:

#   * 平均: `O(log n)`
#   * 最悪（重複多いケース）: `O(n)`
# * **空間計算量**: `O(1)`（定数領域のみ）

# ### 🎯 Python 特有の最適化

# * `//` による整数除算 → CPython 内部で C 実装、`math.floor` より速い
# * `while left < mid and nums[left] == nums[mid] and nums[right] == nums[mid]: ...`
#   → 分岐回数削減でループ高速化
# * 型ヒント (`List[int]`, `int`, `bool`) → pylance 警告回避

# ---

# これで LeetCode では **Runtime 0ms 〜 40ms, Memory \~17MB** あたりを狙えます。

# ✅ LeetCode 提出用（競技プログラミング向け・性能最優先）

# ```python
# from typing import List


class Solution1:
    def search(self, nums: List[int], target: int) -> bool:
        left: int = 0
        right: int = len(nums) - 1

        while left <= right:
            mid: int = (left + right) // 2
            if nums[mid] == target:
                return True

            # 重複スキップ
            while left < mid and nums[left] == nums[mid] and nums[right] == nums[mid]:
                left += 1
                right -= 1

            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            else:
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1

        return False


# ```

# * **特徴**

#   * 入力検証なし、性能最優先
#   * **Runtime: O(log n)**（ただし重複多いと `O(n)`）
#   * **Memory: O(1)**

# ---

# # ✅ 業務開発向け（堅牢・入力検証あり）

# ```python
# from typing import List


class Solution2:
    def search(self, nums: List[int], target: int) -> bool:
        """
        Search target in a rotated sorted array (with duplicates allowed).

        Args:
            nums (List[int]): Rotated sorted array (non-decreasing order, may contain duplicates).
            target (int): Value to search.

        Returns:
            bool: True if target exists in nums, False otherwise.

        Raises:
            TypeError: If nums is not a list of integers or target is not int.
            ValueError: If nums is empty or length exceeds constraints.
        """
        # --- 入力検証 ---
        if not isinstance(nums, list):
            raise TypeError("nums must be a list of integers")
        if not all(isinstance(x, int) for x in nums):
            raise TypeError("All elements in nums must be integers")
        if not isinstance(target, int):
            raise TypeError("target must be an integer")
        if not (1 <= len(nums) <= 5000):
            raise ValueError("nums length must be between 1 and 5000")
        if not all(-(10**4) <= x <= 10**4 for x in nums):
            raise ValueError("nums elements must be in range [-10^4, 10^4]")
        if not (-(10**4) <= target <= 10**4):
            raise ValueError("target must be in range [-10^4, 10^4]")

        # --- アルゴリズム本体 ---
        left: int = 0
        right: int = len(nums) - 1

        while left <= right:
            mid: int = (left + right) // 2
            if nums[mid] == target:
                return True

            # duplicates skip
            while left < mid and nums[left] == nums[mid] and nums[right] == nums[mid]:
                left += 1
                right -= 1

            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            else:
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1

        return False


# ```

# * **特徴**

#   * **入力検証あり**（型・範囲チェック）
#   * 業務システムで使える堅牢性
#   * パフォーマンスは多少低下（検証コスト `O(n)` の可能性あり）

# ---

# ## 🔎 まとめ

# * **競技プログラミング版**

#   * 性能最優先、検証なし → LeetCode 提出向け

# * **業務開発版**

#   * 型安全 + 入力検証 + エラーハンドリング
#   * 可読性・保守性を優先
