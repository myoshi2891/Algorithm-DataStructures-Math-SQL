# 以下は、LeetCode の仕様（CPython 3.11.4）に準拠し、**ノードの値を変更せずにノード自体をスワップ**する問題（Swap Nodes in Pairs）に対して、**関数ベース・型注釈付き・処理時間とメモリ使用量を意識**した Python 実装です。

# ---

# ## ✅ 問題条件まとめ

# * 与えられた連結リストのノードをペアごとにスワップ。
# * 値を変更してはならず、ノード構造を変更する。
# * ノード数：0 ≤ n ≤ 100

# ---

# ## ✅ Python 実装（LeetCode形式）

# ```python
from typing import Optional
# import time
# import tracemalloc

# LeetCode の ListNode 定義（変更不可）
class ListNode:
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next

class Solution:
 def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy: ListNode = ListNode(0)
        dummy.next = head
        prev: ListNode = dummy

        while prev.next is not None and prev.next.next is not None:
            # ここで .next は None ではないことが保証されているため型アサート可能
            first = prev.next
            second = first.next

            assert first is not None and second is not None  # 型保証（Pylance対応）

            # スワップ処理
            first.next = second.next
            second.next = first
            prev.next = second

            # 次のペアへ進める
            prev = first

        return dummy.next# ```

# ---

# ## ✅ パフォーマンス測定付きテスト関数（任意）

# LeetCodeでは使用しませんが、**処理時間とメモリ消費**を確認するためのローカル実行用関数です。

# ```python
# def test_with_metrics(input_list: list[int]) -> list[int]:
#     """
#     配列からリストを生成し、swapPairs を実行して配列に戻す。実行時間・メモリ使用量を表示する。
#     :param input_list: 入力リスト [1,2,3,4]
#     :return: 出力リスト（スワップ後）
#     """

#     def list_to_linked(lst: list[int]) -> Optional[ListNode]:
#         dummy = ListNode()
#         current = dummy
#         for val in lst:
#             current.next = ListNode(val)
#             current = current.next
#         return dummy.next

#     def linked_to_list(node: Optional[ListNode]) -> list[int]:
#         result = []
#         while node:
#             result.append(node.val)
#             node = node.next
#         return result

#     head = list_to_linked(input_list)

#     tracemalloc.start()
#     start = time.perf_counter()

#     result_node = Solution().swapPairs(head)

#     end = time.perf_counter()
#     current, peak = tracemalloc.get_traced_memory()
#     tracemalloc.stop()

#     print(f"処理時間: {(end - start) * 1000:.3f} ms")
#     print(f"使用メモリ: {peak / 1024:.2f} KB")

#     return linked_to_list(result_node)
# ```

# ---

# ## ✅ テスト例

# ```python
# print(test_with_metrics([1, 2, 3, 4]))   # 出力: [2, 1, 4, 3]
# print(test_with_metrics([]))            # 出力: []
# print(test_with_metrics([1]))           # 出力: [1]
# print(test_with_metrics([1, 2, 3]))     # 出力: [2, 1, 3]
# ```

# ---

# ## ✅ 計算量解析

# | 指標        | 値               |
# | --------- | --------------- |
# | 時間計算量     | O(n)（n: ノード数）   |
# | 空間計算量（追加） | O(1)（再帰ではなくループ） |
# | ノード上限     | 最大 100 ノード      |
# | 安定性       | スタックオーバーフローなし   |

# ---

# ## ✅ ノード接続図（簡易図解）

# ```
# Before: prev → 1 → 2 → 3 → 4

# Step 1:
#          ↓
# prev → 2 → 1 → 3 → 4

# Step 2:
#                 ↓
# prev → 2 → 1 → 4 → 3

# Return: dummy.next（＝スワップ後の先頭）
# ```

# ---

# ## ✅ まとめ

# * クラスではなく関数構成中心（`Solution.swapPairs()` のみ LeetCode制約でクラスに）
# * ノード値の変更なし、`next` のみ変更
# * 実行時間・メモリ効率ともに優秀（定数空間使用）
# * テスト可能な補助関数あり

# ---

# ご希望があれば、再帰的解法や図付きの詳しい追跡解析も対応可能です。必要ですか?


# `Pylance` の警告は、型注釈に対して**厳格な代入ルール**が適用されていることに起因しています。
# 具体的にはこの行：

# ```python
# first: ListNode = prev.next
# ```

# で、`prev.next` の型は `Optional[ListNode]`（= `ListNode | None`）であるため、`None` の可能性を排除しない限り、`ListNode` への代入は型エラーになります。

# ---

# ## ✅ 修正方法①：型チェックを明示する（最も安全）

# ```python
# from typing import Optional

# class ListNode:
#     def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
#         self.val = val
#         self.next = next

# class Solution:
#     def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
#         dummy: ListNode = ListNode(0)
#         dummy.next = head
#         prev: ListNode = dummy

#         while prev.next is not None and prev.next.next is not None:
#             # ここで .next は None ではないことが保証されているため型アサート可能
#             first = prev.next
#             second = first.next

#             assert first is not None and second is not None  # 型保証（Pylance対応）

#             # スワップ処理
#             first.next = second.next
#             second.next = first
#             prev.next = second

#             # 次のペアへ進める
#             prev = first

#         return dummy.next
# ```

# ### 🔎 ポイント

# * `assert` で `None` ではないことを明示することで、Pylance も `first` / `second` を `ListNode` として扱えるようになります。
# * `Optional[ListNode]` 型から `ListNode` 型への安全なダウンキャストを保証。

# ---

# ## ✅ 修正方法②：`Optional[ListNode]` のまま処理する（代替）

# 以下のように、代入時に型を `Optional[ListNode]` に保ちます：

# ```python
# first: Optional[ListNode] = prev.next
# second: Optional[ListNode] = first.next if first else None
# ```

# ただし、その後で `if first and second:` のような条件分岐が必要になるため、**やや冗長**です。

# ---

# ## ✅ 結論

# LeetCode の制約では型アノテーションは強制ではありませんが、Pylance（VSCode 等で使用）での警告を回避するためには **`assert` による型保証を明示的に追加するのがベスト** です。

# ---

# ### ✅ 処理時間・メモリの見積もり

# * 時間計算量: `O(n)`（ノード数に比例）
# * 空間計算量: `O(1)`（追加メモリは固定）

# ---

# 他にも `match/case`（3.10以降）や `typing.cast()` を使った解法も可能です。必要であればそれも提示できます！
