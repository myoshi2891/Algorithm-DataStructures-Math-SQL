# 以下は、**Python (CPython 3.11.4)** での「カエルの最小コスト移動経路」問題の実装です。
# **型アノテーション付き**で、**処理時間 O(N)**、**メモリ使用量 O(N)** に抑えた効率的な解法です。

# ---

# ## ✅ Python 実装（標準入力は `sys.stdin`）

# ```python
from typing import List
import sys

def main() -> None:
    input = sys.stdin.read
    data = input().split()

    N: int = int(data[0])
    h: List[int] = list(map(int, data[1:]))

    dp: List[float] = [float('inf')] * N
    prev: List[int] = [-1] * N

    dp[0] = 0

    for i in range(1, N):
        cost1: float = dp[i - 1] + abs(h[i] - h[i - 1])
        if cost1 < dp[i]:
            dp[i] = cost1
            prev[i] = i - 1

        if i > 1:
            cost2: float = dp[i - 2] + abs(h[i] - h[i - 2])
            if cost2 < dp[i]:
                dp[i] = cost2
                prev[i] = i - 2

    # 経路復元
    path: List[int] = []
    current: int = N - 1
    while current != -1:
        path.append(current + 1)  # 1-indexed
        current = prev[current]
    path.reverse()

    print(len(path))
    print(' '.join(map(str, path)))

if __name__ == "__main__":
    main()
# ```

# ---

# ## 💡 実行方法（例）

# ```bash
# python3 main.py < input.txt
# ```

# ---

# ## ⏱️ 処理時間・メモリ消費量

# | 項目       | 内容                              |
# | -------- | ------------------------------- |
# | 時間計算量    | O(N)                            |
# | 空間計算量    | O(N)                            |
# | 入力サイズ最大値 | N = 100000（10⁵）                 |
# | メモリ使用配列  | `dp`, `prev`, `path` 各 `int[N]` |

# → 約数MB以内のメモリ使用（上限 1024MiB 余裕）

# ---

# ## ✅ 入力例

# ```
# 6
# 30 10 60 10 60 50
# ```

# ---

# ## ✅ 出力例

# ```
# 4
# 1 3 5 6
# ```

# ---

# ## 🧠 説明補足（簡略）

# * `dp[i]`：足場 `i+1` に到達する最小コスト
# * `prev[i]`：足場 `i+1` に来る前の足場
# * 経路は `prev` を逆にたどって `.reverse()` で復元

# ---

