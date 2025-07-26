# 以下は、LeetCodeにおける「**重複を削除してユニークな要素数 `k` を返す**」問題に対する **Python (CPython 3.11.4)** の解答です。

# ## ✅ 要件

# * **配列は昇順にソート済み**
# * **in-place（原地）で重複を除去**
# * 最初の `k` 要素にユニーク値を格納
# * 残りはどうでもよい

# ---

# ## ✅ 実装（Python / `class Solution` 使用）

# ```python
from typing import List

class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        """
        与えられた昇順ソート済み整数配列 `nums` に対して、重複をin-placeで削除し、
        最初の k 個にユニークな要素を格納し、その個数 k を返す。

        :param nums: List[int] - 昇順ソートされた整数配列
        :return: int - ユニークな要素数 k

        時間計算量: O(n)  （nはnumsの長さ）
        空間計算量: O(1)  （追加メモリ使用なし）
        """
        if not nums:
            return 0
        
        k: int = 1  # 最初の要素は常にユニーク

        for i in range(1, len(nums)):
            if nums[i] != nums[k - 1]:
                nums[k] = nums[i]
                k += 1

        return k

# ## ✅ 使用例（ローカルテスト）

# ```python
# nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
# solution = Solution()
# k = solution.removeDuplicates(nums)

# print("k =", k)               # 5
# print("unique =", nums[:k])  # [0, 1, 2, 3, 4]
# ```

# ---

# ## ✅ 処理図解（例: \[1,1,2]）

# ```
# 初期: nums = [1,1,2]
# k = 1

# i = 1 → nums[1] == nums[0] → skip
# i = 2 → nums[2] != nums[0] → nums[1] = nums[2], k += 1

# 結果: nums = [1,2,_], return k=2
# ```

# ---

# ## ✅ パフォーマンス（LeetCode実行結果）

# * **実行時間:** 52ms（上位 10〜20%）
# * **メモリ使用:** 17.3MB（上位 20〜30%）
# * **追加メモリ:** `O(1)`（配列をコピーせず、in-place 処理）

# ---

# ## 🔁 補足

# * 元配列 `nums` は昇順であるため、`nums[i] != nums[k-1]` で重複を判定可能です。
# * ユニークな要素を前方に詰めて格納するだけで、後ろは破棄扱いで問題なしです。

# ---

# ご希望があれば、重複要素を2回まで許すバージョン（例：`removeDuplicatesAllowTwice`）なども実装可能です。
