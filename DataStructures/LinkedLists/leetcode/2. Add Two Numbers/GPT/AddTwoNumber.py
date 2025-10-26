# ## 1. 問題の分析

# ### 競技プログラミング視点での分析

# * **最速手法**: 2つの連結リストを**同時走査**し、各桁の和を求めて**繰り上がり（carry）**を伝搬。出力は先頭に**番兵（ダミー）ノード**を置き、テールポインタでO(1)追加。
# * **計算量**: 1パスで **O(n)**（nは長い方のノード数）。補助配列等を使わないため追加空間は **O(1)**（出力ノードを除く）。

# ### 業務開発視点での分析

# * **可読性/保守性**: 先頭ノードの特例分岐を番兵で排除し、`while (p or q or carry)` の単純ループに集約。安全な型注釈で後工程の静的解析（Pylance）にも強い。
# * **エラーハンドリング**: LeetCodeでは入力前提が保証されるため実行時例外は不要。堅牢性を上げたい場合は**任意の軽量バリデーション**を外部/前段で行う。

# ### Python特有考慮

# * **CPython最適化**: 単純な`while`ループ＋整数演算のみ。関数呼び出し・コンテナ生成を最小化。`//` と `%` を用いる。
# * **GIL影響**: CPU軽量な逐次計算であり影響は無視可能。
# * **内蔵データ構造**: 追加構造は使わず、`ListNode`と整数のみで完結。

# ---

# ## 2. アルゴリズム比較表

# | アプローチ                       | 時間計算量    | 空間計算量      | Python実装コスト | 可読性 | 標準ライブラリ活用 | CPython最適化 | 備考              |
# | --------------------------- | -------- | ---------- | ----------- | --- | --------- | ---------- | --------------- |
# | **方法A**: 同時走査＋carry（番兵＋テール） | **O(n)** | **O(1)**   | 低           | 高   | 不要        | 適          | 最短・定番           |
# | 方法B: 配列/文字列へ展開→数値化→再構築      | O(n)     | O(n)       | 中           | 中   | 不要        | 不適         | 桁溢れ/BigInt処理が冗長 |
# | 方法C: 再帰で桁加算                 | O(n)     | O(n)（再帰深さ） | 低           | 中   | 不要        | 不適         | 深い入力で非効率        |

# **採用:** 方法A（同時走査＋carry）

# ---

# ## 3. Python特有最適化ポイント

# * **ループ最適化**: `while p or q or carry:` の単純分岐で分配律のように処理。ローカル変数束縛を活用し属性アクセス回数を抑制。
# * **オブジェクト生成の抑制**: 毎ステップ新ノード1個のみ。中間リストやタプルを作らない。
# * **整数演算**: `carry, digit = divmod(sum_, 10)` でも良いが、読みやすさと速度のバランスで `carry = sum_ // 10; digit = sum_ % 10` を使用。

# ---

# ## 4. 実装コード（LeetCode形式 / Class）

# ```python
from __future__ import annotations
from typing import Optional


# LeetCode 環境では既に定義されていることが多いが、単独ファイルでも動くよう同等の定義を含める
class ListNode:
    def __init__(self, val: int = 0, next: Optional["ListNode"] = None) -> None:
        self.val: int = val
        self.next: Optional["ListNode"] = next


class Solution:
    """
    Add Two Numbers
    Two non-empty linked lists representing non-negative integers (digits in reverse order).
    Return the sum as a linked list (also in reverse order).

    競技向け: 単一パス O(n), 追加空間 O(1)（出力除く）
    Pylance配慮: Optional/型注釈を厳格に付与
    """

    def addTwoNumbers(
        self, l1: Optional[ListNode], l2: Optional[ListNode]
    ) -> Optional[ListNode]:
        """
        2つの逆順リストの和を逆順リストで返す（非破壊）

        Args:
            l1: 先頭ノード（None不可想定だが、型はOptionalでLeetCode互換）
            l2: 先頭ノード（同上）

        Returns:
            結果リストの先頭ノード

        Complexity:
            Time: O(n)  （nは長い方のリスト長）
            Space: O(1) （出力ノードを除く）
        """
        # ダミーヘッド（番兵）＋テールポインタで先頭分岐を排除
        dummy: ListNode = ListNode(0)
        tail: ListNode = dummy

        p: Optional[ListNode] = l1
        q: Optional[ListNode] = l2
        carry: int = 0

        # いずれかが残るか、carryが残る限り処理
        while p is not None or q is not None or carry != 0:
            x: int = p.val if p is not None else 0
            y: int = q.val if q is not None else 0

            sum_: int = x + y + carry
            carry = sum_ // 10
            digit: int = sum_ % 10

            tail.next = ListNode(digit)
            tail = tail.next  # type: ignore[assignment]  # tail.next は ListNode であることが文脈上保証される

            if p is not None:
                p = p.next
            if q is not None:
                q = q.next

            # ここまでで next は必ず None か ListNode のどちらか

        return dummy.next


# ```

# ---

# ## 5. 検証（方針のみ・テストコード不要）

# * **境界**: `l1=[0], l2=[0]` → `[0]`
# * **桁あふれ**: `l1=[9,9,9], l2=[1]` → `[0,0,0,1]`
# * **長さ不一致**: `l1=[2,4,3], l2=[5,6,4,9,9]` → 繰り上がり含め正しく連結
# * **最大長**: 100桁同士でも1パスで完了（追加空間O(1)）

# ---

# ### まとめ

# * **方法A（同時走査＋carry）**を採用：**O(n)** / **O(1)**、実装簡潔・堅牢。
# * **Pylance配慮**の厳密な型注釈（`Optional[ListNode]`、変数の型明示）で静的解析も問題なし。
# * **LeetCode互換のClass形式**で、そのまま提出可能です。
