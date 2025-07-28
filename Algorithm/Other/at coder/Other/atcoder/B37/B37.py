# 以下は、**各桁の出現回数を利用した高速な桁和計算アルゴリズム**を **Python (CPython 3.11.4)** によって実装したものです。

# ---

# ## ✅ アルゴリズム概要

# `f(x)` を各桁の和と定義し、`f(1) + f(2) + ... + f(N)` を高速に計算します。
# **各桁の位置に 1〜9 が何回現れるかを計算し、それを掛け合わせて合計する方法**です。
# 再帰・全列挙・DPは使用せず、**O(log₁₀ N)** 時間で完了します。

# ---

# ## ✅ Python 実装（型付き・コメント付き）

# ```python
from typing import Final

def sum_of_digit_sums(N: int) -> int:
    """
    f(1) + f(2) + ... + f(N) の総和を返す。
    f(x): x の各桁の和。

    :param N: 対象整数 (1 <= N < 10^15)
    :return: 総桁和 (int)
    """
    total: int = 0
    base: int = 1

    while base <= N:
        higher: int = N // (base * 10)
        current: int = (N // base) % 10
        lower: int = N % base

        for digit in range(1, 10):  # digit = 1〜9
            if digit < current:
                count = (higher + 1) * base
            elif digit == current:
                count = higher * base + lower + 1
            else:
                count = higher * base

            total += count * digit

        base *= 10

    return total

# -------------------- 実行部分 --------------------

def main() -> None:
    import sys
    input_str: Final[str] = sys.stdin.read().strip()
    N: int = int(input_str)
    result: int = sum_of_digit_sums(N)
    print(result)

if __name__ == "__main__":
    main()

# ## ✅ 入力例

# ```bash
# echo 288 | python3 solution.py
# # 出力: 2826
# ```

# ```bash
# echo 4 | python3 solution.py
# # 出力: 10
# ```

# ---

# ## ✅ 時間・メモリ特性

# | 指標        | 値                    |
# | --------- | -------------------- |
# | 実行時間      | O(log₁₀N)（最大15回のループ） |
# | 再帰・DP使用   | なし                   |
# | メモリ消費     | 定数（整数型変数のみ）          |
# | 型ヒント      | `int` をすべての変数に適用     |
# | Python互換性 | CPython 3.11.4 に完全対応 |

# ---

# ## ✅ 解法のメリット

# | 項目    | 内容                      |
# | ----- | ----------------------- |
# | ✅ 精度  | 桁位置・値の出現回数を理論的に導出し、誤差ゼロ |
# | ✅ 速度  | `O(log N)` 時間で完了。数百ms以内 |
# | ✅ 簡潔性 | 再帰やDPを使わずループだけで実現       |

# ---

# ## ✅ アルゴリズム要点（復習）

# ```
# 各桁について:
#   - 1〜9 がその桁に何回現れるかを求める
#   - 寄与 = 出現回数 × digit
#   - それを total に加算する
# ```

# ---

# ## ✅ 追加オプション（必要であれば）

# * 単体テスト関数 `test_sum_of_digit_sums()`
# * 入力の境界ケース検証
# * `int128` 相当の型使用例（ただし CPython の `int` は任意精度）

# ---

# 必要であれば **図による処理可視化** や **愚直版と高速版の差分チェックコード** も提供できます。お気軽にお申し付けください！
