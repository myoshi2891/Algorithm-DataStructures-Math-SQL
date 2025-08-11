# では Python で **ジャンプ表を1本だけ使った省メモリ版** を作成します。

# ### 実装方針

# * **全レベルのジャンプ表を持たない**
#   K のビットを下から順に見て、必要なときだけ現在のジャンプ表を適用
#   その後ジャンプ表を2倍化する。
# * **メモリ削減**
#   配列は `jump` と `cur` の2本だけを保持（`N+1` 長の整数配列×2）
#   約 4.8MB 以内に収まる（`N=300000` の場合）。

# ---

# ```python
# Python 3.11.4
# 高速入出力 & メモリ削減版

import sys
from typing import List

input_data = sys.stdin.buffer.read().split()
N: int = int(input_data[0])
K: int = int(input_data[1])

def sum_digits(x: int) -> int:
    """桁和を計算する関数"""
    s = 0
    while x > 0:
        s += x % 10
        x //= 10
    return s

def solve(N: int, K: int) -> List[int]:
    """
    ジャンプ表を1本だけにした省メモリ版
    N: 初期整数の最大値
    K: 操作回数
    return: 各整数の最終値（1〜N）
    """
    # 1ステップ先を格納するジャンプ表
    jump = [0] * (N + 1)
    for i in range(1, N + 1):
        jump[i] = i - sum_digits(i)

    # 各iの現在位置
    cur = list(range(N + 1))

    steps = K
    while steps > 0:
        # このビットが立っていれば適用
        if steps & 1:
            for i in range(1, N + 1):
                cur[i] = jump[cur[i]]

        # ジャンプ表を2倍化
        next_jump = [0] * (N + 1)
        for i in range(1, N + 1):
            next_jump[i] = jump[jump[i]]
        jump = next_jump

        steps >>= 1

    return cur[1:]  # 1-index 部分だけ返す

result = solve(N, K)
sys.stdout.write("\n".join(map(str, result)))
# ```

# ---

# ### 特徴

# * **メモリ使用量**

#   * `jump` と `cur` の2配列のみ保持 → 約 `(N+1)*2*8bytes ≈ 4.8MB`
#   * 標準的な二重配列版より **10倍以上削減**
# * **時間計算量**

#   * $O(N \log K)$
#   * N=300,000, K=10^9 でも 1〜2秒程度が想定。

# ---
