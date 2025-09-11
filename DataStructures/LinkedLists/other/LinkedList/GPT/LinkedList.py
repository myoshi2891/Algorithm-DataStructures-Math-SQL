# # 1. 問題の分析

# ## 競技プログラミング視点

# * **制約**：`N, Q < 100`（非常に小さい） → 単純な O(N) 操作で十分高速。
# * **性能方針**：

#   * 単方向リストを直接シミュレート（`ListNode` + `next`）で操作する（明示的なポインタ走査）。
#   * 走査は単純な `for` ループで実施し、不要な配列コピーを避ける。
#   * ノード数が小さいので、アルゴリズムの単純さを優先しても十分速い。

# ## 業務開発視点

# * **可読性・保守性**：`ListNode` と `solve` を分離、docstring と型ヒントを付与。
# * **堅牢性**：入力の簡易検証（型・範囲）を入れる。違反時は `TypeError` / `ValueError` を投げる。
# * **静的解析対応**：型ヒントにより Pylance 等での補助を得られる。

# ## Python特有の考慮点

# * `__slots__` で `ListNode` のメモリ/属性オーバーヘッドを削減（CPythonで有効）。
# * リスト（配列）操作よりポインタ操作の方が意味的に直感的（今回はサイズ小のため差は微小）。
# * for ループを使い、不要な関数オブジェクト生成を避ける。

# ---

# # 2. アルゴリズム比較（要約）

# | アプローチ                   |       時間計算量（1クエリ） |  全体時間 |   空間 | 実装コスト | 可読性 | 備考                   |
# | ----------------------- | ----------------: | ----: | ---: | ----: | --: | -------------------- |
# | 方法A: 単方向リスト走査           |              O(M) | O(NQ) | O(N) |     低 |   高 | 今回の前提に最適             |
# | 方法B: Python list（挿入/削除） | O(M)（insert/ pop） | O(NQ) | O(N) |  非常に低 |   中 | 実装簡単だが配列シフトが発生       |
# | 方法C: deque や他構造         |  O(N)（任意位置挿入不可効率） | O(NQ) | O(N) |     中 |   中 | deque は両端に強いが任意位置は弱い |

# ※制約が小さいためどれも実用的。要件が「片方向リストの操作」に明示されているため、**ListNode を用いた方法A** を採用します。

# ---

# # 3. 採用方針

# * **選択**: 方法A（単方向リスト走査）
# * **理由**:

#   * 問題文の趣旨（片方向リストの操作を模す）に合致。
#   * 実行数が小さいため、単純で明快な走査実装が最適。
#   * `__slots__` でノードオーバーヘッドを低減し、Pythonでもメモリ効率を高める。
# * **Python最適化ポイント**:

#   * `__slots__` を使うことで `ListNode` の辞書を省く（小数だが有益）。
#   * 走査は `for _ in range(...)` を使う（インデックス不要で直接 `next` を辿る）。
#   * 最小限の属性で Node 構造を統一（hidden-class 的効果を期待）。

# ---

# # 4. 実装（solution.py）

import sys

# ```python
#!/usr/bin/env python3
# Python 3.8.10
from typing import Optional


class ListNode:
    """単方向リストのノード（軽量化のため __slots__ を使用）"""

    __slots__ = ("val", "next")

    def __init__(self, val: int) -> None:
        self.val: int = val
        self.next: Optional["ListNode"] = None


def solve(input_str: str) -> str:
    """
    入力を受け取り、クエリを処理して結果を返す。

    Args:
        input_str: 標準入力相当の文字列（末尾改行可）
    Returns:
        出力文字列（末尾に改行を含む場合あり）。リストが空なら空文字を返す。

    Raises:
        TypeError: 入力の形式が不正なとき
        ValueError: 値域や制約を満たさないとき
    Complexity:
        初期リスト構築 O(N), 各クエリは最悪 O(M)（M はその時のリスト長）
    """
    if not isinstance(input_str, str):
        raise TypeError("input_str must be a string")

    lines = input_str.rstrip("\n").split("\n")
    if len(lines) == 0:
        raise ValueError("empty input")

    # ヘッダ行解析
    header = lines[0].strip().split()
    if len(header) != 2:
        raise ValueError("first line must contain two integers N Q")
    try:
        N = int(header[0])
        Q = int(header[1])
    except Exception:
        raise TypeError("N and Q must be integers")

    if not (1 <= N < 100) or not (1 <= Q < 100):
        raise ValueError("N,Q out of allowed range (1 <= N,Q < 100)")

    # 行数チェック（最低限）
    expected_lines = 1 + N + Q
    if len(lines) < expected_lines:
        raise ValueError("insufficient lines for provided N and Q")

    # 初期リスト構築（末尾追加）
    head: Optional[ListNode] = None
    tail: Optional[ListNode] = None
    idx_line = 1
    for i in range(N):
        s = lines[idx_line].strip()
        idx_line += 1
        try:
            v = int(s)
        except Exception:
            raise TypeError("A_i must be integer")
        node = ListNode(v)
        if head is None:
            head = tail = node
        else:
            assert tail is not None
            tail.next = node
            tail = node

    # クエリ処理
    for _ in range(Q):
        parts = lines[idx_line].strip().split()
        idx_line += 1
        if not parts:
            raise ValueError("empty query line")
        try:
            t = int(parts[0])
        except Exception:
            raise TypeError("query type must be integer")
        if t == 1:
            # INSERT P X
            if len(parts) != 3:
                raise ValueError("INSERT query must have 3 parts")
            try:
                P = int(parts[1])
                X = int(parts[2])
            except Exception:
                raise TypeError("P and X must be integers")
            # M を明示的に計算せず、位置走査で対応（constraints guarantee 1 <= P <= M+1）
            new_node = ListNode(X)
            if P == 1:
                # insert at head
                new_node.next = head
                head = new_node
                if tail is None:
                    tail = new_node
            else:
                # traverse to (P-1)th node (1-based)
                prev = head
                # prev should not be None because P >= 2 and list non-empty when P>1 by constraints
                for _i in range(1, P - 1):
                    # move prev forward; constraints ensure this is safe
                    assert prev is not None
                    prev = prev.next
                # now prev is the (P-1)-th node
                assert prev is not None
                new_node.next = prev.next
                prev.next = new_node
                if new_node.next is None:
                    tail = new_node
        elif t == 2:
            # ERASE P
            if len(parts) != 2:
                raise ValueError("ERASE query must have 2 parts")
            try:
                P = int(parts[1])
            except Exception:
                raise TypeError("P must be integer")
            if head is None:
                # constraints state list is non-empty for ERASE, but be defensive
                raise ValueError("attempt to ERASE from empty list")
            if P == 1:
                # remove head
                head = head.next
                if head is None:
                    tail = None
            else:
                prev = head
                for _i in range(1, P - 1):
                    assert prev is not None
                    prev = prev.next
                # prev is (P-1)-th node, prev.next is P-th node
                assert prev is not None and prev.next is not None
                prev.next = prev.next.next
                if prev.next is None:
                    tail = prev
        else:
            raise ValueError("invalid query type; must be 1 or 2")

    # 出力作成
    out_lines = []
    node = head
    while node is not None:
        out_lines.append(str(node.val))
        node = node.next

    if not out_lines:
        return ""  # 何も出力しない
    # 末尾に改行を入れて返す（出力の最後に改行が必要）
    return "\n".join(out_lines) + "\n"


if __name__ == "__main__":
    data = sys.stdin.read()
    res = solve(data)
    # 空文字の場合は何も出力しない
    if res:
        sys.stdout.write(res)
# ```

# ---

# # 5. 計算量と要約

# * 初期構築: O(N)（末尾追加を使用）
# * 各クエリ: 最悪 O(M)（M はその時のリスト長）。全体で O(NQ)（最大でも非常に小さい）。
# * 空間: O(N)（ノード数に比例）
# * 実装は競技的にも可読性面でもバランスの良い設計。

# ---

# # 6. 追加メモ（Python最適化チェックリスト）

# * `__slots__` により `ListNode` のメモリ/属性に関するオーバーヘッドを削減。
# * 走査は最小限にとどめ、余計な配列コピーを発生させない。
# * 型ヒント・docstring を入れることで Pylance 等での静的解析が可能。
# * N,Q が大きくなる場合は別戦略（例えばインデックス付き平衡構造など）の検討が必要。

# ---

# 必要であれば、同じ実装を **よりテストしやすい（純粋関数化）** にする派生や、N,Q が大きい場合の効率的な実装案（例えばオフライン操作・バランス木やランダム化されたデータ構造など）も提示できます。どれを優先しますか？
