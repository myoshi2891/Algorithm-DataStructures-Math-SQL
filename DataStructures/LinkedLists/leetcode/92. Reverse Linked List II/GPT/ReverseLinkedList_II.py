# ## 1. 多角的問題分析

# ### 競技プログラミング視点

# * 目標：**一回走査 O(n)**・**追加メモリ O(1)**。
# * 解法：番兵なしでも可能な **「部分区間の原地反転（前向き再配線）」**。`left==1` を個別処理するとダミーノード不要で最小割当。

# ### 業務開発視点

# * 可読性：`pre`（left直前）、`start`（区間先頭）、`curr/prev/next_` を役割明確に命名。
# * 保守性：境界条件 `head is None / left==right / left==1` を早期 return/分岐で処理。
# * 型安全：`Optional["ListNode"]` を徹底。前方参照は文字列リテラルで pylance 互換。

# ### Python特有考慮

# * CPython の関数呼び出し/例外コスト回避のため**ループ内は代入のみ**に限定。
# * 追加ノード（番兵）を作らず**割当 0**にしてメモリフットプリント最小化。
# * 変数はローカルに閉じ、参照寿命を短くし GC 圧力を抑制。

# ---

# ## 2. アルゴリズム比較表

# | アプローチ             | 時間計算量    | 空間計算量    | Python実装コスト | 可読性 | 標準ライブラリ活用 | CPython最適化 | 備考                  |
# | ----------------- | -------- | -------- | ----------- | --- | --------- | ---------- | ------------------- |
# | A: ダミー無し・一回走査（採用） | **O(n)** | **O(1)** | 低           | 高   | 不要        | 良          | `left==1` を個別処理し割当0 |
# | B: ダミー有り・一回走査     | O(n)     | O(1)     | 低           | 高   | 不要        | 良          | 実装容易だが1ノード分の割当      |
# | C: 再帰反転           | O(n)     | O(n)     | 中           | 中   | 不要        | 不可         | 再帰深さ=区間長、不要なコールスタック |

# ---

# ## 3. Python特有最適化ポイント

# * **追加割当をゼロ**：番兵を作らない（`left==1` を専用ロジック）。
# * ループ内は**単純代入のみ**で分岐最小化。
# * 局所変数（`prev/curr/next_`）に束縛して属性アクセス回数を最小化。

# ---

# ## 4. 実装（LeetCode 回答フォーマット / Class 形式）

# ```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


from typing import Optional


class Solution:
    """
    Reverse Linked List II
    - One-pass, in-place, no extra node allocation (no dummy).
    - Time: O(n), Space: O(1)
    """

    def reverseBetween(
        self, head: Optional["ListNode"], left: int, right: int
    ) -> Optional["ListNode"]:
        # エッジ：空/区間長1はそのまま
        if head is None or left == right:
            return head

        # Case 1) 先頭から反転（left == 1）: head を直接反転し、新しい先頭を返す
        if left == 1:
            prev: Optional["ListNode"] = None
            curr: Optional["ListNode"] = head
            # 先頭から right 個を反転
            for _ in range(right):
                # 制約 1 <= right <= n より curr は None にならない
                next_: Optional["ListNode"] = curr.next  # type: ignore[reportOptionalMemberAccess]
                curr.next = prev  # type: ignore[reportOptionalMemberAccess]
                prev = curr
                curr = next_
            # 旧先頭 head は反転後の末尾になるので、残り（curr）に接続
            head.next = curr  # type: ignore[reportOptionalMemberAccess]
            return prev

        # Case 2) 中間以降の反転（left > 1）
        # 1) left-1 位置まで進めて pre を「反転開始直前」へ
        pre: "ListNode" = head
        for _ in range(1, left - 1):
            pre = pre.next  # type: ignore[reportOptionalMemberAccess]

        # 2) 区間 [left, right] を通常の反転で反転
        start: "ListNode" = pre.next  # type: ignore[reportOptionalMemberAccess]
        prev: Optional["ListNode"] = None
        curr: Optional["ListNode"] = start
        for _ in range(right - left + 1):
            next_: Optional["ListNode"] = curr.next  # type: ignore[reportOptionalMemberAccess]
            curr.next = prev  # type: ignore[reportOptionalMemberAccess]
            prev = curr
            curr = next_

        # 3) 再接続：pre -> (反転後先頭=prev) ... (反転後末尾=start) -> curr
        pre.next = prev
        start.next = curr
        return head


# ```

# **実装要点**

# * `left==1` と `left>1` を分けることで番兵ノードを廃し、**割当 0** を達成。
# * 反転は「標準の単方向リスト反転」を区間長だけ実施し、その後 **2点で再接続**（`pre.next`, `start.next`）。
# * 型注釈は `Optional["ListNode"]` を使用し、pylance の前方参照問題を回避。`type: ignore` は Optional 成員アクセスの静的誤検知回避に限定。

# ---

# ## 5. 検証（観点のみ）

# * 境界：`[5], (1,1)` / `[1,2], (1,2)` / `[1,2,3], (2,2)` / `[1,2,3,4,5], (1,5)` / `(2,4)` 等で期待形を手計算一致。
# * 制約遵守：一回走査・原地 O(1)・追加割当無し。
# * 型チェック：pylance 前方参照OK、Optionalの扱いはループ構造と制約で安全。
