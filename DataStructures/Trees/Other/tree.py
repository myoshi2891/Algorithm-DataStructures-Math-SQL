# 以下は、**Python (CPython 3.11.4)** 向けに記述された、**隣接行列を生成する処理関数付きコード**です。
# `typing` による型ヒントを明示し、`Pylance`（例: VSCode）でも型エラーが出ないように配慮しています。

# ---

# ## ✅ 解答コード（Python）

# ```python
# from typing import List
# import sys

# def build_adjacency_matrix(n: int, edges: List[tuple[int, int]]) -> List[List[int]]:
#     """
#     隣接行列を生成する関数。

#     Parameters:
#     - n (int): 頂点数
#     - edges (List[tuple[int, int]]): 辺のリスト（1-based index）

#     Returns:
#     - List[List[int]]: 隣接行列（n x n の二次元リスト）
#     """
#     adj: List[List[int]] = [[0] * n for _ in range(n)]

#     for a, b in edges:
#         a_index = a - 1  # 0-based index
#         b_index = b - 1
#         adj[a_index][b_index] = 1
#         adj[b_index][a_index] = 1  # 無向グラフのため対称

#     return adj

# def main() -> None:
#     """
#     標準入力から木の情報を読み取り、隣接行列を出力する。
#     """
#     input_lines: List[str] = sys.stdin.read().strip().split('\n')
#     n: int = int(input_lines[0])
#     edges: List[tuple[int, int]] = [tuple(map(int, line.split())) for line in input_lines[1:]]

#     adjacency_matrix: List[List[int]] = build_adjacency_matrix(n, edges)

#     for row in adjacency_matrix:
#         print(' '.join(map(str, row)))

# if __name__ == "__main__":
#     main()
# ```

# ---

# ## ✅ 実行例

# ### 入力例（stdin）

# ```
# 6
# 1 2
# 1 3
# 3 4
# 4 5
# 3 6
# ```

# ### 出力

# ```
# 0 1 1 0 0 0
# 1 0 0 0 0 0
# 1 0 0 1 0 1
# 0 0 1 0 1 0
# 0 0 0 1 0 0
# 0 0 1 0 0 0
# ```

# ---

# ## ✅ 処理時間・メモリ使用量の見積り

# | 指標     | 値                          | 備考          |
# | ------ | -------------------------- | ----------- |
# | 時間計算量  | `O(N^2)`                   | 隣接行列構築・出力処理 |
# | メモリ使用量 | 約 32MB (`int[2000][2000]`) | 最大入力での理論値   |

# ---

# ## ✅ Pylance対応・補足

# * `List[tuple[int, int]]` や `List[List[int]]` を明示することで、Pylance の型推論精度が向上します。
# * 可能なら `collections.defaultdict(list)` による隣接リスト管理も視野に入れられますが、今回は隣接**行列**が目的のため不要です。

# ---

# ご希望があれば、**隣接リスト版**や**NumPyを使った高速化版**も提供可能です。

# このエラーは、Python 3.8 以前の互換性や、`tuple[int, int]` のような **built-in generics の直書き**が原因です。

# あなたの環境で `TypeError: 'type' object is not subscriptable` が出るのは、次のような原因が考えられます：

# ---

# ### ❗ 原因：`tuple[int, int]` が Python 3.9 以降専用の記法

# * `tuple[int, int]` のような記法は **Python 3.9+** で正式に導入されたものです。
# * **Python 3.8 以下**や一部ツールでは、これは `TypeError` になります。

# ---

# ### ✅ 対処法：`Tuple[int, int]` を使う（`typing.Tuple`）

# 以下のように修正してください：

# ```python
# from typing import List, Tuple  # Tuple を追加

# def build_adjacency_matrix(n: int, edges: List[Tuple[int, int]]) -> List[List[int]]:
# ```

# ---

# ## 🔁 修正済み完全コード（Pylance対応・Python 3.7〜3.11対応）

# ```python
from typing import List, Tuple
import sys

def build_adjacency_matrix(n: int, edges: List[Tuple[int, int]]) -> List[List[int]]:
    """
    隣接行列を生成する関数。

    Parameters:
    - n (int): 頂点数
    - edges (List[Tuple[int, int]]): 辺のリスト（1-based index）

    Returns:
    - List[List[int]]: 隣接行列（n x n の二次元リスト）
    """
    adj: List[List[int]] = [[0] * n for _ in range(n)]

    for a, b in edges:
        a_index = a - 1  # 0-based index
        b_index = b - 1
        adj[a_index][b_index] = 1
        adj[b_index][a_index] = 1  # 無向グラフのため対称

    return adj

def main() -> None:
    """
    標準入力から木の情報を読み取り、隣接行列を出力する。
    """
    input_lines: List[str] = sys.stdin.read().strip().split('\n')
    n: int = int(input_lines[0])
    # edges: List[Tuple[int, int]] = [tuple(map(int, line.split())) for line in input_lines[1:]]
    edges: List[Tuple[int, int]] = [
    (int(a), int(b)) for a, b in (line.split() for line in input_lines[1:])
    ]

    adjacency_matrix: List[List[int]] = build_adjacency_matrix(n, edges)

    for row in adjacency_matrix:
        print(' '.join(map(str, row)))

if __name__ == "__main__":
    main()
# ```

# ---

# ## ✅ メモ（Pythonバージョン別の記法）

# | バージョン  | 記法例                     | 備考                        |
# | ------ | ----------------------- | ------------------------- |
# | 3.8 以下 | `List[Tuple[int, int]]` | `typing.Tuple` を使う必要あり    |
# | 3.9 以降 | `list[tuple[int, int]]` | `built-in generics` 使用可能  |
# | 3.11   | 両方使用可能                  | `pyright`, `Pylance` も対応済 |

# ---

# 引き続きエラーが出る場合、使用している Python バージョン (`python3 --version`) を教えていただければ、さらに適切な対応を案内します。

# ありがとうございます。そのエラーは、**Pylance（Pyright）による型整合性チェック**で発生しています。
# 主な原因は、以下のように `tuple(...)` で生成されたタプルが `Tuple[int, int]` 型だと **正確に推論できない**ケースがあるためです。

# ---

# ## ✅ 問題の本質

# ```python
# edges: List[Tuple[int, int]] = [tuple(map(int, line.split())) for line in input_lines[1:]]
# ```

# この部分で `tuple(...)` により作られた値の型が **`tuple[int, ...]`**（長さ不定）と推論されるため、
# Pylance はそれを **`Tuple[int, int]`（長さ2固定）** に割り当てるのは不適切と判断して型エラーを出します。

# ---

# ## ✅ 修正案

# ### ✅ 方法1：リスト内包表記で明示的に2要素を unpack してタプルを作成（推奨）

# ```python
# edges: List[Tuple[int, int]] = [
#     (int(a), int(b)) for a, b in (line.split() for line in input_lines[1:])
# ]
# ```

# この方法なら Pylance も `Tuple[int, int]` であることを正確に推論できます。

# ---

# ## ✅ 修正後の完全コード（Pylance型エラーなし）

# ```python
# from typing import List, Tuple
# import sys

# def build_adjacency_matrix(n: int, edges: List[Tuple[int, int]]) -> List[List[int]]:
#     """
#     隣接行列を生成する関数。

#     Parameters:
#     - n (int): 頂点数
#     - edges (List[Tuple[int, int]]): 辺のリスト（1-based index）

#     Returns:
#     - List[List[int]]: 隣接行列（n x n の二次元リスト）
#     """
#     adj: List[List[int]] = [[0] * n for _ in range(n)]

#     for a, b in edges:
#         a_index = a - 1
#         b_index = b - 1
#         adj[a_index][b_index] = 1
#         adj[b_index][a_index] = 1

#     return adj

# def main() -> None:
#     """
#     標準入力から木の情報を読み取り、隣接行列を出力する。
#     """
#     input_lines: List[str] = sys.stdin.read().strip().split('\n')
#     n: int = int(input_lines[0])
    
#     # 各行を unpack して Tuple[int, int] 型で格納
#     edges: List[Tuple[int, int]] = [
#         (int(a), int(b)) for a, b in (line.split() for line in input_lines[1:])
#     ]

#     adjacency_matrix: List[List[int]] = build_adjacency_matrix(n, edges)

#     for row in adjacency_matrix:
#         print(' '.join(map(str, row)))

# if __name__ == "__main__":
#     main()
# ```

# ---

# ## ✅ 解説まとめ

# | 修正前                             | 修正後                |
# | ------------------------------- | ------------------ |
# | `tuple(map(int, line.split()))` | `(int(a), int(b))` |

# * Pylanceは「タプルの**長さ**」にも厳格です
# * `Tuple[int, int]` は「2つのint」と明示されているため、それに合わせて作成する必要があります

# ---

# ### ✔補足

# * Python自体は問題なく動きます（これは**静的型チェックのエラー**）
# * 型安全に開発を続けたい場合はこのように明示的に型が一致するよう書くのがベストです

# ---

# 他にも `mypy` 対応や `TypedDict` など、さらに型を厳密にしたい場合はお知らせください。
