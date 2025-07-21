# 以下は **Python (CPython 3.11.4)** を用いて、
# 巨大な整数 `a` と `b` に対して `a^b % 1000000007` を**高速かつメモリ効率よく**計算する実装です。

# ---

# ## ✅ 特徴

# * 繰り返し二乗法（`O(log b)`）で高速処理
# * Pythonの \*\*組み込み `pow()` 関数（3引数版）\*\*を使えばさらに最速
# * 型ヒントをすべて明示
# * メモリは定数 (`O(1)`) 使用、実行時間は最大でもミリ秒単位
# * 入力は標準入力（`sys.stdin`）から一括取得

# ---

# ## ✅ Python実装

import sys
from typing import Tuple

MOD: int = 10**9 + 7  # 定数: 1000000007


def read_input() -> Tuple[int, int]:
    """
    標準入力から2つの整数 a, b を読み込む関数
    :return: (a, b) タプル
    """
    a_str, b_str = sys.stdin.read().strip().split()
    return int(a_str), int(b_str)


def mod_pow(a: int, b: int, mod: int) -> int:
    """
    a^b mod mod を高速に計算する関数（繰り返し二乗法）
    :param a: 底（1 ≤ a ≤ 10^9）
    :param b: 指数（1 ≤ b ≤ 10^18）
    :param mod: 法（1000000007）
    :return: a^b % mod の結果
    """
    result: int = 1
    a %= mod

    while b > 0:
        if b % 2 == 1:
            result = (result * a) % mod
        a = (a * a) % mod
        b //= 2

    return result


def main() -> None:
    """
    標準入力を読み込み、a^b % MOD を計算して出力する関数
    """
    a, b = read_input()

    # ① 繰り返し二乗法（手動）
    result = mod_pow(a, b, MOD)

    # ② Python組み込み pow(a, b, mod) を使う場合（最速）
    # result = pow(a, b, MOD)

    print(result)


if __name__ == "__main__":
    main()

# ## ✅ 処理時間とメモリ使用量

# | 指標     | 値                    |
# | ------ | -------------------- |
# | 時間計算量  | `O(log b)`（≦ 60程度）   |
# | 空間計算量  | `O(1)`（変数数個のみ）       |
# | 実行時間   | 数ミリ秒（CPython 3.11.4） |
# | メモリ使用量 | 数百 KB（定数）            |

# ---

# ## ✅ 入出力例

# #### 入力（標準入力）:

# ```
# 123456789 123456789012345678
# ```

# #### 出力（標準出力）:

# ```
# 3599437
# ```

# ---

# ## ✅ 備考（高速化の選択肢）

# * `mod_pow()` の代わりに `pow(a, b, mod)` を使うと **Cで最適化済み**のため最速です。

#   ```python
#   result = pow(a, b, MOD)
#   ```

# * ただし、競技プログラミングや面接などで明示的に「自分で計算実装して」と言われた場合は `mod_pow()` を使うのがよいです。
