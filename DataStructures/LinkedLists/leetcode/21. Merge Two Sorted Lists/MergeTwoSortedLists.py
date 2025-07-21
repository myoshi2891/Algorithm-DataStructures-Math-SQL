# 以下は **Python (CPython 3.11.4)** 用の解答です。
# LeetCode環境で動作する形式（`class Solution` + メソッド定義）で記載し、**型指定・計算量・メモリ消費も明示**しています。

# ---

# ## **ListNode の定義 (LeetCode 標準)**

from typing import Optional

class ListNode:
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next

class Solution:
    def mergeTwoLists(
        self, 
        list1: Optional[ListNode], 
        list2: Optional[ListNode]
    ) -> Optional[ListNode]:
        """
        2つのソート済み単方向連結リストをマージする関数。

        パラメータ:
            list1: Optional[ListNode] - ソート済み連結リストの先頭ノードまたは None
            list2: Optional[ListNode] - ソート済み連結リストの先頭ノードまたは None

        返却値:
            Optional[ListNode] - マージされたソート済み連結リストの先頭ノードまたは None
        """

        dummy = ListNode(0)  # ダミーノード（先頭操作簡略化用）
        current = dummy      # 新しいリストを構築するためのポインタ

        # 両リストを比較して小さい方を current に接続
        while list1 and list2:
            if list1.val <= list2.val:
                current.next = list1
                list1 = list1.next
            else:
                current.next = list2
                list2 = list2.next
            current = current.next

        # 残りのリストを接続（片方は必ず None）
        current.next = list1 if list1 else list2

        return dummy.next  # dummy.next が実際の先頭ノード
# ```

# ---

# ## **計算量・メモリ**

# | 項目        | 内容                               |
# | --------- | -------------------------------- |
# | **時間計算量** | O(N + M)（N: list1長さ, M: list2長さ） |
# | **空間計算量** | O(1)（新規ノード作成なし、ポインタ操作のみ）         |

# ---

# ## **実行性能（CPython 3.11.4）**

# | 条件          | 予想値                |
# | ----------- | ------------------ |
# | 最大ノード数（50個） | 実行時間：\~0.05ms程度    |
# | メモリ消費（追加部分） | O(1)（dummyノード1個のみ） |

# ---

# ## **動作例**

# ```python
# # テストケース

# # list1 = [1,2,4]
# l1 = ListNode(1, ListNode(2, ListNode(4)))

# # list2 = [1,3,4]
# l2 = ListNode(1, ListNode(3, ListNode(4)))

# sol = Solution()
# merged = sol.mergeTwoLists(l1, l2)

# # 結果出力
# res = []
# while merged:
#     res.append(merged.val)
#     merged = merged.next

# print(res)  # [1, 1, 2, 3, 4, 4]
# ```

# ---

# ## **補足**

# ### なぜループ型？

# * **再帰ではなくループ** → O(1) メモリで動作（Pythonは再帰深度制限あり）
# * **dummy ノード** で先頭処理を簡潔化 → 条件分岐が最小化される

# ---

# ## **まとめ**

# * **O(N+M)** の高速処理
# * **O(1)** メモリ
# * **LeetCode用クラス形式で完全対応**
