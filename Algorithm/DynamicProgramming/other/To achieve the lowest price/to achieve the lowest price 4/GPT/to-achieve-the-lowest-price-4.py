# これは典型的な **ナップサック型の最小コスト問題** です。
# 制約が小さいので、DP（動的計画法）を使って解きます。

# ---

# ## アルゴリズム概要

# * `dp[i]`: ちょうど i 個のりんごを買うのに必要な最小金額
# * 初期値: `dp[0] = 0`, その他は `∞`
# * 各 i から、`x, y, z` 個のまとめ買いを試し、`dp[i + x] = min(dp[i + x], dp[i] + a)` のように更新
# * 最終的には `n 以上` のりんごを買う最小金額を取る

# 最大で `n + max(x,y,z)` まで計算すれば十分。

# ---

# ## 計算量とメモリ

# * **時間計算量**: `O(n * 3)` → 高々 3000 ステップ (n ≤ 1000)
# * **メモリ使用量**: `O(n + max(x,y,z))` → 高々 2001 程度、int 配列 (数KB)

# ---

# ## 実装（Python 3.8.10）

# ```python
from typing import List
import sys

def min_cost(n: int, x: int, a: int, y: int, b: int, z: int, c: int) -> int:
    """
    n: 必要なりんごの個数
    x: x個入りの価格 a
    y: y個入りの価格 b
    z: z個入りの価格 c
    戻り値: n個以上のりんごを買うのに必要な最小金額
    """
    INF: int = 10**18
    max_apples: int = n + max(x, y, z)  # n個以上をカバー
    dp: List[int] = [INF] * (max_apples + 1)
    dp[0] = 0

    # 各状態から遷移
    for i in range(max_apples + 1):
        if dp[i] == INF:
            continue
        if i + x <= max_apples:
            dp[i + x] = min(dp[i + x], dp[i] + a)
        if i + y <= max_apples:
            dp[i + y] = min(dp[i + y], dp[i] + b)
        if i + z <= max_apples:
            dp[i + z] = min(dp[i + z], dp[i] + c)

    # n個以上の最小コストを探す
    return min(dp[n:])

if __name__ == "__main__":
    # 標準入力
    data = sys.stdin.read().strip().split()
    n, x, a, y, b, z, c = map(int, data)
    result = min_cost(n, x, a, y, b, z, c)
    print(result)
# ```

# ---

# ### 入力例1

# ```
# 9 2 100 3 125 5 200
# ```

# ### 出力例1

# ```
# 375
# ```

# ---

# ✅ この方法は `n=1000` の上限でも高速に動作し、メモリも軽量です。

# ---

