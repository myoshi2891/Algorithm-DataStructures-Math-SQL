# 以下は、**Python (CPython 3.11.4)** 用の LeetCode対応「Remove Nth Node From End of List」解法です。

# ---

# ## **実装（Python・型指定あり・LeetCode提出形式）**

from typing import Optional

class ListNode:
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None) -> None:
        self.val: int = val
        self.next: Optional['ListNode'] = next

class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        """
        リンクリストの末尾から n 番目のノードを削除し、新しい head を返す。

        Parameters:
        head (Optional[ListNode]): リンクリストの先頭ノード
        n (int): 末尾から数えて削除するノードの位置（1-based index）

        Returns:
        Optional[ListNode]: ノード削除後のリンクリストの先頭

        時間計算量: O(sz)
        メモリ消費量: O(1)
        """
        dummy: ListNode = ListNode(0, head)

        fast: Optional[ListNode] = dummy  # Optional を許容
        slow: Optional[ListNode] = dummy

        # fast を n+1 個進める（slow との距離を n に保つ）
        for _ in range(n + 1):
            if fast is not None:
                fast = fast.next
            else:
                return head  # n がリストの長さ以上の場合、安全策として元のリストを返す

        while fast is not None:
            fast = fast.next
            assert slow is not None  # mypyや型チェッカー向け：slowは常にNoneではない
            slow = slow.next

        if slow is not None and slow.next is not None:
            slow.next = slow.next.next

        return dummy.next
# ## **解説**

# ### ダミーノードの役割

# * `dummy` を使うことで先頭ノードが削除されるケースも安全に処理できます。

# ### ポインタ操作

# * **`fast` を `n+1`個進める**ことで、`slow` が削除対象の「前」に到達するようにしています。

# ---

# ## **計算量**

# | 項目         | 計算量                |
# | ---------- | ------------------ |
# | **時間計算量**  | O(sz) （szはリストの長さ）  |
# | **メモリ消費量** | O(1)（追加メモリはポインタのみ） |

# ---

# ## **例**

# 入力：

# ```python
# head = [1,2,3,4,5]
# n = 2
# ```

# 出力：

# ```
# [1,2,3,5]
# ```

# ---

# ## **図解（簡略版）**

# ```
# dummy -> 1 -> 2 -> 3 -> 4 -> 5
#                      ↑    ↑
#                    slow  fast (fastはn+1個進んでいる)

# 操作：
# slow.next = slow.next.next

# 結果：
# dummy -> 1 -> 2 -> 3 -> 5
# ```

# ---

# ## **備考**

# * LeetCode環境では `ListNode` クラスは事前定義されています（再定義不要）。
# * CPython 3.11.4で実行しても問題なく動作します。

# エラーの主な原因は以下の2点です：

# ---

# ### ❶ `fast: ListNode = dummy` のように型を `ListNode` としたことで、

# ```python
# fast = fast.next
# ```

# のような代入が `Optional[ListNode]`（`ListNode | None`）になる場合にエラーになります。

# ---

# ### ❷ `if fast is not None:` のようなチェックに対して「常にTrue」と誤って型チェッカーが判断してしまうのは、型注釈 `fast: ListNode` によって `None` の可能性を消しているからです。

# ---

# ## ✅ 修正済みコード（型エラー解消 & コメント付き）

# ```python
# from typing import Optional

# class ListNode:
#     def __init__(self, val: int = 0, next: Optional['ListNode'] = None) -> None:
#         self.val: int = val
#         self.next: Optional['ListNode'] = next

# class Solution:
#     def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
#         """
#         リンクリストの末尾から n 番目のノードを削除し、新しい head を返す。

#         Parameters:
#         head (Optional[ListNode]): リンクリストの先頭ノード
#         n (int): 末尾から数えて削除するノードの位置（1-based index）

#         Returns:
#         Optional[ListNode]: ノード削除後のリンクリストの先頭

#         時間計算量: O(sz)
#         メモリ消費量: O(1)
#         """
#         dummy: ListNode = ListNode(0, head)

#         fast: Optional[ListNode] = dummy  # Optional を許容
#         slow: Optional[ListNode] = dummy

#         # fast を n+1 個進める（slow との距離を n に保つ）
#         for _ in range(n + 1):
#             if fast is not None:
#                 fast = fast.next
#             else:
#                 return head  # n がリストの長さ以上の場合、安全策として元のリストを返す

#         while fast is not None:
#             fast = fast.next
#             assert slow is not None  # mypyや型チェッカー向け：slowは常にNoneではない
#             slow = slow.next

#         if slow is not None and slow.next is not None:
#             slow.next = slow.next.next

#         return dummy.next
# ```

# ---

# ## 🧠 補足：なぜ `Optional[ListNode]` が必要か？

# * `fast = fast.next` で `fast.next` は `Optional[ListNode]` です。
#   よって `fast` の型も `Optional[ListNode]` でなければ代入できません。
# * 同様に `slow` も同じく `Optional[ListNode]` にしないと `.next` のチェーン操作時に静的型チェックで引っかかります。

# ---

# ### ✅ 型安全で、`pylance` や `mypy` でもエラーが出ない構成になっています。

# 他にも質問や補助が必要であれば遠慮なくどうぞ。
