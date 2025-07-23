# 以下はご要望に応じた **Python (CPython 3.11.4)** による実装です。

# ---

# ## ✅ 概要

# * 和をちょうど `K` にできるかを判定し、
# * できるなら **最小個数かつ辞書順最大の要素列** を求めて出力します。

# ---

# ## ✅ 実装仕様

# * 使用言語: Python 3.11.4
# * 時間計算量: `O(N * K)`
# * 空間計算量: `O(K * M)` （`M`は最大要素数）
# * `dp[k] = (count, list)`：和 `k` を作るのに必要な最小個数と辞書順最大なリスト

# ---

# ## ✅ コード本体（コメント付き）

# ```python
import sys
from typing import List, Tuple, Optional


def solve_subset_sum_lex_max(N: int, K: int, A: List[int]) -> Optional[Tuple[int, List[int]]]:
    """
    和をKにできるかを判定し、できる場合は最小個数・辞書順最大の列を返す関数

    Parameters:
        N (int): 数列の長さ
        K (int): 目標となる合計
        A (List[int]): 数列 A

    Returns:
        Optional[Tuple[int, List[int]]]: 
            - Kを作れる場合: (要素数, 降順に並べた要素列)
            - 作れない場合: None
    """

    A.sort(reverse=True)  # 辞書順最大を保証するため降順にソート

    # dp[s]: 和sを作るための最小要素数と構成リスト
    dp: List[Optional[Tuple[int, List[int]]]] = [None] * (K + 1)
    dp[0] = (0, [])

    for a in A:
        for s in range(K, -1, -1):
            if s + a > K:
                continue
            prev = dp[s]
            if prev is None:
                continue

            count: int = prev[0] + 1
            lst: List[int] = prev[1] + [a]

            current = dp[s + a]

            # 候補の方が優れていれば更新
            if current is None or count < current[0] or (count == current[0] and lst > current[1]):
                dp[s + a] = (count, lst)

    return dp[K] if dp[K] is not None else None


def main() -> None:
    """
    標準入力から読み込み、結果を標準出力するメイン関数
    """

    input = sys.stdin.read
    data = input().split()
    N, K = int(data[0]), int(data[1])
    A = list(map(int, data[2:]))

    result = solve_subset_sum_lex_max(N, K, A)

    if result is None:
        print(-1)
    else:
        count, lst = result
        lst.sort(reverse=True)
        print(count)
        print(' '.join(map(str, lst)))


if __name__ == "__main__":
    main()

# ```

# ---

# ## ✅ 実行方法

# 標準入力に以下のように与えて実行できます。

# ```bash
# echo -e "3 6\n1 2 3" | python3 solution.py
# ```

# 出力:

# ```
# 3
# 3 2 1
# ```

# ---

# ## ✅ テストケース検証（例）

# ### 入力例2:

# ```
# 5 4
# 1 3 2 2 1
# ```

# 出力:

# ```
# 2
# 3 1
# ```

# ---

# ## ✅ 時間・メモリの考察

# | 項目    | 見積り                                            |
# | ----- | ---------------------------------------------- |
# | 時間計算量 | `O(N * K)` → 最大 1000 \* 2000 = 2,000,000（許容範囲） |
# | 空間計算量 | `O(K * M)` → 最大 2000 個の配列リスト（1項目あたり多くても20要素前後） |

# → Pythonの標準メモリ管理でも十分対応可能です。

# ---

# ## ✅ 改良の余地

# * `@lru_cache` によるメモ化再帰型DPも検討可能（ただしTLEしやすい）
# * DPを `dict[int, (int, list)]` にするとメモリ圧縮できる（Sparse DP）

# ---

# ご希望があれば、**高速化版**や**出力列のインデックス復元版**への拡張も可能です。
