# 以下に、Python（CPython 3.11.4）を用いた**部分文字列のハッシュ計算**の正しい解法を提示します。

# ---

# ## ✅ アルゴリズム概要

# 文字列 `S` の部分列 `S[L..R]` に対して以下を高速に求めます：

# $$
# H(V) = T_L \cdot X^{R-L} + T_{L+1} \cdot X^{R-L-1} + \dots + T_R \mod P
# $$

# 高速化のために以下を用います：

# * 累積ハッシュ（prefix hash）
# * `X^i mod P` の累積（べき乗テーブル）
# * 乗算逆元の代わりに、ハッシュの指数方向を「左から右」に揃える（A×X⁰ + B×X¹ + ...）

# ---

# ## ✅ 実装（CPython 3.11.4対応）

# ```python
from typing import List, Tuple

# --- 定数型の注釈付き関数定義 ---
def compute_hashes(
    P: int, X: int, S: str, queries: List[Tuple[int, int]]
) -> List[int]:
    """
    部分文字列のハッシュを高速に計算する関数。

    Parameters:
    - P (int): 素数であるMOD
    - X (int): ハッシュ用の基数 (2 <= X < P)
    - S (str): 大文字英字列 (長さN)
    - queries (List[Tuple[int, int]]): 各クエリ (1-indexed) の (L, R)

    Returns:
    - List[int]: 各クエリに対するハッシュ値 (mod P)
    """

    N: int = len(S)
    T: List[int] = [ord(c) - 64 for c in S]  # A=1, ..., Z=26

    # 累積ハッシュと累積べき乗配列
    h: List[int] = [0] * (N + 1)         # 0-indexedで h[i] = S[0:i]
    powX: List[int] = [1] * (N + 1)      # powX[i] = X^i mod P

    for i in range(1, N + 1):
        powX[i] = (powX[i - 1] * X) % P
        h[i] = (h[i - 1] * X + T[i - 1]) % P  # T[i-1] because S is 0-indexed

    results: List[int] = []

    for L, R in queries:
        length = R - L + 1
        left = h[L - 1]
        right = h[R]
        hash_val = (right - (left * powX[length]) % P + P) % P
        results.append(hash_val)

    return results
# ```

# ---

# ## ✅ 実行例（問題文のケース）

# ```python
if __name__ == "__main__":
    import sys

    input = sys.stdin.read
    data = input().splitlines()

    P, X, N, Q = map(int, data[0].split())
    S = data[1]
    # queries = [tuple(map(int, line.split())) for line in data[2:]]
    queries: List[Tuple[int, int]] = [
        (int(x), int(y)) for x, y in (line.split() for line in data[2:])
    ]

    results = compute_hashes(P, X, S, queries)

    for res in results:
        print(res)
# ```

# ---

# ## ✅ 入力例と出力

# **入力**（標準入力）：

# ```
# 1000000007 77777 10 5
# HELLOWORLD
# 1 10
# 5 8
# 1 7
# 6 10
# 7 7
# ```

# **出力**：

# ```
# 684699860
# 527230155
# 831444737
# 429964743
# 15
# ```

# ---

# ## ✅ 計算量と性能見積り

# * **時間計算量**：

#   * 累積ハッシュ・累乗：O(N)
#   * クエリ処理：O(1) × Q
#   * 合計：**O(N + Q)**

# * **空間計算量**：

#   * `h`, `powX`: O(N)
#   * 合計：**O(N)** ≒ 4 × 2 × 2e5 ≒ 約3.2MB

# ---

# ## ✅ 解説まとめ

# | 項目     | 内容                    |
# | ------ | --------------------- |
# | ハッシュ形式 | `左から右（X⁰, X¹, ...）`   |
# | 利用技法   | ローリングハッシュ、MOD P       |
# | 逆元不要   | powXを利用し、計算を減算と乗算で済ます |
# | 対応     | 長さ最大20万、クエリ20万対応可能    |

# ---

# 必要であれば、図解や部分ごとの可視化コードも提供可能です。

# ご指摘の **型エラー** は、以下のように `list[tuple[int, ...]]`（任意長のタプル）と `List[Tuple[int, int]]`（2要素のタプル）との**型の不一致**によって発生しています。

# これは **静的型検査ツール（Pylanceやmypy）** が `Tuple[int, int]` のような**固定長**を要求するのに対し、
# `tuple[int, ...]` が**可変長タプル**とみなされるためです。

# ---

# ## ✅ 解決方法

# ### 方法①：**クエリを明示的に2要素のタプルにキャスト**

# ```python
# # 正しく型を固定長に揃える
# queries: List[Tuple[int, int]] = [tuple(map(int, line.split())) for line in data[2:]]
# ```

# ⬇️ を

# ```python
# queries: List[Tuple[int, int]] = [
#     (int(x), int(y)) for x, y in (line.split() for line in data[2:])
# ]
# ```

# に変更するのが **型安全で Pylance も満足する解法**です。

# ---

# ## ✅ 修正後のサンプル（型エラー回避済）

# ```python
# if __name__ == "__main__":
#     import sys

#     input = sys.stdin.read
#     data = input().splitlines()

#     P, X, N, Q = map(int, data[0].split())
#     S = data[1]

#     # ✅ 型安全に2要素Tuple[int, int]を構成（静的型チェック通る）
#     queries: List[Tuple[int, int]] = [
#         (int(x), int(y)) for x, y in (line.split() for line in data[2:])
#     ]

#     results = compute_hashes(P, X, S, queries)

#     for res in results:
#         print(res)
# ```

# ---

# ## ✅ 解説

# | 問題の原因                                             | 修正                              |
# | ------------------------------------------------- | ------------------------------- |
# | `tuple[int, ...]` は可変長なので `Tuple[int, int]` に代入不可 | `(int(x), int(y))` の形に固定長タプルで構成 |

# ---

# ## ✅ 型安全を保証したいなら...

# * **関数引数側の注釈** → `List[Tuple[int, int]]`
# * **呼び出し側の構成** → 各クエリ `(L, R)` を必ず2要素タプルとして構築

# ---

# 必要であれば `Sequence[Tuple[int, int]]` や `Iterable` を許容する設計にも変更できます。
