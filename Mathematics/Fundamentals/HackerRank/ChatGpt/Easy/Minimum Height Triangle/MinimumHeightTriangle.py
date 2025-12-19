# # 1. 問題分析（多角的）

# * **数理**
#   三角形の面積は ( \text{area}=\frac{b \cdot h}{2} )。
#   「面積が少なくとも (a)」より
#   [
#   \frac{b\cdot h}{2} \ge a ;\Rightarrow; h \ge \frac{2a}{b}
#   ]
#   よって**最小の整数高さ**は
#   [
#   h_{\min}=\left\lceil \frac{2a}{b} \right\rceil
#   ]

# * **安全な実装**
#   浮動小数点を使うと誤差の恐れがあるため、**整数演算だけで天井関数**を実現します：
#   [
#   \left\lceil \frac{x}{y} \right\rceil = \frac{x + y - 1}{y}\ (\text{整数除算})
#   ]
#   ここでは (x=2a,, y=b) なので `h = (2*a + b - 1) // b`。

# * **計算量**
#   O(1) 時間、O(1) 追加メモリ。

# ---

# # 2. アルゴリズム比較表

# | アプローチ                         | 時間計算量 | 空間計算量 | Python実装コスト | 可読性 | 標準ライブラリ     | CPython最適化 | 備考       |
# | ----------------------------- | ----: | ----: | ----------- | --- | ----------- | ---------- | -------- |
# | 方法A: 整数演算での天井 `(2a+b-1)//b`   |  O(1) |  O(1) | 低           | ★★★ | なし          | 適          | 誤差なし・最速  |
# | 方法B: `math.ceil(2*a/b)`（浮動小数） |  O(1) |  O(1) | 低           | ★★☆ | `math.ceil` | 適          | 大数で誤差の懸念 |

# **採用**: 方法A（整数演算）。

# ---

# # 3. Python特有最適化ポイント

# * **整数は任意精度**（オーバーフロー心配なし）。
# * **浮動小数を避ける**ことで誤差ゼロ・高速。
# * 分岐ゼロの**定数時間**処理。

# ---

# # 4. 実装パターン

# HackerRank の**関数実装形式**に合わせ、`lowestTriangle` のみを完成させます。
# （入出力処理はテンプレに従いそのまま）

# ---

# ## HackerRankでの回答フォーマット（完成コード）

# ```python
#!/bin/python3

# import math
import os
# import random
# import re
# import sys

#
# Complete the 'lowestTriangle' function below.
#
# The function is expected to return an INTEGER.
# The function accepts following parameters:
#  1. INTEGER trianglebase
#  2. INTEGER area
#


def lowestTriangle(trianglebase, area):
    # 面積 >= a を満たす最小の整数高さ h を返す
    # 条件: (trianglebase * h) / 2 >= area
    #  <=> h >= (2*area) / trianglebase
    # 浮動小数を避け、整数演算で ceil を実現
    # ceil(x/y) = (x + y - 1) // y （x, y は正の整数）
    return (2 * area + trianglebase - 1) // trianglebase


if __name__ == "__main__":
    fptr = open(os.environ["OUTPUT_PATH"], "w")

    first_multiple_input = input().rstrip().split()

    trianglebase = int(first_multiple_input[0])

    area = int(first_multiple_input[1])

    height = lowestTriangle(trianglebase, area)

    fptr.write(str(height) + "\n")

    fptr.close()
# ```

# ---

# # 5. 検証メモ（抜粋）

# * **Sample 0**: `b=2, a=2` → `(2*2+2-1)//2 = 5//2 = 2` ✅
# * **Sample 1**: `b=17, a=100` → `(200+17-1)//17 = 216//17 = 12` ✅
# * 大きな値でも整数演算のため**誤差なし**。
