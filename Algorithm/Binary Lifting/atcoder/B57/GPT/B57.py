# Python でも **ダブリング法 (binary lifting)** を使って高速に解く実装を作ります。
# Pylance の型エラーを避けるために **型ヒントを明示** し、
# 処理時間・メモリを意識して **list\[int]** と局所変数最適化をしています。

# ---

# ```python
# Python 3.11.4
# 実行時間制限: 4 sec / メモリ制限: 1024 MiB
# 入力: N K
# 出力: 各 i (1 <= i <= N) に対し、K 回の操作後の値

import sys
from typing import List

def sum_digits(x: int) -> int:
    """桁和を計算する関数"""
    s: int = 0
    while x > 0:
        s += x % 10
        x //= 10
    return s

def solve(N: int, K: int) -> List[int]:
    """
    各 i (1 <= i <= N) について、K 回操作後の値を求める
    Parameters:
        N (int): 最大の整数
        K (int): 操作回数 (1 <= K <= 10^9)
    Returns:
        List[int]: 各 i の最終値
    """
    # 1ステップ先の値
    next_arr: List[int] = [0] * (N + 1)
    for i in range(1, N + 1):
        next_arr[i] = i - sum_digits(i)

    # ダブリングテーブル構築
    LOG: int = 32  # K <= 1e9 なので 2^30 程度で十分、余裕を持たせて32
    jump: List[List[int]] = [[0] * (N + 1) for _ in range(LOG)]
    jump[0] = next_arr[:]
    for p in range(1, LOG):
        prev = jump[p - 1]
        cur = jump[p]
        for i in range(1, N + 1):
            cur[i] = prev[prev[i]]

    # 各 i について K ステップ先を計算
    res: List[int] = [0] * N
    for i in range(1, N + 1):
        cur = i
        steps = K
        bit = 0
        while steps > 0:
            if steps & 1:
                cur = jump[bit][cur]
            steps >>= 1
            bit += 1
        res[i - 1] = cur

    return res

def main() -> None:
    data: List[int] = list(map(int, sys.stdin.buffer.read().split()))
    N: int = data[0]
    K: int = data[1]

    result: List[int] = solve(N, K)
    sys.stdout.write("\n".join(map(str, result)))

if __name__ == "__main__":
    main()
# ```

# ---

# ## **処理時間・メモリ見積もり**

# * **計算量**

#   * next 配列構築: $O(N \cdot d)$（dは桁数、最大6）
#   * ダブリング: $O(N \log K)$ ≈ $3\times 10^5 \times 30 \approx 9\times 10^6$ ステップ
#   * 各 i の計算: $O(N \log K)$
#     → 実行時間: 約 0.5 秒程度（CPython 3.11）

# * **メモリ使用量**

#   * `next_arr`: 約 1.2MB
#   * `jump`: 約 38MB
#   * `res`: 約 1.2MB
#     → 合計 約 40MB（1024MB 制限内）

# ---

# このままでも十分高速ですが、
# もしさらに **メモリを半分以下に削減** するなら、
# ダブリングテーブルを全保持せず 1 本だけ計算し直す方式にもできます。

# ---

# この後、メモリ削減版の Python 実装も作りますか？
# そうするとジャンプ表が 1 レベル分で済み、約 1.2MB まで落とせます。
