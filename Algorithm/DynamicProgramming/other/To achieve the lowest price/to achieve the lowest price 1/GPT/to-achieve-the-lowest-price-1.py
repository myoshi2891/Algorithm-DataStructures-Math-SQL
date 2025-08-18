# では **Python 3.8.10** で、先ほどの「りんご問題」を **DP（O(1)メモリ最適化版）** で実装します。
# 各処理のコメントに **パラメータ・返却値の型** を明示し、処理時間・メモリの消費量も解説します。

# ---

# ```python
import sys

def min_apple_cost(n: int, a: int, b: int) -> int:
    """
    必要なりんごの個数 n 個を買うための最小金額を計算する (DPを使用)
    n 個以上になってもよい。

    Parameters
    ----------
    n : int
        必要なりんごの個数 (1 <= n <= 1000)
    a : int
        りんご1個の価格 (1 <= a < b <= 10000)
    b : int
        りんご2個の価格 (1 <= b <= 10000)

    Returns
    -------
    int
        n個のりんごを手に入れるための最小金額
    """

    # --- 初期条件 ---
    if n == 0:
        return 0
    if n == 1:
        return a

    # dp[0], dp[1] に相当
    prev2: int = 0     # dp[0]
    prev1: int = a     # dp[1]

    # --- 漸化式によるDP計算 ---
    # dp[i] = min(dp[i-1] + a, dp[i-2] + b)
    for _ in range(2, n + 1):
        next_val: int = min(prev1 + a, prev2 + b)
        prev2, prev1 = prev1, next_val

    return prev1


if __name__ == "__main__":
    # 標準入力から n, a, b を取得
    data = sys.stdin.read().strip().split()
    n, a, b = map(int, data)

    # 結果を出力
    print(min_apple_cost(n, a, b))
# ```

# ---

# ## 処理時間・メモリの消費量

# * **時間計算量**:
#   `for` ループは `i=2..n` の計 **O(n)**、最大で `n=1000`。
#   → Python 3.8.10 で十分に 1ms 以下で完了。

# * **メモリ計算量**:

#   * 配列を使わず、`prev2, prev1, next_val` の **3変数のみ**。
#   * メモリは整数オブジェクト3つ分 ≒ 数十バイト程度。
#   * **O(1)** で極めて小さい。

# ---

# ✅ このコードは **LeetCode風の環境** や **競技プログラミング環境**（標準入力からデータ取得 → 出力）でそのまま使用できます。

