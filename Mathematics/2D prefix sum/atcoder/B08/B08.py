# 以下に、**Python** を使って、指定された問題に対応した **高速かつメモリ効率の良い実装** を提示します。型アノテーションをすべて明示し、`sys.stdin` による高速読み取りを使用しています。

# ---

# ## ✅ 解法方針（再確認）

# * 点数 `N ≤ 10⁵`、クエリ数 `Q ≤ 10⁵` という大規模入力。
# * 各座標は最大 1500 以下なので、**2次元累積和**を用いると高速かつメモリ効率良く解ける。
# * 各クエリ処理は **O(1)**。

# ---

# ## ✅ Python 実装（型アノテーション付き）

# ```python
import sys
from typing import List

def main() -> None:
    input = sys.stdin.readline
    SIZE: int = 1501

    # N: 点の数
    N: int = int(input())

    # 2次元グリッド（点のカウント）
    grid: List[List[int]] = [[0] * SIZE for _ in range(SIZE)]

    for _ in range(N):
        x, y = map(int, input().split())
        grid[x][y] += 1

    # 2次元累積和の構築
    prefix: List[List[int]] = [[0] * SIZE for _ in range(SIZE)]

    for x in range(1, SIZE):
        for y in range(1, SIZE):
            prefix[x][y] = (
                grid[x][y]
                + prefix[x - 1][y]
                + prefix[x][y - 1]
                - prefix[x - 1][y - 1]
            )

    # Q: クエリ数
    Q: int = int(input())

    results: List[int] = []
    for _ in range(Q):
        a, b, c, d = map(int, input().split())

        count: int = (
            prefix[c][d]
            - prefix[a - 1][d]
            - prefix[c][b - 1]
            + prefix[a - 1][b - 1]
        )
        results.append(count)

    print("\n".join(map(str, results)))


if __name__ == "__main__":
    main()

# ## ✅ 入力例（stdinからの読み取り）

# ```bash
# $ echo "5
# 1 3
# 2 5
# 3 4
# 2 6
# 3 3
# 3
# 1 3 3 6
# 1 5 2 6
# 1 3 3 5" | python3 main.py
# ```

# ```
# 5
# 2
# 4
# ```

# ---

# ## ✅ 計算量とメモリ消費

# ### 実行時間計算量

# | 処理     | 時間計算量             |
# | ------ | ----------------- |
# | 入力読み取り | O(N + Q)          |
# | グリッド構築 | O(N)              |
# | 累積和構築  | O(W×H) = O(1500²) |
# | クエリ処理  | O(Q)              |
# | **合計** | 約300万前後の処理        |

# ※ すべて定数係数内で収まり、**5秒制限は余裕でクリア**します。

# ---

# ### メモリ消費

# | 配列       | サイズ                 | 合計           |
# | -------- | ------------------- | ------------ |
# | `grid`   | 1501 x 1501 × 4 バイト | ≈ 9MB        |
# | `prefix` | 1501 x 1501 × 4 バイト | ≈ 9MB        |
# | その他      | 結果リスト、定数等           | 少量           |
# | **合計**   | ≈ 18MB              | ※ 1024MiB制限内 |

# ---

# ## ✅ 補足（型アノテーションと安全性）

# * `List[List[int]]` でグリッドと累積和を定義し、明示的に2次元配列であることを示しています。
# * `input = sys.stdin.readline` を使って、高速読み取り（通常より数倍高速）を実現。
# * 値の境界条件（`prefix[a-1][d]` など）も問題ありません。全体を `1-based index` で設計しています。

# ---
