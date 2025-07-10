# 以下は、**Python (CPython 3.11.4)** を用いた「カエルの最小ジャンプコスト」問題の解法です。
# **処理時間・メモリ使用量を最適化**するため、**動的計画法（DP）+ メモリ O(1) に削減**した実装を提供します。

# ---

# ## ✅ Python 実装（型付き・高速・省メモリ）

# ```python
import sys

def main() -> None:
    input: str = sys.stdin.read()
    lines: list[str] = input.strip().split('\n')
    
    N: int = int(lines[0])
    h: list[int] = list(map(int, lines[1].split()))

    if N == 2:
        print(abs(h[1] - h[0]))
        return

    prev2: int = 0  # dp[0]
    prev1: int = abs(h[1] - h[0])  # dp[1]

    for i in range(2, N):
        cost1: int = prev1 + abs(h[i] - h[i - 1])
        cost2: int = prev2 + abs(h[i] - h[i - 2])
        curr: int = min(cost1, cost2)
        prev2, prev1 = prev1, curr

    print(prev1)

if __name__ == "__main__":
    main()

# ## ✅ 入出力形式

# 標準入力から以下のように与えられます：

# ```
# N
# h1 h2 h3 ... hN
# ```

# ---

# ## ✅ 実行例

# 入力:

# ```
# 6
# 30 10 60 10 60 50
# ```

# 出力:

# ```
# 40
# ```

# ---

# ## ✅ 計算量とメモリ使用量

# | 項目    | 内容                             |
# | ----- | ------------------------------ |
# | 時間計算量 | `O(N)`（1ループ）                   |
# | 空間計算量 | `O(1)`（直前2個のみ）                 |
# | 入力制約  | `2 ≤ N ≤ 10^5`、`1 ≤ hᵢ ≤ 10^4` |

# ---

# ## ✅ 補足：DP配列を使ったフル版（メモリ O(N)）

# 必要であれば以下のようにも書けます：

# ```python
# dp: list[int] = [0] * N
# dp[1] = abs(h[1] - h[0])
# for i in range(2, N):
#     dp[i] = min(dp[i-1] + abs(h[i] - h[i-1]), dp[i-2] + abs(h[i] - h[i-2]))
# print(dp[N-1])
# ```
