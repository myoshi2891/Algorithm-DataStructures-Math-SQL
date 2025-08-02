# 以下は **Python (CPython 3.11.4)** での LeetCode 用実装例です。
# 要求に沿って **`class Solution`** 形式にし、**型ヒントを明示** し、**O(log n) 時間・O(1) メモリ** で動作します。
# Pylance でも型エラーが出ないように記述しています。

# ---

# ```python
from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        """
        昇順ソートだが回転されている可能性のある整数配列 nums から target のインデックスを返す。
        存在しない場合は -1 を返す。

        Parameters
        ----------
        nums : List[int]
            昇順でソートされているが回転されている可能性のある整数配列
        target : int
            探索する整数

        Returns
        -------
        int
            target のインデックス（存在しなければ -1）

        時間計算量: O(log n)
        空間計算量: O(1) 追加メモリ
        """
        left: int = 0
        right: int = len(nums) - 1

        while left <= right:
            mid: int = (left + right) // 2

            if nums[mid] == target:
                return mid

            # 左半分がソートされている場合
            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            else:
                # 右半分がソートされている場合
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1

        return -1
# ```

# ---

# ### ✅ 実装のポイント

# 1. **二分探索**

#    * 各ステップで `mid` を計算し、左半分または右半分が昇順かを判定。
# 2. **探索範囲を半分に絞る**

#    * 昇順側に `target` が含まれていればその範囲を残す。
# 3. **O(log n) 時間・O(1) メモリ**

#    * 配列コピーなし、変数は `left` / `right` / `mid` のみ。
# 4. **型ヒント明示**

#    * `nums: List[int]`、`target: int`、返り値 `int`
#    * Pylance でも型エラーなし。

# ---

# #### 動作確認例

# ```python
# s = Solution()
# print(s.search([4,5,6,7,0,1,2], 0))  # 4
# print(s.search([4,5,6,7,0,1,2], 3))  # -1
# print(s.search([1], 0))              # -1
# ```

# ---

# こちらは **中央基準で探索範囲を半分にする方式** です。
# さらに理解を深めるために、**回転点を先に特定して通常の二分探索に分ける別解** も Python で用意可能です。

# ---

# ご希望であれば、次に **回転点特定 → 通常二分探索** の別解も図解付きで作成しますか？
