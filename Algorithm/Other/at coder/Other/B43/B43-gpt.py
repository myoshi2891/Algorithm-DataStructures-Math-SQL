# 以下は、**Python (CPython 3.11.4)** を用いて、**型注釈を明示**し、**Pylanceの型検査に準拠**しつつ、**処理時間とメモリ効率を意識**したクイズ大会の正解数計算プログラムです。

# ---

# ## ✅ 解法のポイント

# * `M` 問全てに対して、各生徒の **誤答数** を `O(1)` で記録。
# * 最終的に、各生徒の **正解数 = M - 誤答数** を出力。

# ---

# ## ✅ Python コード（型注釈 + Pylance対応）

# ```python
from typing import List
import sys

# 高速入力用（制約対策）
input = sys.stdin.readline

def calculate_correct_answers(N: int, M: int, A: List[int]) -> List[int]:
    """
    クイズ大会の正解数を計算する

    Parameters:
    - N (int): 生徒の人数 (1 <= N <= 200_000)
    - M (int): 問題数 (1 <= M <= 200_000)
    - A (List[int]): 各問題で誤答した生徒番号（1-indexed, 長さ M）

    Returns:
    - List[int]: 各生徒の正解数（index: 0-based, 値: M - 間違えた回数）
    """
    wrong_counts: List[int] = [0] * N  # 各生徒の誤答数

    for a in A:
        wrong_counts[a - 1] += 1  # 1-indexed → 0-indexed

    # 正解数 = M - 間違えた数
    return [M - wrong for wrong in wrong_counts]

def main() -> None:
    """
    標準入力から N, M, A を読み込み、各生徒の正解数を出力する
    """
    N_str: str = sys.stdin.readline()
    while N_str.strip() == "":
        N_str = sys.stdin.readline()
    N, M = map(int, N_str.strip().split())

    A: List[int] = []
    while len(A) < M:
        line = sys.stdin.readline()
        if not line:
            break
        A.extend(map(int, line.strip().split()))

    result: List[int] = calculate_correct_answers(N, M, A)
    print('\n'.join(map(str, result)))

if __name__ == "__main__":
    main()
# ```

# ---

# ## ✅ 実行例

# ### 入力例（`input.txt`）

# ```
# 4 6
# 1 4 1 4 2 1
# ```

# ### 実行方法

# ```bash
# python3 main.py < input.txt
# ```

# ### 出力

# ```
# 3
# 5
# 6
# 4
# ```

# ---

# ## ✅ 処理時間・メモリ分析

# | 処理        | 時間計算量        | 空間計算量    |
# | --------- | ------------ | -------- |
# | 誤答数の記録    | O(M)         | O(N)     |
# | 正解数の計算    | O(N)         | O(N)     |
# | 出力（print） | O(N)         | O(1)     |
# | **合計**    | **O(N + M)** | **O(N)** |

# * `N, M ≤ 200000` に対しても高速に処理可能。
# * メモリ使用量（概算）：

#   * `wrong_counts`: `4 * N bytes ≈ 0.8MB`（N=200000の場合）

# ---

# ## ✅ Pylance 型検査ポイント

# * `List[int]` 明示により `list` の暗黙型エラー回避。
# * 関数引数・返却値に全て型注釈を付与。
# * `input()` と `sys.stdin.readline()` の混用による `Optional[str]` 混入も排除済。

# ---

# 必要に応じて、`time.perf_counter()` や `tracemalloc` を使って、実際の処理時間・メモリ計測コードも追加できます。ご希望があればお知らせください。
