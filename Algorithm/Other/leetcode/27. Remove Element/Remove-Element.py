# 以下は、LeetCode仕様に準拠した **Python (CPython 3.11.4)** 向けの実装です。
# `class Solution` の形式で定義し、**型アノテーション・処理時間・メモリの消費量**に注意を払い、**関数での処理構成**にしています。

# ---

# ### ✅ 問題概要（再掲）

# * 与えられた配列 `nums` から、指定された値 `val` を**in-place**で削除する。
# * `val` 以外の要素を前詰めにして、新しい長さ `k` を返す。
# * `nums` の先頭 `k` 要素のみが有効。順番は任意。

# ---

# ### ✅ Python 実装（LeetCode形式）

# ```python
from typing import List

class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        """
        配列 nums から val をインプレースで削除し、val 以外の要素数 k を返す。
        
        :param nums: List[int] - 入力配列（直接変更される）
        :param val: int - 削除対象の値
        :return: int - val 以外の要素数（新しい配列の長さ k）

        時間計算量: O(n) - 配列を1回走査
        空間計算量: O(1) - 追加メモリは使わない（in-place処理）
        """
        k: int = 0  # val 以外の値を書き込む位置

        for i in range(len(nums)):
            if nums[i] != val:
                nums[k] = nums[i]  # 前方に詰める
                k += 1

        return k
# ```

# ---

# ### ✅ 使用例（LeetCode Judgeでの挙動に近い）

# ```python
# nums = [0, 1, 2, 2, 3, 0, 4, 2]
# val = 2
# solution = Solution()
# k = solution.removeElement(nums, val)

# # 出力結果
# print("k:", k)  # 出力: 5
# print("modified nums (first k elements):", nums[:k])  # 出力例: [0, 1, 3, 0, 4]（順不同）
# ```

# ---

# ### ✅ 処理フロー図（図解）

# ```text
# 初期:
# nums = [0, 1, 2, 2, 3, 0, 4, 2], val = 2
# k = 0

# ループ:
# i=0: nums[i]=0 → nums[0] = 0, k=1
# i=1: nums[i]=1 → nums[1] = 1, k=2
# i=2: nums[i]=2 → スキップ
# i=3: nums[i]=2 → スキップ
# i=4: nums[i]=3 → nums[2] = 3, k=3
# i=5: nums[i]=0 → nums[3] = 0, k=4
# i=6: nums[i]=4 → nums[4] = 4, k=5
# i=7: nums[i]=2 → スキップ

# 結果:
# nums[:k] = [0, 1, 3, 0, 4]
# ```

# ---

# ### ✅ 計算量分析

# | 項目       | 内容                   |
# | -------- | -------------------- |
# | 時間計算量    | **O(n)** ：全体を1回ループ   |
# | 空間計算量    | **O(1)** ：in-place処理 |
# | 最大配列長    | 100（制約より）            |
# | メモリ使用量目安 | 数百バイト（numsの再利用）      |

# ---

# ### ✅ LeetCode Judge の確認方式

# LeetCode は以下のように `nums[:k]` を並べ替えて `expectedNums` と比較しています：

# ```python
# expectedNums = [0, 1, 0, 3, 4]
# k = solution.removeElement(nums, val)
# assert k == len(expectedNums)
# assert sorted(nums[:k]) == sorted(expectedNums)
# ```

# ---

# ご希望があれば、**unittestテストケース** や **性能検証コード** の追加も可能です。
