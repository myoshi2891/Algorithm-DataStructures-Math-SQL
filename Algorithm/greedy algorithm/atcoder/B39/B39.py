# 以下に、**Python (CPython 3.11.4)** を用いた解答を提示します。
# この解法は **優先度付きキュー（最大ヒープ）+ 日付ごとの仕事分類** を利用し、\*\*最も効率的な満点解法（O(N log N + D log N))）\*\*です。

# ---

# ## ✅ 解法の要点（Python）

# * `heapq` はデフォルトで **最小ヒープ** なので、**負の値を使って最大ヒープのように扱います**。
# * 各日 `d` に対し、その日に開始できる仕事の報酬をヒープに追加。
# * 毎日、ヒープから最大報酬の仕事を1つ選んで合計。

# ---

# ## ✅ 実装コード（関数化・型注釈付き）

# ```python
import sys
import heapq
from typing import List, Tuple


def get_max_earnings(n: int, d: int, jobs: List[Tuple[int, int]]) -> int:
    """
    最大収益を計算する関数

    Parameters:
    - n: int - 仕事の数
    - d: int - 就業可能日数
    - jobs: List[Tuple[int, int]] - 各仕事の情報 (開始日Xi, 報酬Yi)

    Returns:
    - int - 得られる最大報酬の合計
    """

    # 各日ごとの仕事リストに分類
    job_by_day: List[List[int]] = [[] for _ in range(d + 1)]
    for x, y in jobs:
        if x <= d:
            job_by_day[x].append(y)

    # 最大ヒープ（heapqで負値にして使用）
    max_heap: List[int] = []
    total: int = 0

    for day in range(1, d + 1):
        # 今日から可能な仕事をヒープに追加
        for reward in job_by_day[day]:
            heapq.heappush(max_heap, -reward)  # 最大ヒープのためマイナス

        # 今日やるべき最大報酬の仕事を選択
        if max_heap:
            total += -heapq.heappop(max_heap)

    return total


def main() -> None:
    """
    標準入力からデータを受け取り、最大収益を出力するメイン関数
    """

    input_data = sys.stdin.read().strip().split('\n')
    n, d = map(int, input_data[0].split())
    # jobs: List[Tuple[int, int]] = [tuple(map(int, line.split())) for line in input_data[1:]]
    # ✅ 型安全でpylanceエラーを回避
    jobs: List[Tuple[int, int]] = [
        (int(x), int(y)) for x, y in (line.split() for line in input_data[1:])
    ]

    result: int = get_max_earnings(n, d, jobs)
    print(result)


if __name__ == "__main__":
    main()
# ```

# ---

# ## ✅ 使用例（テストケース）

# 入力:

# ```
# 5 4
# 1 1
# 2 4
# 2 3
# 3 4
# 4 2
# ```

# 出力:

# ```
# 12
# ```

# ---

# ## ✅ 時間・メモリ効率分析

# | 処理    | 計算量                  | 備考                  |
# | ----- | -------------------- | ------------------- |
# | job分類 | O(N)                 | 各仕事を1回だけ処理          |
# | ヒープ操作 | O(N log N + D log N) | push/pop 1回あたり logN |
# | 合計メモリ | O(N + D)             | job\_by\_day + ヒープ  |
# | 最大入力  | N=200,000, D=2000    | 問題制約内で高速に処理可能       |

# ---

# ## ✅ 特長

# * ヒープ（heapq）で最大値を管理し、**毎日最適な仕事を選ぶ貪欲戦略**
# * Pythonでも**満点が取れる効率的実装**
# * `typing` により明確な型指定、可読性・保守性も考慮

# ---

# ご希望があればこのコードの**処理過程のステップ解説や図解付きの説明**も対応可能です。お気軽にどうぞ。

# このエラーは、`Pylance`（VSCodeなどで使われている型チェッカー）が `List[Tuple[int, int]]` という期待される型と、`list[tuple[int, ...]]`（要素数が2に限られていないタプル）との**不一致**を検出していることによるものです。

# ---

# ## ✅ 原因

# 次のようなコードで `jobs` を生成している部分：

# ```python
# jobs: List[Tuple[int, int]] = [tuple(map(int, line.split())) for line in input_data[1:]]
# ```

# ここで `tuple(map(...))` を使うと、Pylance には `Tuple[int, ...]`（要素数が可変）と解釈され、`Tuple[int, int]`（要素数2）とは型不一致と判断されます。

# ---

# ## ✅ 解決策（安全で型正しい書き換え）

# `map(int, ...)` から明示的に2要素のタプルを作るように書き換えましょう：

# ```python
# jobs: List[Tuple[int, int]] = [ (int(x), int(y)) for x, y in (line.split() for line in input_data[1:]) ]
# ```

# ---

# ## ✅ 修正後のコード抜粋

# ```python
# def main() -> None:
#     """
#     標準入力からデータを受け取り、最大収益を出力するメイン関数
#     """

#     input_data = sys.stdin.read().strip().split('\n')
#     n, d = map(int, input_data[0].split())

#     # ✅ 型安全でpylanceエラーを回避
#     jobs: List[Tuple[int, int]] = [
#         (int(x), int(y)) for x, y in (line.split() for line in input_data[1:])
#     ]

#     result: int = get_max_earnings(n, d, jobs)
#     print(result)
# ```

# ---

# ## ✅ 解説

# | 書き方                    | 型推論               | 説明        |
# | ---------------------- | ----------------- | --------- |
# | `tuple(map(int, ...))` | `tuple[int, ...]` | 任意長、要素数不定 |
# | `(int(x), int(y))`     | `Tuple[int, int]` | 要素数2で型一致  |

# ---

# これで `Pylance` の型エラーは解消されます。
# 他にも型エラーや警告が出る場合はお気軽にお知らせください。
