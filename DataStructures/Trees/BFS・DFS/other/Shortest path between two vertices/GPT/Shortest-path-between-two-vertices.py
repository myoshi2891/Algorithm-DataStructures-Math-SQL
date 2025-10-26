# # 1. 問題分析

# ### 競技プログラミング視点

# * **実行速度最優先**

#   * 木構造なので BFS/DFS で一度探索すれば O(N)。
#   * 経路復元は parent 配列を逆辿り O(N)。
# * **メモリ効率重視**

#   * 隣接リストは `list` + `defaultdict(list)`。
#   * BFS キューは `collections.deque` を使用（`pop(0)`回避）。
# * **Python制約**

#   * GILにより並列化の恩恵は少ない → 単スレッド BFS が最適。
#   * インタープリター実行コストを考慮し、関数呼び出し・クロージャを抑える。

# ### 業務開発視点

# * **可読性・保守性**: クラス + メソッド化、型ヒントで静的解析をサポート。
# * **エラーハンドリング**: 入力範囲外や辺情報不正時は `ValueError` を投げる。

# ### Python特有の考慮点

# * **deque**: BFSキューに最適（O(1) pop/append）。
# * **dict/set**: 隣接リストと訪問管理に効率的。
# * **内包表記**: グラフ構築時に高速化可能。
# * **ジェネレータ**: 経路出力を逐次処理したい場合に有効（ただし今回はリスト化）。

# ---

# # 2. アルゴリズム比較

# | アプローチ                 | 時間計算量      | 空間計算量 | 実装コスト | 可読性 | Python標準ライブラリ活用    | 備考               |
# | --------------------- | ---------- | ----- | ----- | --- | ------------------ | ---------------- |
# | 方法A: BFS + parent 復元  | O(N)       | O(N)  | 低     | 高   | deque, defaultdict | 最もシンプル・高速        |
# | 方法B: Dijkstra (heapq) | O(N log N) | O(N)  | 中     | 中   | heapq              | 重み付きグラフ用、本問題では過剰 |
# | 方法C: DFS全探索           | O(N²)      | O(1)  | 低     | 中   | なし                 | 小規模なら可、制約では不可    |

# ---

# # 3. 実装方針

# * **採用**: 方法A (BFS + parent 復元)
# * **理由**:

#   * 計算量 O(N) で十分高速
#   * deque による BFS は Python に最適
#   * parent 配列からの経路復元はシンプルかつ可読性高い
# * **Python最適化ポイント**:

#   * `defaultdict(list)` で隣接リスト構築
#   * BFSキューは `deque`
#   * 経路復元はリスト逆順 + `reverse()`

# ---

# # 4. コード実装例

import sys
from collections import defaultdict, deque

# ```python
from typing import Dict, List


class Solution:
    def shortest_path_in_tree(
        self, n: int, x: int, y: int, edges: List[List[int]]
    ) -> List[int]:
        """
        木における2頂点間の最短経路を BFS で求める

        Args:
            n (int): 頂点数 (1 <= n <= 100000)
            x (int): 始点 (1 <= x <= n)
            y (int): 終点 (1 <= y <= n, x != y)
            edges (List[List[int]]): 辺のリスト (n-1 個)

        Returns:
            List[int]: 最短経路に含まれる頂点番号を始点→終点の順に並べたリスト

        Raises:
            ValueError: 入力が不正な場合
        """
        if not (1 <= n <= 100000):
            raise ValueError("Invalid number of nodes")
        if not (1 <= x <= n and 1 <= y <= n and x != y):
            raise ValueError("Invalid start or end node")
        if len(edges) != n - 1:
            raise ValueError("Edges must contain exactly n-1 items")

        # 隣接リスト構築
        graph: Dict[int, List[int]] = defaultdict(list)
        for a, b in edges:
            if not (1 <= a <= n and 1 <= b <= n and a != b):
                raise ValueError("Invalid edge")
            graph[a].append(b)
            graph[b].append(a)

        # BFS
        parent = [-1] * (n + 1)
        parent[x] = 0
        q = deque([x])

        while q:
            cur = q.popleft()
            if cur == y:
                break
            for nxt in graph[cur]:
                if parent[nxt] == -1:
                    parent[nxt] = cur
                    q.append(nxt)

        # 経路復元
        path: List[int] = []
        node = y
        while node != 0:
            path.append(node)
            if node == x:
                break
            node = parent[node]
        path.reverse()
        return path


if __name__ == "__main__":
    sys.setrecursionlimit(1 << 25)
    input_data = sys.stdin.read().strip().split("\n")
    N, X, Y = map(int, input_data[0].split())
    edges = [list(map(int, line.split())) for line in input_data[1:]]
    solver = Solution()
    result = solver.shortest_path_in_tree(N, X, Y, edges)
    print("\n".join(map(str, result)))
# ```

# ---

# # 5. 計算量まとめ

# * **時間計算量**: O(N)
# * **空間計算量**: O(N) (`graph`, `parent`, `queue`)
# * **Python固有オーバーヘッド**:

#   * GIL により並列処理不可
#   * deque, dict は C 実装で高速
#   * 再帰 DFS ではなく BFS にすることで `RecursionError` 回避

# ---

# # 6. Python固有の最適化観点

# * **CPython最適化**

#   * `deque` による O(1) キュー操作
#   * `defaultdict(list)` による簡潔な隣接リスト生成
# * **メモリ効率化**

#   * `parent` を固定長リストにして再利用
#   * ジェネレータ出力も可能だが今回はリスト返却
# * **型ヒント**

#   * `List[int]`, `Dict[int, List[int]]` を明記
#   * Pylance による静的解析をサポート

# ---

# ✅ これで **制約 N ≤ 100000** に対して十分高速・堅牢に動作します。
