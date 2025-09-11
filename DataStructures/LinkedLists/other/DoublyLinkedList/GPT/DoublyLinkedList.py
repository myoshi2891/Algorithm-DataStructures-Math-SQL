# # 1. 問題分析

# ### 競技プログラミング視点

# * **データ規模**: N, Q ≤ 100 なので、O(NQ) でも十分高速。
# * **実装優先度**: 配列より「双方向リスト」の再現が目的。
# * **速度確保**: Pythonではオブジェクト生成コストがあるため、ループの最適化がポイント。

# ### 業務開発視点

# * **可読性**: `Node` クラス + `DoublyLinkedList` クラスで責務分離。
# * **保守性**: 型ヒントをつけて Pylance で静的解析可能にする。
# * **堅牢性**: 範囲外アクセスを明示的に `ValueError` として扱う。

# ### Python特有の考慮点

# * `list` / `deque` を使えばもっと簡単だが、ここでは「自作双方向リスト」に意味がある。
# * 内包表記での `to_list` 実装など Pythonic に書く。
# * `__slots__` を使うことで `Node` のメモリ効率改善可。

# ---

# # 2. アルゴリズム比較

# | アプローチ         | 時間計算量      | 空間計算量 | 実装コスト | 可読性 | 標準ライブラリ           | 備考            |
# | ------------- | ---------- | ----- | ----- | --- | ----------------- | ------------- |
# | 方法A: deque 利用 | O(1) 挿入/削除 | O(N)  | 低     | 高   | collections.deque | 最速だがリスト自作感なし  |
# | 方法B: heapq利用  | O(n log n) | O(n)  | 中     | 中   | heapq             | 優先度処理向き、今回は不要 |
# | 方法C: 自作双方向リスト | O(n) 挿入/削除 | O(N)  | 高     | 中   | なし                | 本問題の要求に忠実     |

# ---

# # 3. 実装方針

# * **選択したアプローチ**: 方法C（自作双方向リスト）
# * **理由**:

#   * 問題文が「双方向リスト」を明示しているため、構造体で再現。
#   * N, Q が小さいため、線形探索でも十分高速。
#   * 学習的価値（構造理解）も大きい。
# * **最適化ポイント**:

#   * `Node` に `__slots__` を定義し、属性辞書を持たせずメモリ削減。
#   * `insert_at` / `erase_at` は **O(n)** 探索 + **O(1)** 更新。
#   * `to_list` は while ループで単純に走査。

# ---

# # 4. コード実装例

# ```python
from typing import Optional, List


class Node:
    __slots__ = ("value", "prev", "next")

    def __init__(self, value: int):
        self.value: int = value
        self.prev: Optional["Node"] = None
        self.next: Optional["Node"] = None


class DoublyLinkedList:
    def __init__(self) -> None:
        self.head: Optional[Node] = None
        self.tail: Optional[Node] = None
        self.length: int = 0

    def append(self, value: int) -> None:
        """末尾に追加"""
        node = Node(value)
        if self.head is None:
            self.head = self.tail = node
        else:
            assert self.tail is not None
            self.tail.next = node
            node.prev = self.tail
            self.tail = node
        self.length += 1

    def insert_at(self, pos: int, value: int) -> None:
        """1-based位置 pos に挿入"""
        if pos < 1 or pos > self.length + 1:
            raise ValueError("Invalid position for insert")
        if pos == self.length + 1:
            self.append(value)
            return
        node = Node(value)
        if pos == 1:
            assert self.head is not None
            node.next = self.head
            self.head.prev = node
            self.head = node
        else:
            cur = self.head
            for _ in range(pos - 1):
                assert cur is not None
                cur = cur.next
            assert cur is not None
            prev_node = cur.prev
            if prev_node:
                prev_node.next = node
            node.prev = prev_node
            node.next = cur
            cur.prev = node
            if pos == 1:
                self.head = node
        self.length += 1

    def erase_at(self, pos: int) -> None:
        """1-based位置 pos を削除"""
        if pos < 1 or pos > self.length:
            raise ValueError("Invalid position for erase")
        cur = self.head
        for _ in range(pos - 1):
            assert cur is not None
            cur = cur.next
        assert cur is not None
        if cur.prev:
            cur.prev.next = cur.next
        else:
            self.head = cur.next
        if cur.next:
            cur.next.prev = cur.prev
        else:
            self.tail = cur.prev
        self.length -= 1

    def to_list(self) -> List[int]:
        res: List[int] = []
        cur = self.head
        while cur:
            res.append(cur.value)
            cur = cur.next
        return res


def process_list(N: int, Q: int, A: List[int], queries: List[List[int]]) -> List[int]:
    dll = DoublyLinkedList()
    for v in A:
        dll.append(v)
    for q in queries:
        if q[0] == 1:
            _, P, X = q
            dll.insert_at(P, X)
        elif q[0] == 2:
            _, P = q
            dll.erase_at(P)
        else:
            raise ValueError("Invalid query type")
    return dll.to_list()


def main() -> None:
    import sys

    input_data = sys.stdin.read().strip().splitlines()
    N, Q = map(int, input_data[0].split())
    A = [int(x) for x in input_data[1 : 1 + N]]
    queries = [list(map(int, line.split())) for line in input_data[1 + N :]]
    result = process_list(N, Q, A, queries)
    print("\n".join(map(str, result)))


if __name__ == "__main__":
    main()
# ```

# ---

# # 5. 計算量まとめ

# * `insert_at`, `erase_at`: **O(n)**（ノード探索） + **O(1)**（リンク更新）
# * 全体: O(NQ) （N,Q ≤ 100 なので余裕）
# * **Python特有のオーバーヘッド**:

#   * クラス生成コストあり（ただし小規模なので問題なし）
#   * CPythonは属性アクセスが遅め → `__slots__` で軽減

# ---

# # 6. Python固有の最適化観点

# * **CPython最適化**:

#   * `__slots__` により `Node` の辞書オーバーヘッドを削減。
#   * while ループの方が for より速いケースが多い。
# * **メモリ効率化**:

#   * ジェネレータ不要（出力全件を一度に出す必要があるため）。
# * **型ヒント**:

#   * `Optional[Node]`, `List[int]` を明記。
#   * Pylance による補完・検証が効く。

# ---

# ✅ これで **Python 3.8.10 双方向リスト版の完全解答** になります。
