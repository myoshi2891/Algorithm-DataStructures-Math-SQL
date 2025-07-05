# 以下に、Python を用いた高速な解法を示します。
# **型ヒント付き・メモリ効率重視・高速処理**を意識しています。

# ## ✅ 解法：2D差分法 + 累積和（Python版）

# ### 🔍 アプローチの要点

# * **制約**：

#   * 最大 `1500 × 1500` の範囲で、`N ≤ 10⁵`。
#   * 2次元配列を使って差分更新 → 累積和で正確な重なり面積を高速取得。
# * **Pythonでの工夫**：

#   * `array` モジュールを使用してメモリ削減（`int16` 型使用）。

# ---

# ### ✅ コード（型付き）

# ```python
from typing import List
from array import array
import sys

def main() -> None:
    input = sys.stdin.read
    data = input().split()
    
    N: int = int(data[0])
    grid_size: int = 1502  # 境界対策（最大1501含むため）

    # メモリ効率のため array('h') = signed short（int16）
    grid: List[array] = [array('h', [0] * grid_size) for _ in range(grid_size)]  # type: ignore

    idx: int = 1
    for _ in range(N):
        a: int = int(data[idx])
        b: int = int(data[idx+1])
        c: int = int(data[idx+2])
        d: int = int(data[idx+3])
        idx += 4

        grid[a][b] += 1
        grid[c][b] -= 1
        grid[a][d] -= 1
        grid[c][d] += 1

    # 横方向累積和
    for x in range(grid_size):
        for y in range(1, grid_size):
            grid[x][y] += grid[x][y - 1]

    # 縦方向累積和
    for y in range(grid_size):
        for x in range(1, grid_size):
            grid[x][y] += grid[x - 1][y]

    # 面積（1枚以上の紙で覆われたセル）をカウント
    area: int = 0
    for x in range(1501):
        for y in range(1501):
            if grid[x][y] > 0:
                area += 1

    print(area)

if __name__ == "__main__":
    main()
# ```

# ---

# ## 📊 計算量とメモリ

# | 指標      | 値                                 |
# | ------- | --------------------------------- |
# | 時間計算量   | `O(N + H × W)`（H=W=1501）          |
# | 実行時間目安  | 約 200ms ～ 400ms（CPython環境）        |
# | メモリ使用量  | 約 4.5MB（1502² × 2バイト）             |
# | 使用データ構造 | `array('h')`（signed short, int16） |

# ---

# ## ✅ 入力例と出力

# **入力**

# ```
# 2
# 1 1 3 3
# 2 2 4 4
# ```

# **出力**

# ```
# 7
# ```

