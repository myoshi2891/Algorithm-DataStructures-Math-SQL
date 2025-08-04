# ```python
# Runtime
# 0
# ms
# Beats
# 100.00%
# Memory
# 18.33
# MB
# Beats
# 72.33%

from typing import List

class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        """
        パラメーター:
            nums: List[int] - 昇順にソートされた整数配列 (長さ1〜10^4, 要素は-10^4〜10^4)
            target: int - 探索する整数 (-10^4〜10^4)
        返却値:
            int - targetが存在する場合はそのインデックス、存在しない場合は挿入すべきインデックス

        計算量:
            時間計算量 O(log n)  (二分探索)
            空間計算量 O(1)      (追加メモリはほぼ定数)

        実行環境:
            Python (CPython 3.11.4), LeetCodeで動作確認済み
            Pylanceで型エラーなし
        """
        left: int = 0
        right: int = len(nums) - 1

        while left <= right:
            # オーバーフロー防止のため (left + right)//2 ではなく以下でも可
            mid: int = left + (right - left) // 2

            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1  # 右側探索
            else:
                right = mid - 1 # 左側探索

        # 見つからない場合は挿入位置がleft
        return left
# ```

# ---

# ### 実装上のポイント

# 1. **二分探索**を使用し、最大でも `log2(n)` 回のループ

#    * `n=10^4` の場合でも最大約 14 回で高速
# 2. **追加メモリ不要**で O(1)
# 3. **Pylance 型推論対応**

#    * `List[int]` や `int` を明示して型エラーを防止
# 4. **LeetCode にそのまま提出可能**

# ---

# もし希望なら、この Python 実装の **二分探索の動作過程を図解** したバージョンも作成できますが、作成しますか？
