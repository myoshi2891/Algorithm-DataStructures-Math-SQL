# 以下は、要求に沿った「多角的な問題分析 → アルゴリズム選定 → HackerRank 形式の実装（CPython 3.13.3想定・型安全）」です。

# ---

# # 問題分析（要約）

# * **目的**: 与えられた (N) に対し、数字 9 と 0 だけからなる正の整数 (X) のうち、最小（数値的に最小）で (N) の倍数となるものを求める。
# * **制約**: (1 \le N \le 500), テスト数 (T \le 10^4)
# * **観察**:

#   * 9,0 のみで構成 → 先頭は 0 になれない → ルートは “9”。
#   * 「最小の数」を求めるには「桁数最小」を優先し、同じ桁数内では数値が小さいもの（'0' を優先）を選ぶ。
#   * 巨大な数そのものを作る必要はなく、**剰余（mod N）だけを BFS** で辿ればよい（典型テク）。

# ---

# # アプローチ比較

# | アプローチ       | 概要                            |    時間計算量 |    空間計算量 | Python実装コスト | 可読性 | CPython 観点    | 備考    |
# | ----------- | ----------------------------- | -------: | -------: | ----------- | --- | ------------- | ----- |
# | BFS（剰余グラフ）  | 節=剰余0..N-1、辺=末尾に '0'/'9' を付ける | **O(N)** | **O(N)** | 低           | 高   | `deque`+配列で速い | 定番・最適 |
# | 文字列列挙＋逐次mod | “9”, “90”, “99”, … を生成し mod   |      爆発的 |      爆発的 | 低           | 低   | 遅い            | 不適    |
# | DP/数論の特殊解探索 | 各 N の構造に依存                    |     まちまち |     まちまち | 高           | 低   | ケース分岐多        | 不要    |

# **採用**: BFS（剰余グラフ）。最小桁数が保証され、同一長での最小性は遷移順 `'0' → '9'` で担保。

# ---

# # Python特有の最適化

# * **巨大整数を生成しない**：常に `remainder = (remainder*10 + d) % n` で遷移。
# * **親ポインタ復元**：`parent[rem]` と `digit[rem]`（到達に使った '0'/'9'）で終端から復元 → 文字列連結は最後に1回。
# * **`deque`/`list` 利用**：`visited`/`parent`/`digit` は固定長 `list`（`N<=500` で軽量）。
# * **多テスト最適化**：同一 `N` の再計算を避けるため **メモ化（辞書キャッシュ）**。

# ---

# # 検証メモ（思考実験）

# * (N=1) → “9”
# * (N=5) → BFS 初手 “9” から “90” を先に探索（'0'優先）→ “90”
# * (N=7) → “9009”（サンプル一致）

# ---

# # HackerRankでの回答フォーマット（関数実装のみ）

# ```python
#!/bin/python3

# import math
import os

# import random
# import re
# import sys
from collections import deque
from typing import Dict, List

#
# Complete the 'solve' function below.
#
# The function is expected to return a STRING.
# The function accepts INTEGER n as parameter.
#

# Cache for repeated N across test cases
_MEMO: Dict[int, str] = {}


def _smallest_multiple_of_zeros_and_nines(n: int) -> str:
    """
    Find the least positive integer composed only of digits {0, 9}
    that is a multiple of n. Uses BFS on remainders modulo n.

    Time:  O(n)
    Space: O(n)
    """
    if n == 1:
        return "9"

    # parent[r]: previous remainder that led to r
    parent: List[int] = [-1] * n
    # digit[r]: which digit ('0' or '9') was appended to reach remainder r
    digit: List[str] = [""] * n
    visited: List[bool] = [False] * n

    # Start from "9"
    start_rem = 9 % n
    visited[start_rem] = True
    parent[start_rem] = -1
    digit[start_rem] = "9"

    if start_rem == 0:
        return "9"

    q: deque[int] = deque([start_rem])

    # Explore '0' first, then '9' to ensure minimal numeric value within same length
    while q:
        r = q.popleft()

        # Append '0'
        nr0 = (r * 10) % n
        if not visited[nr0]:
            visited[nr0] = True
            parent[nr0] = r
            digit[nr0] = "0"
            if nr0 == 0:
                break
            q.append(nr0)

        # Append '9'
        nr9 = (r * 10 + 9) % n
        if not visited[nr9]:
            visited[nr9] = True
            parent[nr9] = r
            digit[nr9] = "9"
            if nr9 == 0:
                break
            q.append(nr9)

    # Reconstruct from remainder 0
    path: List[str] = []
    cur = 0
    while cur != -1:
        path.append(digit[cur])
        cur = parent[cur]
    # path contains digits from last to first; reverse
    return "".join(reversed(path)).lstrip(
        "0"
    )  # lstrip is safe; construction avoids leading zero


def solve(n: int) -> str:
    # Performance-first path: reuse cached answers
    res = _MEMO.get(n)
    if res is not None:
        return res
    ans = _smallest_multiple_of_zeros_and_nines(n)
    _MEMO[n] = ans
    return ans


if __name__ == "__main__":
    fptr = open(os.environ["OUTPUT_PATH"], "w")

    t = int(input().strip())

    for t_itr in range(t):
        n = int(input().strip())

        result = solve(n)

        fptr.write(result + "\n")

    fptr.close()
# ```

# ---

# ## 付記（実務視点の補足）

# * **可読性**: BFS 本体は `_smallest_multiple_of_zeros_and_nines` に分離し、`solve` はキャッシュ制御に専念。
# * **例外処理**: HackerRank 環境では I/O/型検証を省くのが通例。業務実装では引数検証を追加してください。
# * **計算量**: 各 (N) あたり **O(N)**。(N\le 500) で超軽量、かつメモ化で多テストに強い。
