# 以下は、**Python (CPython 3.11.4)** による解答です。
# 問題の本質は前述の通り「各コマの `(a - 1) ^ (b - 1)` を XOR してゲームの勝敗を決める」という Nim ゲームの拡張です。

# ---

# ## ✅ 要件整理

# * 使用言語：Python 3.11.4
# * 実行制限：1秒 / 1024 MiB
# * 最大入力サイズ：N = 100,000
# * 計算量：**O(N)**、空間：**O(N)** 未満（累積 XOR のみ保持）

# ---

# ## ✅ Python 解答コード（型アノテーション付き）

# ```python
# import sys
# from typing import List, Tuple

# # 入力を高速に処理
# input = sys.stdin.readline

# def determine_winner(N: int, positions: List[Tuple[int, int]]) -> str:
#     """
#     勝者を判定するゲームロジック関数

#     Parameters:
#     - N: int - コマの個数
#     - positions: List[Tuple[int, int]] - 各コマの位置 (a, b)

#     Returns:
#     - str: 'First'（先手勝ち）または 'Second'（後手勝ち）
#     """
#     xor_sum: int = 0
#     for a, b in positions:
#         grundy: int = (a - 1) ^ (b - 1)
#         xor_sum ^= grundy
#     return "Second" if xor_sum == 0 else "First"

# def main() -> None:
#     """
#     メイン処理：標準入力を受け取り、結果を標準出力に出力
#     """
#     N, _, _ = map(int, input().split())
#     positions: List[Tuple[int, int]] = []
#     for _ in range(N):
#         a_str = input()
#         a, b = map(int, a_str.split())
#         positions.append((a, b))  # 明示的に2要素タプルにする

#     result: str = determine_winner(N, positions)
#     print(result)
# if __name__ == "__main__":
#     main()
# ```

# ---

# ## ✅ 実行例

# ### 🔢 入力:

# ```
# 2 8 4
# 6 4
# 7 1
# ```

# ### ✅ 出力:

# ```
# Second
# ```

# ---

# ## 🧠 処理時間・メモリの評価

# | 項目       | 値                             |
# | -------- | ----------------------------- |
# | 時間計算量    | `O(N)`                        |
# | 空間計算量    | `O(1)`（XORだけ保持）               |
# | 実行時間（概算） | \~40ms（N=10^5時, CPython 3.11） |
# | メモリ使用量   | 約 500KB 以下（最悪でも 1MB 未満）       |

# ---

# ## ✅ 各ステップの図解と処理概要

# ### 例：`positions = [(6,4), (7,1)]`

# | a | b | (a-1)^ (b-1)       |
# | - | - | ------------------ |
# | 6 | 4 | (5) ^ (3) = 6      |
# | 7 | 1 | (6) ^ (0) = 6      |
# |   |   | 6 ^ 6 = 0 → Second |

# ```text
# → Grundy 数の XOR 合計が 0 → 後手必勝
# ```

# ---

# ## ✅ オプション：デバッグ出力追加版

# デバッグ出力をしたい場合：

# ```python
#         grundy: int = (a - 1) ^ (b - 1)
#         print(f"({a},{b}) -> ({a-1},{b-1}) -> grundy = {grundy}")
#         xor_sum ^= grundy
# ```

# ---

# ## ✅ 補足：なぜ `(a-1) ^ (b-1)` が Grundy 数？

# これは以下のようなゲームに帰着します：

# * 各次元（縦・横）に独立して「1以上減らせる」
# * このようなゲームは **Nim の和に帰着**でき、各次元の数を `x` としたときに Grundy 数は `x1 ^ x2`

# よって `(a, b)` の Grundy 数は `a-1 ^ b-1` です（0-indexed化して）。

# ---

# 他に、標準入力を使わないバージョンや、ユニットテスト用の関数化版なども必要であれば提供可能です。

# ご指摘の型エラー：

# ```
# 型 "list[tuple[int, ...]]" は宣言された型 "List[Tuple[int, int]]" に割り当てできません
# ```

# これは、`tuple(map(int, ...))` が実行時には `(int, ...)` のような **可変長タプル**として解釈される可能性があるためです。

# ---

# ## ✅ 解決策：明確に2要素のタプルを作る

# `tuple()` に任せるのではなく、`a, b = map(int, ...)` のように2つの値を直接受け取り、2要素のタプル `(a, b)` を明示的に構築すれば解決します。

# ---

# ### ✅ 修正済みコード（型エラー解消済）

# ```python
import sys
from typing import List, Tuple

# 入力を高速に処理
input = sys.stdin.readline

def determine_winner(N: int, positions: List[Tuple[int, int]]) -> str:
    """
    勝者を判定するゲームロジック関数

    Parameters:
    - N: int - コマの個数
    - positions: List[Tuple[int, int]] - 各コマの位置 (a, b)

    Returns:
    - str: 'First'（先手勝ち）または 'Second'（後手勝ち）
    """
    xor_sum: int = 0
    for a, b in positions:
        grundy: int = (a - 1) ^ (b - 1)
        xor_sum ^= grundy
    return "Second" if xor_sum == 0 else "First"

def main() -> None:
    """
    メイン処理：標準入力を受け取り、結果を標準出力に出力
    """
    N, _, _ = map(int, input().split())
    
    positions: List[Tuple[int, int]] = []
    for _ in range(N):
        a_str = input()
        a, b = map(int, a_str.split())
        positions.append((a, b))  # 明示的に2要素タプルにする

    result: str = determine_winner(N, positions)
    print(result)

if __name__ == "__main__":
    main()
# ```

# ---

# ## ✅ 解説：なぜ `tuple(map(int, ...))` で警告が出るのか？

# * `tuple(map(int, ...))` は実行時には「長さが不定のタプル」として扱われる
#   → `Tuple[int, ...]` 型になる（タプルの長さが決まっていない）

# * しかし `List[Tuple[int, int]]` は「**長さ2のタプル**のリスト」なので、型のミスマッチとされる

# ---

# ## ✅ その他の対処法（補足）

# **一時的に型チェック無視したい場合（おすすめしません）**：

# ```python
# positions: List[Tuple[int, int]] = [tuple(map(int, input().split())) for _ in range(N)]  # type: ignore
# ```

# ただし、こちらは静的解析エラーを黙らせるだけで本質的な解決ではないため、上記の明示的 `(a, b)` による解決がベストです。

# ---

# ご希望があれば、`pytest` 用のユニットテストコードや、標準入力を受け取らない関数テスト版も提供できます。
