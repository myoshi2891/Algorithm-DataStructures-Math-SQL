# 以下に、**Python (CPython 3.11.4)** を用いて、**2つの正の整数 A, B の最小公倍数（LCM）を求めるプログラム**を提示します。

# ---

# ## ✅ 処理要件

# * 使用言語：**Python**
# * 入力：標準入力から整数 A, B（1 ≤ A, B ≤ 10^9）
# * 出力：最小公倍数（LCM）
# * 時間制限：1 秒
# * メモリ制限：1024 MiB
# * 安全な多倍長整数演算：Python の `int` は任意精度対応のため `BigInt` 不要

# ---

# ## ✅ Python 実装コード（関数化、型付き、計算量配慮）

import sys
# from typing import Tuple

# 最大公約数を求める関数（ユークリッドの互除法）
def gcd(a: int, b: int) -> int:
    """
    aとbの最大公約数を返す。
    時間計算量: O(log(min(a, b)))
    """
    while b != 0:
        a, b = b, a % b
    return a

# 最小公倍数を求める関数
def lcm(a: int, b: int) -> int:
    """
    aとbの最小公倍数を返す。
    計算式: lcm(a, b) = a // gcd(a, b) * b
    ※ a/gcd を先に計算することでオーバーフロー防止
    """
    return a // gcd(a, b) * b

# メイン処理関数（標準入力→出力）
def main() -> None:
    """
    入力: 標準入力から空白区切りで2整数 A B を読み込む
    出力: AとBの最小公倍数（int）
    """
    input_line: str = sys.stdin.readline().strip()
    a_str, b_str = input_line.split()
    a, b = int(a_str), int(b_str)

    result: int = lcm(a, b)
    print(result)

if __name__ == "__main__":
    main()
# ```

# ---

# ## ✅ 入出力例

# ### 入力:

# ```
# 25 30
# ```

# ### 出力:

# ```
# 150
# ```

# ---

# ## ✅ 処理性能

# | 指標        | 内容                          |
# | --------- | --------------------------- |
# | 時間計算量     | `O(log(min(A, B)))` （GCD）   |
# | 空間計算量     | `O(1)`（変数だけ）                |
# | 使用メモリ（目安） | 数個の整数 + 文字列（≪ 1 MiB）        |
# | オーバーフロー対策 | `a // gcd(a, b)` を先に行うことで対応 |

# ---

# ## ✅ 解説図（例: `lcm(25, 30)`）

# ```text
# Step 1: GCD(25, 30)
#   30 % 25 = 5
#   25 % 5 = 0
# → GCD = 5

# Step 2: LCM = (25 // 5) * 30 = 5 * 30 = 150
# ```

# ---

# ## 🔚 備考

# * Pythonでは `math.lcm()` が Python 3.9 以降に存在しますが、**アルゴリズム理解・評価のため自作**しました。
# * 競技プログラミングでも使えるよう、**標準入力対応 + 最小限の処理**にしています。

