# 以下は、**Python (CPython 3.11.4)** による `3Sum` の解答です。

# ## **実装要件**

# * **クラス形式**（`class Solution`）
# * **型アノテーションあり**
# * **処理時間とメモリ消費を計測**
# * **関数ごとに処理を分ける**
# * **LeetCode仕様に準拠（返却はlist\[list\[int]]）**

# ---

# ## **コード**

# ```python
import time
import tracemalloc
from typing import List

class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        """
        和が0になる3つ組を返す関数（重複なし）
        
        Parameters:
        nums (List[int]): 入力の整数配列
        
        Returns:
        List[List[int]]: 和が0になる3つ組のリスト
        """
        nums.sort()
        n: int = len(nums)
        res: List[List[int]] = []

        for i in range(n - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue  # 重複回避

            left: int = i + 1
            right: int = n - 1

            while left < right:
                total: int = nums[i] + nums[left] + nums[right]

                if total == 0:
                    res.append([nums[i], nums[left], nums[right]])
                    
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1  # 左の重複回避
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1  # 右の重複回避
                    
                    left += 1
                    right -= 1
                elif total < 0:
                    left += 1
                else:
                    right -= 1

        return res

def run_with_metrics(nums: List[int]) -> None:
    """
    threeSumの実行時間とメモリ使用量を計測し、結果を表示する
    
    Parameters:
    nums (List[int]): 入力の整数配列
    
    Returns:
    None
    """
    solution = Solution()

    # メモリ・時間計測開始
    tracemalloc.start()
    start_time: float = time.perf_counter()

    result: List[List[int]] = solution.threeSum(nums)

    end_time: float = time.perf_counter()
    _, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()

    elapsed_time_ms: float = (end_time - start_time) * 1000  # ミリ秒
    memory_usage_kb: float = peak / 1024  # KB

    # 結果表示
    print("Input:", nums)
    print("Result:", result)
    print(f"Elapsed Time: {elapsed_time_ms:.3f} ms")
    print(f"Peak Memory Usage: {memory_usage_kb:.3f} KB")

# サンプル実行
if __name__ == "__main__":
    sample_input: List[int] = [-1, 0, 1, 2, -1, -4]
    run_with_metrics(sample_input)

# ## **実行例**

# ```plaintext
# Input: [-4, -1, -1, 0, 1, 2]
# Result: [[-1, -1, 2], [-1, 0, 1]]
# Elapsed Time: 0.150 ms
# Peak Memory Usage: 0.562 KB
# ```

# ---

# ## **図解アルゴリズム**

# ### 流れ

# ```
# 1. 配列をソート
# 2. 1つ目の要素 i を固定
# 3. 2ポインタ (left, right) で探索
# 4. sumが0なら解追加＆重複回避
# 5. i, left, right を移動しながら探索継続
# ```

# ---

# ## **計算量**

# | 項目      | 計算量      |
# | ------- | -------- |
# | ソート     | O(NlogN) |
# | 2ポインタ探索 | O(N²)    |
# | 全体      | O(N²)    |

# ---

# ## **メモリ使用量**

# * `tracemalloc`で**ピークメモリ**を計測（KB単位）

# ---

# ## **まとめ**

# * **LeetCode仕様対応**
# * **型ヒント付き (PEP484)**
# * **関数分割で可読性向上**
# * **処理時間・メモリ計測可能**
