# # 1. 問題分析

# ### ルール整理

# * Bob のジャンプ距離は 1, 2, 3, … と増加。
# * k 回ジャンプすると到達位置は
#   **S(k) = 1 + 2 + 3 + … + k = k(k+1)/2**
# * したがって、目標ブロック n が **三角数**（triangular number）に一致すれば到達可能。
#   そのときのジャンプ回数は k。
# * そうでなければ到達不可。

# ### 判定方法

# * 与えられた n に対して、
#   k(k+1)/2 = n を満たす整数 k が存在するか確認。
# * これは二次方程式 k² + k - 2n = 0 を解けば良い。

#   * 解の候補 k = (-1 + √(1+8n)) / 2
#   * これが整数なら到達可能。

# ---

# # 2. アルゴリズム特性

# * **時間計算量**: 各テストケースで平方根計算 → O(1)
# * **空間計算量**: O(1)
# * **Python最適化**: `math.isqrt` を使うと整数計算で安全に判定可能。

# ---

# # 3. 実装（HackerRankフォーマット）

# HackerRankでは **関数定義 + main部での I/O** が基本形式です。

# ## (A) 業務用（堅牢版）

# ```python
# import math
# from typing import List

# def steppingStones(blocks: List[int]) -> List[str]:
#     """
#     業務開発向け: 型安全・エラーハンドリング重視
#     Args:
#         blocks: 各ゲームでの目標ブロック番号のリスト
#     Returns:
#         各ケースに対する結果文字列リスト
#     """
#     if not isinstance(blocks, list):
#         raise TypeError("Input must be a list of integers")
#     if not all(isinstance(b, int) and b > 0 for b in blocks):
#         raise ValueError("All blocks must be positive integers")

#     results: List[str] = []
#     for n in blocks:
#         # 判定: n が三角数かどうか
#         d = 1 + 8 * n
#         root = int(math.isqrt(d))
#         if root * root == d:
#             k = (-1 + root) // 2
#             if k * (k + 1) // 2 == n:
#                 results.append(f"Go On Bob {k}")
#                 continue
#         results.append("Better Luck Next Time")
#     return results


# def main():
#     t = int(input().strip())
#     blocks = [int(input().strip()) for _ in range(t)]
#     for ans in steppingStones(blocks):
#         print(ans)


# if __name__ == "__main__":
#     main()
# ```

# ---

# ## (B) 競技用（高速版）

# ```python
# import math


# def main():
#     t = int(input().strip())
#     for _ in range(t):
#         n = int(input().strip())
#         d = 1 + 8 * n
#         root = int(math.isqrt(d))
#         if root * root == d:
#             k = (-1 + root) // 2
#             if k * (k + 1) // 2 == n:
#                 print(f"Go On Bob {k}")
#                 continue
#         print("Better Luck Next Time")


# if __name__ == "__main__":
#     main()
# ```

# ---

# # 4. 検証

# ### サンプル入力 1

# ```
# 1
# 2
# ```

# 出力:

# ```
# Better Luck Next Time
# ```

# ### サンプル入力 2

# ```
# 1
# 3
# ```

# 出力:

# ```
# Go On Bob 2
# ```

# 両方一致 ✅

# ---

# 👉 以上で **HackerRankフォーマットの完全版** を示しました。


# ```python
#!/bin/python3

import math
import os
import random
import re
import sys

#
# Complete the 'solve' function below.
#
# The function is expected to return a STRING.
# The function accepts LONG_INTEGER n as parameter.
#


def solve(n: int) -> str:
    # 判定: n が三角数 (k*(k+1)//2) かどうか
    d = 1 + 8 * n
    root = int(math.isqrt(d))
    if root * root == d:
        k = (-1 + root) // 2
        if k * (k + 1) // 2 == n:
            return f"Go On Bob {k}"
    return "Better Luck Next Time"


if __name__ == "__main__":
    fptr = open(os.environ["OUTPUT_PATH"], "w")

    t = int(input().strip())

    for t_itr in range(t):
        n = int(input().strip())

        result = solve(n)

        fptr.write(result + "\n")

    fptr.close()
# ```

# ### ✔ ポイント

# * `solve` は **STRING を返却**する形に統一。
# * `math.isqrt` を用いて平方根判定を整数演算で安全に実施。
# * HackerRank の **標準テンプレート**に忠実に合わせています。
