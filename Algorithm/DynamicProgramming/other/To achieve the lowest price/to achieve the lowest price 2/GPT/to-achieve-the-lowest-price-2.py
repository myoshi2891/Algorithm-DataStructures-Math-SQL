# Python 3.8.10 版で、**関数化**して **型ヒント明示**、**時間計算量・メモリ使用量**にも触れた実装を提示します。

# ---

# ## アルゴリズム概要（再掲）

# * `dp[i] = i 個ちょうどの最小金額（不可能なら INF）`
# * 遷移：

#   * `dp[i+2] = min(dp[i+2], dp[i] + a)`
#   * `dp[i+5] = min(dp[i+5], dp[i] + b)`
# * 最後に `min(dp[n], dp[n+1], ..., dp[n+5])` が答え
#   （「n 個以上でもよい」条件を満たすため）

# ---

# ## 実装（Python 3.8.10）

# ```python
import sys
from typing import List

def min_apple_cost(n: int, a: int, b: int) -> int:
    """
    りんごを n 個以上手に入れるための最小金額を計算する関数
    
    Parameters
    ----------
    n : int
        必要なりんごの個数 (1 <= n <= 1000)
    a : int
        2個束の価格 (1 <= a < b <= 10000)
    b : int
        5個束の価格
    
    Returns
    -------
    int
        n 個以上のりんごを買うときの最小金額
    """

    INF: int = 10**18
    max_n: int = n + 5  # n個以上の購入を考慮して余裕分を確保
    dp: List[int] = [INF] * (max_n + 1)
    dp[0] = 0

    # 前向きDP (ちょうどi個に到達できた場合、i+2, i+5 に遷移)
    for i in range(max_n + 1):
        if dp[i] == INF:
            continue
        if i + 2 <= max_n:
            dp[i + 2] = min(dp[i + 2], dp[i] + a)
        if i + 5 <= max_n:
            dp[i + 5] = min(dp[i + 5], dp[i] + b)

    # n..n+5 の中で最小値を取る（= n個以上）
    return min(dp[n: n + 6])


if __name__ == "__main__":
    data = sys.stdin.read().strip().split()
    n, a, b = map(int, data)
    result = min_apple_cost(n, a, b)
    print(result)
# ```

# ---

# ## 処理時間・メモリ分析

# * **時間計算量:**
#   `O(n)` （最大で `n=1000` → 2000 回程度の更新なので高速）
# * **メモリ消費:**
#   `O(n)` （`dp` 配列は `n+6` 要素、最大 1006 要素 → int 型で数 KB 程度）

# ---

# ## 入出力例（参考）

# 入力:

# ```
# 4 110 200
# ```

# 出力:

# ```
# 200
# ```
