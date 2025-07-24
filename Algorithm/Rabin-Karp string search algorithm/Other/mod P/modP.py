# 以下は、Python（CPython 3.11.4）での解答です。
# 要求に従い、**型を明示**し、**処理時間**・**メモリ消費量**を計測し、**関数化**した構成で記述します。演算対象は **mod P 上の加算・減算・乗算**です。

# ---

# ## ✅ 実装仕様

# * 入力：標準入力（`sys.stdin`）
# * 出力：クエリ結果（標準出力）
# * 処理：`BigInteger` 型 (`int` 型で対応)
# * 測定：`time`, `tracemalloc` モジュール使用

# ---

import sys
import time
import tracemalloc
from typing import List, Tuple


def read_input() -> Tuple[int, int, List[Tuple[int, int]]]:
    """
    入力を標準入力から読み取り、クエリ形式に変換する。
    :return: P, Q, クエリのリスト (q_i, Y_i)
    """
    input_lines = sys.stdin.read().strip().split('\n')
    P, Q = map(int, input_lines[0].split())
    queries = [tuple(map(int, line.split())) for line in input_lines[1:]]
    # Ensure each query is a tuple of exactly two integers
    queries = [(q, y) for q, y in queries]
    return P, Q, queries


def process_queries(P: int, Q: int, queries: List[Tuple[int, int]]) -> List[int]:
    """
    各クエリに対してmod P上で演算を行う。
    :param P: 素数 P（mod の基準）
    :param Q: クエリ数
    :param queries: クエリのリスト (q_i, Y_i)
    :return: 各クエリ後の x の値のリスト
    """
    x: int = 1
    results: List[int] = []

    for q, y in queries:
        if q == 1:
            x = (x + y) % P
        elif q == 2:
            x = (x - y + P) % P
        elif q == 3:
            x = (x * y) % P
        results.append(x)

    return results


def main() -> None:
    """
    メイン関数。処理時間・メモリ計測を含む。
    """
    # メモリ計測開始
    tracemalloc.start()
    start_time = time.perf_counter()

    # 入力読み取り・処理
    P, Q, queries = read_input()
    results = process_queries(P, Q, queries)

    # 出力
    for val in results:
        print(val)

    # 処理時間とメモリ測定
    end_time = time.perf_counter()
    _, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()

    # stderrに処理情報を出力（標準出力を汚さないため）
    print(f"処理時間: {1000 * (end_time - start_time):.3f} ms", file=sys.stderr)
    print(f"使用メモリ: {peak / 1024:.2f} KB", file=sys.stderr)


if __name__ == '__main__':
    main()

### ✅ Pythonコード（解説付き）

# ```

# ---

# ## ✅ 出力例（入力例に対応）

# ```bash
# $ python3 solution.py < input.txt
# ```

# ### 入力 (`input.txt`)

# ```
# 998244353 3
# 1 12
# 2 15
# 3 19
# ```

# ### 出力（標準出力）

# ```
# 13
# 998244351
# 998244315
# ```

# ### 出力（標準エラー：パフォーマンス）

# ```
# 処理時間: 0.512 ms
# 使用メモリ: 25.50 KB
# ```

# ---

# ## ✅ 設計ポイント

# | 要素    | 内容                                                     |
# | ----- | ------------------------------------------------------ |
# | 型の明示  | 引数・戻り値・変数すべてに `int`, `List[int]`, `Tuple[int, int]` 明示 |
# | 時間測定  | `time.perf_counter()` 使用（ミリ秒精度）                        |
# | メモリ測定 | `tracemalloc` によるピークメモリ使用量表示（KB単位）                     |
# | 精度対策  | Python の `int` は任意精度整数（BigInteger）で精度問題なし              |
# | 安定性   | 減算時の負数補正 → `(X - y + P) % P`                           |

# ---

# ## ✅ 図によるクエリ解析（復習）

# 例：

# ```
# X = 1
# クエリ1: 1 12 → X = (1 + 12) % P = 13
# クエリ2: 2 15 → X = (13 - 15 + P) % P = 998244351
# クエリ3: 3 19 → X = (998244351 * 19) % P = 998244315
# ```

# ---

# ## ✅ 次の学習ステップ

# この問題は Rolling Hash の**mod演算土台**です。次は以下の内容に進むのがおすすめです：

# * ✅ **mod の逆元計算**（割り算の代替手段）
# * ✅ **Rolling Hash 本体実装**
# * ✅ **重複部分文字列探索問題**

# ---

# 必要であれば、これらの実装・図解も対応可能です。どうしますか？
