# 以下は、**Python (CPython 3.11.4)** を用いて、**巡回セールスマン問題 (TSP)** をビットDPで解く実装です。
# 型アノテーション付きで、**処理時間・メモリ使用量を抑えつつ正確に解答**できるように設計しています。

# ---

# ## ✅ Python 解法（ビットDP）

# ```python
import sys
import math
from typing import List, Tuple, Sequence

# 入力高速化
sys.setrecursionlimit(1 << 25)

from typing import Sequence

def read_input() -> Tuple[int, List[Tuple[int, int]]]:
    """標準入力を読み取り、都市数と座標リストを返す"""
    input_lines = sys.stdin.read().splitlines()
    N = int(input_lines[0])
    coords: List[Tuple[int, int]] = [
        (int(x), int(y)) for line in input_lines[1:] for x, y in [line.split()]
    ]
    return N, coords

def compute_distances(coords: List[Tuple[int, int]]) -> List[List[float]]:
    """各都市間のユークリッド距離を事前計算する"""
    N = len(coords)
    dist = [[0.0] * N for _ in range(N)]
    for i in range(N):
        for j in range(N):
            dx = coords[i][0] - coords[j][0]
            dy = coords[i][1] - coords[j][1]
            dist[i][j] = math.hypot(dx, dy)
    return dist

def tsp(N: int, coords: List[Tuple[int, int]]) -> float:
    """
    巡回セールスマン問題をビットDPで解く
    Parameters:
        N (int): 都市の数 (2 <= N <= 15)
        coords (List[Tuple[int, int]]): 都市の座標 [(x1, y1), ..., (xN, yN)]
    Returns:
        float: 最短経路の長さ（誤差1e-3未満で正確）
    """
    dist = compute_distances(coords)
    INF = float('inf')
    
    # dp[s][u] := 訪問済み集合s、現在地u の最短距離
    dp: List[List[float]] = [[INF] * N for _ in range(1 << N)]
    dp[1][0] = 0.0  # 開始点は都市0のみ訪問

    for s in range(1 << N):
        for u in range(N):
            if not (s & (1 << u)):
                continue
            for v in range(N):
                if s & (1 << v):
                    continue
                ns = s | (1 << v)
                dp[ns][v] = min(dp[ns][v], dp[s][u] + dist[u][v])

    # 最後に出発点0に戻る
    final_cost = INF
    for u in range(1, N):
        final_cost = min(final_cost, dp[(1 << N) - 1][u] + dist[u][0])

    return final_cost

def main() -> None:
    N, coords = read_input()
    coords_list: Sequence[Tuple[int, int]] = coords
    result = tsp(N, list(coords_list))
    # 小数点以下12桁まで出力（誤差対策）
    print(f"{result:.12f}")

if __name__ == "__main__":
    main()
# ```

# ---

# ## 📊 処理時間・メモリの見積もり

# | 指標     | 値                                 |
# | ------ | --------------------------------- |
# | 時間計算量  | `O(N^2 * 2^N)`（N=15で \~5×10⁵ 以内）  |
# | メモリ使用量 | 約 `N * 2^N * 8 Byte` ≒ 最大 4 MiB   |
# | 精度     | `math.hypot()` + `print("%.12f")` |

# ---

# ## ✅ 使用方法

# 入力ファイルを用意して、以下のように実行してください。

# ### 実行例：

# ```bash
# python3 main.py < input.txt
# ```

# ### 入力例：

# ```
# 4
# 0 0
# 0 1
# 1 0
# 1 1
# ```

# ### 出力：

# ```
# 4.000000000000
# ```

# ---

# ## 🔎 補足

# * `math.hypot(dx, dy)` は `√(dx² + dy²)` を安全かつ高精度に計算します。
# * 標準的なビットDPで、**都市数15まで対応**可能です。
# * 精度（誤差 1e-3 未満）を担保するために `.12f` 形式で出力しています。

# ---

# 必要であれば、**経路の復元機能** や **部分メモ化** による高速化の提案も可能です。お気軽にどうぞ！

# ご指摘の Type Checker（たとえば `mypy` や Pyright）による型エラーは、`tuple[int, ...]` が不定長タプルであり、`Tuple[int, int]` のような固定長タプルのシーケンスに代入できない、という理由によるものです。

# ---

# ## ✅ 原因の詳細

# エラーメッセージの主な内容は以下の通りです：

# ```
# "tuple[int, ...]" は "Tuple[int, int]" に割り当てできません
# Tuple のサイズが一致しません。2 が必要ですが、受け取りは不確定です
# ```

# これは、以下の行のリスト内包表現の `tuple(...)` の推論が `tuple[int, ...]`（任意長）になってしまうため：

# ```python
# coords = [tuple(map(int, line.split())) for line in input_lines[1:]]
# ```

# ---

# ## ✅ 修正方法

# 「行を空白で分割 → 2要素のタプルにする」という意図を明示するため、まず `split()` → `int` の変換 → 明示的な 2 要素タプルにすれば OK です。

# ### 🔧 修正後のコード

# ```python
# def read_input() -> Tuple[int, List[Tuple[int, int]]]:
#     """標準入力を読み取り、都市数と座標リストを返す"""
#     input_lines = sys.stdin.read().splitlines()
#     N = int(input_lines[0])
#     coords: List[Tuple[int, int]] = [
#         (int(x), int(y)) for line in input_lines[1:] for x, y in [line.split()]
#     ]
#     return N, coords
# ```

# ### ✅ 補足（より明示的な形でも OK）

# ```python
# def read_input() -> Tuple[int, List[Tuple[int, int]]]:
#     input_lines = sys.stdin.read().splitlines()
#     N = int(input_lines[0])
#     coords: List[Tuple[int, int]] = []
#     for line in input_lines[1:]:
#         x_str, y_str = line.split()
#         x, y = int(x_str), int(y_str)
#         coords.append((x, y))
#     return N, coords
# ```

# ---

# ## ✅ 結論

# * `tuple(map(...))` を使うと Python 側では `tuple[int, ...]` として推論され、mypy や Pyright では `Tuple[int, int]` と互換がないと判断されます。
# * 型を通すには、**固定長の `(int, int)`** を明示的に構築してください。

# ---

# もし PEP 646 対応の型チェッカーを使っていた場合でも、実用上はこの修正で十分安全です。必要であればさらにリファクタも可能です。
