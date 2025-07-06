# 以下は、**Python** を用いた解法です。処理時間とメモリ消費量を考慮し、以下の設計を行っています。

# ---

# ## ✅ アルゴリズム概要

# * **前処理**: 配列 `A` を昇順に **ソート** `O(N log N)`
# * **クエリ処理**: 各 `X` に対して `A[i] < X` を満たす個数を **二分探索**で求める `O(Q log N)`
# * **入力**: `sys.stdin.read()` を使って高速に読み取り
# * **出力**: `sys.stdout.write()` で高速出力（`print()` より効率的）

# ---

# ## ✅ Python実装（型付き）

# ```python
import sys
import bisect
from typing import List

def main() -> None:
    input_data: List[str] = sys.stdin.read().split()
    index: int = 0

    # 配列の長さ N
    N: int = int(input_data[index])
    index += 1

    # 配列 A
    A: List[int] = [int(input_data[i]) for i in range(index, index + N)]
    index += N

    # ソート（前処理） O(N log N)
    A.sort()

    # クエリ数 Q
    Q: int = int(input_data[index])
    index += 1

    # 各クエリ Xi に対して A 中の「Xi 未満の個数」を求める O(Q log N)
    results: List[int] = []
    for i in range(Q):
        X: int = int(input_data[index + i])
        count: int = bisect.bisect_left(A, X)  # A[i] < X の個数
        results.append(count)

    # 出力（高速） O(Q)
    sys.stdout.write('\n'.join(map(str, results)) + '\n')

if __name__ == "__main__":
    main()
# ```

# ---

# ## ✅ 処理時間・メモリの見積もり

# ### 時間計算量

# | 処理内容      | 時間計算量                         |
# | --------- | ----------------------------- |
# | 入力の読み込み   | O(N + Q)                      |
# | 配列 A のソート | O(N log N)                    |
# | 各クエリの処理   | O(Q log N)                    |
# | 合計        | O(N log N + Q log N)（≒ 2×10⁶） |

# ✔️ 最大 `N = Q = 10^5` のときでも **余裕で 1秒以内**

# ---

# ### メモリ使用量（目安）

# | 要素      | サイズ（概算）                   |
# | ------- | ------------------------- |
# | 配列 `A`  | 約 `100,000 × 4B` = 400 KB |
# | クエリ `Q` | 約 `100,000 × 4B` = 400 KB |
# | その他     | 数MB以下                     |

# ✔️ 全体で **数MB** 程度 → 1024 MiB 制限に **余裕で収まる**

# ---

# ## ✅ 入力例の確認

# ### 入力

# ```
# 5
# 1 3 3 3 1
# 2
# 4
# 3
# ```

# ### 出力

# ```
# 5
# 2
# ```

# ---

# ご希望あれば、`matplotlib` を使って探索の過程を図解することも可能です。必要であればお知らせください。
