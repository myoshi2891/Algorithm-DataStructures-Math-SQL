# 以下は、LeetCode（Python 3.11.4）環境で動作する `k` 個ずつノードを反転する問題の解法です。
# **関数ベースの処理構成**にしつつ、LeetCode形式で `class Solution` を使用しています。

# ---

# ## ✅ 問題仕様（復習）

# * 単方向連結リストが与えられ、**k 個ずつ**ノードを反転する。
# * ノードの **値は変更不可**、ノードのポインタ操作のみ許可。
# * 最後に k 未満のノードが残った場合は反転せずそのまま残す。

# ---

# ## ✅ Python 実装（LeetCode形式）

# ```python
from typing import Optional

# LeetCode上ではこのようにListNodeが定義されています
class ListNode:
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next

# class Solution:
#     # メイン関数
#     # パラメータ:
#     #   head: ListNode | None - 単方向連結リストの先頭ノード
#     #   k: int - 反転するグループのノード数（1 <= k <= n）
#     # 戻り値:
#     #   ListNode | None - k個ずつ反転された連結リストの先頭ノード
#     def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
#         if not head or k == 1:
#             return head

#         # 長さを数える
#         count: int = 0
#         node = head
#         while node:
#             count += 1
#             node = node.next

#         dummy = ListNode(0)
#         dummy.next = head
#         prev_group_end = dummy

#         while count >= k:
#             prev: Optional[ListNode] = None
#             curr: Optional[ListNode] = prev_group_end.next
#             group_start = curr

#             # k個ノードを反転
#             for _ in range(k):
#                 next_node = curr.next
#                 curr.next = prev
#                 prev = curr
#                 curr = next_node

#             # 接続部分を修正
#             prev_group_end.next = prev
#             group_start.next = curr
#             prev_group_end = group_start
#             count -= k

#         return dummy.next
# ```

# ---

# ## ✅ 処理フローのイメージ

# ```
# 1 → 2 → 3 → 4 → 5, k=2
# ↓
# 2 → 1 → 4 → 3 → 5
# ```

# ---

# ## ✅ 時間・空間計算量（Big-O）

# | 指標    | 値                    |
# | ----- | -------------------- |
# | 時間計算量 | O(n)（各ノードを一度ずつ処理）    |
# | 空間計算量 | O(1)（ノード反転のみ、再帰なし）   |
# | メモリ使用 | 約50〜60MB（LeetCode目安） |
# | 実行時間  | 約60〜100ms（n≒5000で想定） |

# ---

# ## ✅ 解法の特徴

# * **再帰なし**：スタック消費を抑え、O(1) 空間を維持。
# * **ダミーノード使用**：先頭の処理も自然に行える。
# * **ノードのポインタ操作のみ**：問題の制約に準拠。

# ---

# 必要であれば、テスト用のユーティリティ関数（リスト→連結リスト、連結リスト→リスト変換）や図示も可能です。

# `Pylance` の `"next" は "None" の既知の属性ではありません` という警告は、Python の型チェック機能が「`Optional[ListNode]`（つまり `ListNode | None`）型である可能性のある変数に対して `.next` を直接アクセスしようとした」ために発生します。

# ---

# ## ✅ 原因の詳細

# ```python
# curr: Optional[ListNode] = prev_group_end.next
# next_node = curr.next  # ⚠️ Pylance 警告発生
# ```

# `curr` は `Optional[ListNode]` なので `None` の可能性があり、`.next` を安全にアクセスできない、という警告です。

# ---

# ## ✅ 解決策

# `.next` を使う前に `None` チェックを明示する必要があります。

# ---

# ### ✅ 修正後コード（安全なアクセス）

# ```python
class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        if not head or k == 1:
            return head

        # 長さを数える
        count: int = 0
        node = head
        while node:
            count += 1
            node = node.next

        dummy = ListNode(0)
        dummy.next = head
        prev_group_end = dummy

        while count >= k:
            prev: Optional[ListNode] = None
            curr: Optional[ListNode] = prev_group_end.next
            group_start = curr

            # 安全に next にアクセスするためのチェックを追加
            for _ in range(k):
                if curr is None:
                    break  # 保険（ただし理論上ここには来ない）
                next_node = curr.next  # ここで警告は出ない
                curr.next = prev
                prev = curr
                curr = next_node

            # 接続を修正
            if prev_group_end.next:
                prev_group_end.next = prev
            if group_start:
                group_start.next = curr
                prev_group_end = group_start

            count -= k

        return dummy.next

# ## ✅ Pylance 安全アクセスのまとめ

# | 処理                        | 解説                                      |
# | ------------------------- | --------------------------------------- |
# | `if curr is not None:`    | `.next` などのアクセス前に None チェックすることで警告回避    |
# | `assert curr is not None` | `curr` が None でないことを明示する手段（テスト・確信がある場合） |
# | 型アノテーションの活用               | `ListNode` に限定すれば警告抑止できるが、**安全性は低下**    |

# ---

# ### ✅ より強く型保証をしたい場合

# 次のように `assert` を入れる方法もあります：

# ```python
# assert curr is not None
# next_node = curr.next
# ```

# ただし、`assert` は実行時エラーになる可能性があるので、保守的には `if curr:` チェックがおすすめです。

# ---

# 必要であれば、`ListNode` のユーティリティ（例：リスト変換や表示）も提供できます。
