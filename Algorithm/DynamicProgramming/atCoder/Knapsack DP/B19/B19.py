# 以下は、**Python (CPython 3.11.4)** を使用して、**Knapsack 2（価値軸DP）** を解く実装です。関数を分割し、**型アノテーション付き**で、**処理時間・メモリの効率にも配慮**しています。

# ---

# ## ✅ 構成と特徴

# | 関数名                | 役割          | 返却値                                      |
# | ------------------ | ----------- | ---------------------------------------- |
# | `parse_input()`    | 入力パース処理     | `tuple[int, int, list[tuple[int, int]]]` |
# | `solve_knapsack()` | DPによる最大価値計算 | `int`（価値の最大値）                            |
# | `main()`           | 入出力処理       | `None`（標準出力）                             |

# ---

# ## ✅ Python 実装（関数分割 + コメント付き）

# ```python
import sys
from typing import List, Tuple

def parse_input() -> Tuple[int, int, List[Tuple[int, int]]]:
    """
    入力をパースして返す関数

    Returns:
        N (int): 品物数
        W (int): ナップサックの容量
        items (List[Tuple[int, int]]): 各品物の (重さ, 価値) のリスト
    """
    lines = sys.stdin.read().strip().split('\n')
    N, W = map(int, lines[0].split())
    items: List[Tuple[int, int]] = [
        (int(w), int(v)) for w, v in (line.split() for line in lines[1:])
    ]
    return N, W, items

def solve_knapsack(N: int, W: int, items: List[Tuple[int, int]]) -> int:
    """
    ナップザック問題を価値軸DPで解く

    Args:
        N (int): 品物数
        W (int): ナップサック容量
        items (List[Tuple[int, int]]): 各品物の (重さ, 価値)

    Returns:
        int: 容量 W 以下で達成可能な最大の価値
    """
    max_value = sum(v for _, v in items)
    INF = float('inf')
    dp: List[float] = [INF] * (max_value + 1)
    dp[0] = 0  # 価値0に必要な重さは0

    for w, v in items:
        for val in range(max_value, v - 1, -1):
            if dp[val - v] + w <= W:
                dp[val] = min(dp[val], dp[val - v] + w)

    # dp[v] <= W を満たす最大の v を返す
    for val in range(max_value, -1, -1):
        if dp[val] <= W:
            return val
    return 0


def main() -> None:
    """
    メイン関数：標準入力から読み取り、最大価値を出力

    Returns:
        None
    """
    N, W, items = parse_input()
    result = solve_knapsack(N, W, items)
    print(result)


if __name__ == "__main__":
    main()
# ```

# ---

# ## ✅ 実行例

# ```bash
# python3 main.py < input.txt
# ```

# ---

# ## ✅ 計算量・メモリ見積もり

# | 指標     | 内容                                     |
# | ------ | -------------------------------------- |
# | 時間計算量  | O(N × max\_value) = 100 × 100000 ≒ 1e7 |
# | メモリ使用量 | dp\[100001] × 8バイト ≒ 約 800 KB          |
# | 実行時間制限 | 10 秒以内（通常 0.1～0.5秒で終了）                 |
# | メモリ制限  | 1024 MiB（このコードは余裕あり）                   |

# ---

# ## ✅ 処理ステップ図（概要）

# ```text
# 標準入力 → parse_input()
#               ↓
#           N, W, items
#               ↓
#        solve_knapsack()  ← DPテーブル生成
#               ↓
#            最大価値を算出
#               ↓
#            print(result)
# ```

# ---

# ## ✅ 拡張案（必要なら）

# * 品物選択の **経路復元（どの品物を選んだか）**
# * 重さ軸DP（Wが小さい場合のみ有効）
# * メモリ最適化（1次元DP）
