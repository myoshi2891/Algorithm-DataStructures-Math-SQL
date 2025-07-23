# 以下に、**Python（CPython 3.11.4）** を用いて問題を解く解法を示します。

# ---

# ## ✅ 問題概要の再確認

# * 与えられた整数 `N (1 ≤ N ≤ 10^12)` に対して、
# * `1 以上 N 以下` の整数のうち、`3, 5, 7` のいずれかで割り切れる数の個数を求める。

# ---

# ## ✅ 解法：包除原理（Inclusion-Exclusion）

# ```text
# |A ∪ B ∪ C| = |A| + |B| + |C| - |A ∩ B| - |A ∩ C| - |B ∩ C| + |A ∩ B ∩ C|
# ```

# ---

# ## ✅ Python コード（型付き + コメントあり）

# ```python
import sys

def count_multiples(N: int) -> int:
    """
    N以下の整数のうち、3, 5, 7 のいずれかで割り切れる整数の個数を返す

    Parameters:
    - N (int): 1以上10^12以下の整数

    Returns:
    - int: 条件を満たす整数の個数
    """

    def div(x: int) -> int:
        return N // x

    # Inclusion-Exclusion Principle
    count: int = (
        div(3) + div(5) + div(7)
        - div(3 * 5) - div(3 * 7) - div(5 * 7)
        + div(3 * 5 * 7)
    )
    return count

def main() -> None:
    """
    標準入力からNを受け取り、条件を満たす整数の個数を出力する
    """
    input_data: str = sys.stdin.read().strip()
    N: int = int(input_data)
    result: int = count_multiples(N)
    print(result)

if __name__ == "__main__":
    main()

# ## ✅ 実行例

# ```bash
# echo 10 | python3 main.py
# # 出力: 6
# ```

# ---

# ## ✅ 処理時間・メモリ消費

# | 項目        | 内容                                    |
# | --------- | ------------------------------------- |
# | **計算量**   | O(1)（整数除算を7回）                         |
# | **実行時間**  | 約 0.01ms ～ 0.1ms 程度（Nに依存しない）          |
# | **メモリ使用** | 数個の整数変数（< 1KB）                        |
# | **精度**    | Python の `int` は任意精度 → `10^12` 以上でも安全 |

# ---

# ## ✅ テスト例

# | 入力値 `N`        | 出力            | 備考           |
# | -------------- | ------------- | ------------ |
# | `10`           | `6`           | 3,5,6,7,9,10 |
# | `210`          | `114`         |              |
# | `100000000000` | `54285714286` | 任意精度でも高速     |

# ---

# ご希望があれば、**ナイーブなO(N)解法やベン図解説付きのPythonコード**も併せて提供可能です。
