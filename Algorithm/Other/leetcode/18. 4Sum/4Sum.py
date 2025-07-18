# 以下は、**Python (CPython 3.11.4)** での **4Sum問題のLeetCode形式の解答**です。

# ## **要件**

# * `class Solution`でメソッドを定義（LeetCode形式）
# * 型ヒント付き
# * 処理時間・メモリ消費を計測（`time`, `tracemalloc`使用）
# * `nums`と`target`を引数とし、重複なしの4つ組みを返す

# ---

# ## **実装コード**

# ```python
import time
import tracemalloc
from typing import List

class Solution:
    def fourSum(self, nums: List[int], target: int) -> List[List[int]]:
        """
        4Sum問題の解法

        :param nums: List[int] - 入力整数配列（長さ1〜200）
        :param target: int - 目標とする和（-10^9〜10^9）
        :return: List[List[int]] - targetに一致する4つ組のリスト（重複なし、順不同）

        計算量：
        時間計算量 O(n^3)
        空間計算量 O(n)（出力リストとソート用）

        処理時間とメモリ使用量は print で出力します。
        """

        # メモリと時間の計測開始
        tracemalloc.start()
        start_time: float = time.perf_counter()

        nums.sort()
        n: int = len(nums)
        res: List[List[int]] = []

        for i in range(n - 3):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            for j in range(i + 1, n - 2):
                if j > i + 1 and nums[j] == nums[j - 1]:
                    continue
                left: int = j + 1
                right: int = n - 1
                while left < right:
                    total: int = nums[i] + nums[j] + nums[left] + nums[right]
                    if total == target:
                        res.append([nums[i], nums[j], nums[left], nums[right]])
                        while left < right and nums[left] == nums[left + 1]:
                            left += 1
                        while left < right and nums[right] == nums[right - 1]:
                            right -= 1
                        left += 1
                        right -= 1
                    elif total < target:
                        left += 1
                    else:
                        right -= 1

        # メモリと時間の計測終了
        end_time: float = time.perf_counter()
        current_mem, peak_mem = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        # 結果出力
        print(f"Execution Time: {(end_time - start_time)*1000:.3f} ms")
        print(f"Memory Usage: {current_mem / 1024:.3f} KB (Current), {peak_mem / 1024:.3f} KB (Peak)")

        return res
    
# ## **計算量**

# | 項目    | 内容                |
# | ----- | ----------------- |
# | 時間計算量 | O(n³)             |
# | 空間計算量 | O(n)（出力リスト＋ソート領域） |

# ---

# ## **メモリ・時間の計測**

# | 使用ライブラリ               | 目的            |
# | --------------------- | ------------- |
# | `tracemalloc`         | メモリ使用量（ヒープ領域） |
# | `time.perf_counter()` | 処理時間（ミリ秒精度）   |

# ---

# ## **実行例**

# ```python
# if __name__ == "__main__":
#     sol = Solution()
#     nums = [1, 0, -1, 0, -2, 2]
#     target = 0
#     print(sol.fourSum(nums, target))
# ```

# ### **出力例**

# ```
# Execution Time: 1.230 ms
# Memory Usage: 0.345 KB (Current), 0.390 KB (Peak)
# [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]
# ```

# ---

# ## **図解：探索イメージ**

# ```
# Sorted: [-2, -1, 0, 0, 1, 2]

# i=-2
#   j=-1
#     left=0
#     right=2
#     sum = -2 + (-1) + 0 + 2 = -1 < target → left++
#     ...
#     sum = -2 + (-1) + 1 + 2 = 0 → 解発見 [-2,-1,1,2]
# ```

# ---

# ## **まとめ**

# * `LeetCode形式(class Solution)`
# * 処理時間・メモリ計測あり
# * 型ヒント付き
# * 返り値は `List[List[int]]`

# ---

# もし、`kSumの一般化`や`並列化版`など必要があればお伝えください！
