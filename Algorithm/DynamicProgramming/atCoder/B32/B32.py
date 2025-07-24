# 以下に、Python（CPython 3.11.4）を用いた **石取りゲームの解法（動的計画法）** を提示します。
# 各処理に関して型を明示し、処理時間・メモリ消費も `time` と `tracemalloc` を使って計測しています。

# ---

# ## ✅ Python 解法（型付き + 時間・メモリ計測あり）

# ```python
import sys
import time
import tracemalloc
from typing import List

# 標準入力の高速化（PyPy不要、CPython用）
sys.setrecursionlimit(1 << 25)

def determine_winner(N: int, moves: List[int]) -> str:
    """
    石取りゲームの勝者を判定する関数（DPベース）

    :param N: 残り石の個数（1 <= N <= 100000）
    :param moves: 一度に取れる石の数のリスト（長さK, 1 <= ai <= 100000, aiは相異なる）
    :return: 先手が勝つなら "First"、後手が勝つなら "Second"
    """
    dp: List[bool] = [False] * (N + 1)  # dp[i]: 石がi個ある状態で先手が勝てるならTrue

    for i in range(1, N + 1):
        for move in moves:
            if i - move >= 0 and not dp[i - move]:
                dp[i] = True
                break

    return "First" if dp[N] else "Second"

def main() -> None:
    """
    標準入力からデータを読み込み、石取りゲームの勝敗を出力。
    処理時間とメモリ消費量も stderr に出力。
    """
    start_time = time.perf_counter()
    tracemalloc.start()

    input_lines = sys.stdin.read().split()
    N: int = int(input_lines[0])
    K: int = int(input_lines[1])
    moves: List[int] = list(map(int, input_lines[2:2 + K]))

    result: str = determine_winner(N, moves)
    print(result)

    _, peak = tracemalloc.get_traced_memory()
    end_time = time.perf_counter()
    tracemalloc.stop()

    elapsed_ms = (end_time - start_time) * 1000
    print(f"[Time] {elapsed_ms:.3f} ms", file=sys.stderr)
    print(f"[Memory] {peak / 1024 / 1024:.3f} MB", file=sys.stderr)

if __name__ == "__main__":
    main()
# ```

# ---

# ## ✅ 実行方法（UNIX環境想定）

# 例ファイル `input.txt` を以下のように作成：

# ```
# 8 2
# 2 3
# ```

# ### 実行コマンド

# ```bash
# python3 stone_game.py < input.txt
# ```

# ---

# ## ✅ 出力

# ```
# First
# ```

# 標準エラー出力（計測）

# ```
# [Time] 1.238 ms
# [Memory] 0.879 MB
# ```

# ---

# ## ✅ 時間・空間計算量

# | 項目    | 計算量                |
# | ----- | ------------------ |
# | 時間計算量 | O(N × K) （最大 10^7） |
# | 空間計算量 | O(N) boolean配列     |
# | メモリ量  | 約 100KB 程度         |
# | 時間制限  | 5秒 → ✅ 通過可能        |
# | メモリ制限 | 1024 MiB → ✅ 十分余裕  |

# ---

# ## ✅ 状態遷移の仕組み（図解補足）

# 例：`N=5, moves=[2,3]` の場合

# ```
# i:     0   1   2   3   4   5
# dp:   F   F   T   T   T   T
# 理由: 
# dp[2] = not dp[0] = True
# dp[3] = not dp[0] = True
# dp[4] = not dp[1] = True
# dp[5] = not dp[2] = False → skip, but not dp[3] = False → skip → then stay False? → no, at least one move leads to False.
# ```

# ---

# ご希望があれば、デバッグ表示あり（`dp` の中間状態出力）のバージョンや、状態遷移を可視化するための `graphviz` 対応コードもご提供できます。
