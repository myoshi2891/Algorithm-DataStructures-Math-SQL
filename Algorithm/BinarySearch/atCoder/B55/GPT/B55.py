# では、TypeScript版のロジックをPython (CPython 3.11.4) に移植し、
# **型アノテーション**と**高速入出力**、**処理時間・メモリ計測**を組み込みます。

# 配列は昇順保持、`bisect` による二分探索で O(log N) 検索 + O(N) 挿入を行います。
# 制約 (Q ≤ 100,000) であれば十分間に合います。

# ---

# ```python
# Python 3.11.4
# 高速入出力 + 型アノテーション + 処理時間/メモリ計測対応

import sys
import bisect
import time
import tracemalloc
from typing import List, Tuple

def lower_bound(arr: List[int], x: int) -> int:
    """
    昇順配列 arr において、x を挿入すべき位置（最初に x 以上となる位置）を返す。
    :param arr: 昇順にソートされた整数配列
    :param x: 探索する整数
    :return: 挿入位置（0 <= pos <= len(arr)）
    """
    return bisect.bisect_left(arr, x)

def process_queries(Q: int, queries: List[Tuple[int, int]]) -> List[int]:
    """
    クエリを処理し、タイプ2の結果を返す。
    :param Q: クエリ数
    :param queries: (t, x) のタプル配列
                    t=1: カード x を昇順位置に挿入
                    t=2: x との差の絶対値最小値を返す
    :return: クエリ2の結果リスト
    """
    cards: List[int] = []     # 昇順で保持
    output: List[int] = []

    for t, x in queries:
        if t == 1:
            pos = lower_bound(cards, x)
            cards.insert(pos, x)  # O(N) 挿入
        else:
            if not cards:
                output.append(-1)
                continue
            pos = lower_bound(cards, x)
            # min_diff = float("inf")
            min_diff: int = 10**10  # 型をintで統一
            if pos < len(cards):
                min_diff = min(min_diff, abs(cards[pos] - x))
            if pos > 0:
                min_diff = min(min_diff, abs(cards[pos - 1] - x))
            output.append(min_diff)

    return output

def main() -> None:
    """
    標準入力からクエリを読み込み、結果を出力する。
    実行時間とメモリ使用量をstderrに出力。
    """
    start_time = time.perf_counter()
    tracemalloc.start()

    data = sys.stdin.buffer.read().split()
    Q: int = int(data[0])
    queries: List[Tuple[int, int]] = [(int(data[i]), int(data[i + 1])) for i in range(1, len(data), 2)]

    result = process_queries(Q, queries)
    sys.stdout.write("\n".join(map(str, result)))

    current, peak = tracemalloc.get_traced_memory()
    end_time = time.perf_counter()
    tracemalloc.stop()

    # stderr に計測結果出力
    sys.stderr.write(f"\nExecution time: {(end_time - start_time) * 1000:.3f} ms\n")
    sys.stderr.write(f"Memory used: {current / 1024 / 1024:.3f} MB (peak: {peak / 1024 / 1024:.3f} MB)\n")

if __name__ == "__main__":
    main()
# ```

# ---

# ### 実装ポイント

# 1. **型アノテーション**

#    * 関数パラメータ・返り値を `List[int]`, `Tuple[int, int]` などで明示
#    * Pylance が型エラーを出さない形に
# 2. **高速入出力**

#    * 入力は `sys.stdin.buffer.read()` を使用（splitでバイト列→整数変換）
#    * 出力は `sys.stdout.write()` でまとめて出す
# 3. **二分探索**

#    * Python標準の `bisect.bisect_left` を利用（挿入位置探索）
# 4. **計測**

#    * 時間: `time.perf_counter()`
#    * メモリ: `tracemalloc`（現在・ピーク使用量両方）

# ---

# このまま提出すれば、制約内で十分高速に動作します。

# もし **O(N) 挿入がボトルネック**になる場合は、
# `sortedcontainers.SortedList` を使えば O(log N) 挿入・探索になります（ただし標準ライブラリ外）。

# ---

# なるほど、
# `min_diff` を `float("inf")` で初期化したために型が `float` と推論され、
# `List[int].append()` に渡すと **Pylance が「intじゃないよ」** と怒ってますね。

# このケースでは、
# `min_diff` を **整数型** として初期化すれば解決します。

# `float("inf")` ではなく、問題の制約に基づいた十分大きい整数（例えば `10**10`）で初期化します。
# （制約では `x ≤ 10^9` なので差の最大値も `10^9`、余裕を持たせて `10**10` ）

# ---

# ### 修正版コード（型エラー解消）

# ```python
# import sys
# import bisect
# import time
# import tracemalloc
# from typing import List, Tuple

# def lower_bound(arr: List[int], x: int) -> int:
#     """
#     昇順配列 arr において、x を挿入すべき位置（最初に x 以上となる位置）を返す。
#     """
#     return bisect.bisect_left(arr, x)

# def process_queries(Q: int, queries: List[Tuple[int, int]]) -> List[int]:
#     """
#     クエリを処理し、タイプ2の結果を返す。
#     """
#     cards: List[int] = []
#     output: List[int] = []

#     for t, x in queries:
#         if t == 1:
#             pos = lower_bound(cards, x)
#             cards.insert(pos, x)  # O(N) 挿入
#         else:
#             if not cards:
#                 output.append(-1)
#                 continue
#             pos = lower_bound(cards, x)
#             min_diff: int = 10**10  # 型をintで統一
#             if pos < len(cards):
#                 min_diff = min(min_diff, abs(cards[pos] - x))
#             if pos > 0:
#                 min_diff = min(min_diff, abs(cards[pos - 1] - x))
#             output.append(min_diff)

#     return output

# def main() -> None:
#     """
#     標準入力からクエリを読み込み、結果を出力する。
#     実行時間とメモリ使用量をstderrに出力。
#     """
#     start_time = time.perf_counter()
#     tracemalloc.start()

#     data = sys.stdin.buffer.read().split()
#     Q: int = int(data[0])
#     queries: List[Tuple[int, int]] = [
#         (int(data[i]), int(data[i + 1])) for i in range(1, len(data), 2)
#     ]

#     result = process_queries(Q, queries)
#     sys.stdout.write("\n".join(map(str, result)))

#     current, peak = tracemalloc.get_traced_memory()
#     end_time = time.perf_counter()
#     tracemalloc.stop()

#     sys.stderr.write(f"\nExecution time: {(end_time - start_time) * 1000:.3f} ms\n")
#     sys.stderr.write(f"Memory used: {current / 1024 / 1024:.3f} MB (peak: {peak / 1024 / 1024:.3f} MB)\n")

# if __name__ == "__main__":
#     main()
# ```

# ---

# これで

# * `min_diff` は **int型** のまま
# * `output.append()` に渡しても型エラーなし
# * Pylanceの `reportArgumentType` も解消


