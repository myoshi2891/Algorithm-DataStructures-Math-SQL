# # 問題分析（超要約）

# * 各電球は ON/OFF の2状態 → 全パターン数は (2^N)。
# * ただし「全消灯（全部OFF）」は除外 → 求める数は (2^N - 1)。
# * すべてのケースで **mod (10^5)**（= 100000）を取る。
# * 複数テストケース (T \le 1000)、(N < 10^4) → Python なら `pow(2, n, 100000)` で高速・省メモリ。

# # アルゴリズム

# * 各テストケースについて `ans = (pow(2, n, 100000) - 1) % 100000` を出力。

#   * `pow(base, exp, mod)` は繰り返し二乗法で (O(\log N))。
#   * マイナス対策に `% 100000` を最後にもう一度。

# # 計算量

# * 時間: 各ケース (O(\log N))（実質超高速）
# * 空間: (O(1))

# ---

# ```python
#!/bin/python3

import os
import sys

#
# Complete the 'lights' function below.
#
# The function is expected to return a LONG_INTEGER.
# The function accepts INTEGER n as parameter.
#

MOD = 100000


def lights(n: int) -> int:
    # (2^n - 1) mod 100000
    return (pow(2, n, MOD) - 1) % MOD


if __name__ == "__main__":
    fptr = open(os.environ["OUTPUT_PATH"], "w")

    t = int(sys.stdin.readline().strip())
    for _ in range(t):
        n = int(sys.stdin.readline().strip())
        result = lights(n)
        fptr.write(str(result) + "\n")

    fptr.close()
# ```
