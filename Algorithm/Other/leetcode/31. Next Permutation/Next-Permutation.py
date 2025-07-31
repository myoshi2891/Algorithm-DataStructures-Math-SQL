# 以下に、**Python (CPython 3.11.4)** で動作する、**LeetCode形式 (class Solution + メソッド)** の解答例を示します。

# * **処理時間**: O(n)（最大 n=100 で高速）
# * **メモリ消費量**: O(1)（in-place 処理）
# * **型アノテーション付き**
# * **関数ベースだが LeetCode の仕様に合わせて class Solution を使用**

from typing import List

class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        """
        次の辞書順順列を nums に対して in-place で生成する
        :param nums: List[int] - 配列 (1 <= len(nums) <= 100)
        :return: None - 配列を直接変更するため返却値なし
        
        処理手順:
        1. 後ろから転換点 i (nums[i] < nums[i+1]) を探索
        2. さらに後ろから nums[i] より大きい最小の要素 nums[j] を探索
        3. nums[i] と nums[j] をスワップ
        4. i+1 以降を反転 (昇順化)

        時間計算量: O(n)
        空間計算量: O(1)
        """
        n: int = len(nums)
        
        # Step 1: 後ろから転換点を探す
        i: int = n - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1

        if i >= 0:
            # Step 2: 後ろから nums[i] より大きい要素を探す
            j: int = n - 1
            while j >= 0 and nums[j] <= nums[i]:
                j -= 1
            # Step 3: スワップ
            nums[i], nums[j] = nums[j], nums[i]

        # Step 4: 転換点以降を反転
        left, right = i + 1, n - 1
        while left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1
# ```

# ---

# ### **動作確認例**

# ```python
# nums1 = [1, 2, 3]
# Solution().nextPermutation(nums1)
# print(nums1)  # [1, 3, 2]

# nums2 = [3, 2, 1]
# Solution().nextPermutation(nums2)
# print(nums2)  # [1, 2, 3]

# nums3 = [1, 1, 5]
# Solution().nextPermutation(nums3)
# print(nums3)  # [1, 5, 1]
# ```

# ---

# ### **解析**

# * **時間計算量**

#   * 転換点探索 O(n)
#   * 後ろから j 探索 O(n)
#   * 反転 O(n)
#     → 合計 **O(n)** （最大 n=100 なので高速）

# * **メモリ消費量**

#   * 定数個の変数のみ使用し、配列は in-place 更新
#     → **O(1)**

# ---

# このアルゴリズムは **LeetCode 31. Next Permutation** にそのまま提出可能です。

# ---

# 次に、**この Python 実装の各処理を図解して解析したバージョン** も作成できますが、必要ですか？
