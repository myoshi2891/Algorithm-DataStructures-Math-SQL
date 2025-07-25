# 以下は、Python (CPython 3.11.4) を用いた解答です。
# 高速な **繰り返し二乗法 (mod P)** を用いて、各クエリ `X^Y mod P` を効率的に処理します。さらに、処理時間とメモリ消費量も出力します。

# ---

# ## ✅ Python 解答コード（型付き、関数構成、ログ出力付き）

# ```python
import sys
import time
import tracemalloc
from typing import List, Tuple

# --- 高速べき乗計算（繰り返し二乗法） ---
def mod_pow(x: int, y: int, mod: int) -> int:
    """
    base^exponent % mod を高速に求める関数（繰り返し二乗法）
    
    Parameters:
        x (int): 基数 X
        y (int): 指数 Y
        mod (int): 法 P（素数）

    Returns:
        int: (x^y) % mod の結果
    """
    result = 1
    x %= mod

    while y > 0:
        if y % 2 == 1:
            result = (result * x) % mod
        x = (x * x) % mod
        y //= 2
    return result

# --- クエリ処理関数 ---
def solve_queries(p: int, queries: List[Tuple[int, int]]) -> List[int]:
    """
    各クエリ (X_i, Y_i) に対して X_i^Y_i mod P を計算

    Parameters:
        p (int): 素数 P
        queries (List[Tuple[int, int]]): クエリのリスト [(X1, Y1), (X2, Y2), ...]

    Returns:
        List[int]: 各クエリに対する結果
    """
    return [mod_pow(x, y, p) for x, y in queries]

# --- 入力処理 ---
def read_input() -> Tuple[int, List[Tuple[int, int]]]:
    """
    標準入力から P, Q と Q個のクエリを読み取る

    Returns:
        Tuple[int, List[Tuple[int, int]]]: P とクエリのリスト
    """
    lines = sys.stdin.read().strip().split('\n')
    p, q = map(int, lines[0].split())
    # 修正後（型が Tuple[int, int] になる）
    queries = [ (int(x), int(y)) for x, y in (line.split() for line in lines[1:q+1]) ]    
    return p, queries

# --- メイン処理 ---
def main():
    # 開始時間 & メモリ
    start_time = time.time()
    tracemalloc.start()

    p, queries = read_input()
    results = solve_queries(p, queries)

    # 出力
    for res in results:
        print(res)

    # 終了時間 & メモリ
    end_time = time.time()
    _, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()

    # 処理時間とメモリ出力（stderr）
    print(f"処理時間: {(end_time - start_time)*1000:.3f} ms", file=sys.stderr)
    print(f"使用メモリ: {peak / 1024:.2f} KB", file=sys.stderr)

# 実行エントリポイント
if __name__ == "__main__":
    main()
# ```

# ---

# ## 🧪 入力例

# ```
# 998244353 3
# 10 10
# 734 765
# 777 999
# ```

# ## ✅ 出力例

# ```txt
# 17556470
# 65071411
# 99508285
# ```

# stderr 側には（例）：

# ```txt
# 処理時間: 5.321 ms
# 使用メモリ: 35.47 KB
# ```

# ---

# ## 📈 時間・空間計算量

# | 処理        | 計算量               |
# | --------- | ----------------- |
# | `mod_pow` | O(log Y)          |
# | 全体（Q件）    | O(Q × log Y\_max) |
# | メモリ使用量    | O(Q)（結果リスト分）      |

# * **Q ≤ 200000**
# * **Y\_max ≤ 10^18 → log₂Y ≈ 60**

# したがって、最大でも約 200,000 × 60 = **1,200万 回程度の演算**。CPython でも十分高速。

# ---

# ## ✅ 特徴

# * **関数分割**で可読性・再利用性が高い
# * **型アノテーション**あり
# * **tracemalloc** と **time** による詳細ログ付き

# ---

# 他に「標準出力ではなくファイル出力で結果を保存したい」などの要望があればご対応します！

# このエラーは、次のようなコードで発生していると思われます：

# ```python
# def read_input() -> Tuple[int, List[Tuple[int, int]]]:
#     ...
#     queries = [tuple(map(int, line.split())) for line in lines[1:q+1]]
#     return p, queries
# ```

# このとき、`tuple(map(int, ...))` の戻り値は「**長さ2とは限らない任意長のタプル (`tuple[int, ...]`)**」として型推論されるため、
# 関数の戻り値の型として宣言している `List[Tuple[int, int]]`（= **必ず2要素**）と一致しない、という型エラーになります。

# ---

# ## ✅ 解決方法：タプルの長さを保証する

# `tuple(map(...))` を明示的に2要素にして、\*\*「タプルの長さは2である」\*\*ことを保証します。

# ```python
# # 修正前（型が tuple[int, ...] になる）
# queries = [tuple(map(int, line.split())) for line in lines[1:q+1]]

# # 修正後（型が Tuple[int, int] になる）
# queries = [ (int(x), int(y)) for x, y in (line.split() for line in lines[1:q+1]) ]
# ```

# ---

# ### 🔍 型推論の違いの解説

# | 書き方                    | 推論される型                 |
# | ---------------------- | ---------------------- |
# | `tuple(map(int, ...))` | `tuple[int, ...]`（任意長） |
# | `(int(x), int(y))`     | `Tuple[int, int]`（2要素） |

# ---

# ## ✅ 完全な修正済み関数

# ```python
# from typing import List, Tuple

# def read_input() -> Tuple[int, List[Tuple[int, int]]]:
#     import sys
#     lines = sys.stdin.read().strip().split('\n')
#     p, q = map(int, lines[0].split())

#     # 修正済み: タプルの長さを明示的に2にする
#     queries = [ (int(x), int(y)) for x, y in (line.split() for line in lines[1:q+1]) ]
#     return p, queries
# ```

# ---

# ## ✅ これで Pylance の型エラーも解消されます。

# 他にも `Tuple[int, int]` 型の扱いやリスト型の静的チェックでお困りのことがあれば対応できますので、気軽にどうぞ。
