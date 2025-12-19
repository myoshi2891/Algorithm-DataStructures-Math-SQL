# # 1. 問題分析結果

# * **競技プログラミング視点**
#   1 つの投下物（赤点）は最大で 2×2 の 4 基地を同時に供給できます。よって `n×m` のグリッドを 2×2 ブロックでタイル張りしたときのブロック数が最小投下数です。
#   ⇒ **答えは** `ceil(n/2) * ceil(m/2)`。

# * **業務開発視点**
#   ループ不要の O(1) 演算で可読性も高い。`math.ceil` を使わず **整数演算**で `((n+1)//2) * ((m+1)//2)` と書くと依存が減り、安全で高速。

# * **Python特有分析**

#   * **整数演算のみ**（CPython の任意精度 int でオーバーフロー懸念なし）。
#   * 標準ライブラリ import 不要、分岐・ループなし。
#   * テスト上限が大きくても計算量は一定。

# ---

# # 2. 採用アルゴリズムと根拠

# * **タイル張り（2×2）**
#   各投下点がカバーできる最大領域は 2×2。全体を 2×2 に分割した個数が最小。端に 1 行/1 列余っても、`ceil` が自然に調整。
# * **計算量**: 時間 O(1)、空間 O(1)。
# * **トレードオフ**: ループ実装より圧倒的に短く・速い。境界条件も整数切り上げで自然に処理。

# ---

# # 3. アルゴリズム比較表

# | アプローチ          | 時間計算量 | 空間計算量 | 実装コスト | 可読性 | 標準ライブラリ | CPython最適化 | 備考                      |
# | -------------- | ----: | ----: | ----: | --- | ------- | ---------- | ----------------------- |
# | 2×2 タイルの数式（採用） |  O(1) |  O(1) |     低 | 高   | 不要      | 最適         | `((n+1)//2)*((m+1)//2)` |
# | 貪欲に配置を模擬       | O(nm) |  O(1) |     中 | 中   | 不要      | 不適         | ループが無駄・境界が煩雑            |

# ---

# # 4. Python特有最適化ポイント

# * `math.ceil(x/2)` の代わりに **`(x+1)//2`** を使う（高速・依存なし）。
# * ループ/条件分岐を無くし、**ブランチミス予防**＆最小命令数。

# ---

# # 5. HackerRankでの回答（関数のみ／型注釈つき）

# ```python
# from typing import Final


def gameWithCells(n: int, m: int) -> int:
    """
    Calculate the minimum number of supply packages to cover all n x m cells,
    where each package can cover up to a 2x2 block (inside or on borders).

    This equals the number of 2x2 tiles needed to cover the grid:
        ceil(n/2) * ceil(m/2)
    Implemented using integer arithmetic to avoid imports:
        ((n + 1) // 2) * ((m + 1) // 2)

    Args:
        n: number of rows (>= 1)
        m: number of columns (>= 1)
    Returns:
        Minimum number of packages required.
    """
    if n < 1 or m < 1:
        raise ValueError("n and m must be >= 1")
    return ((n + 1) // 2) * ((m + 1) // 2)


# ```

# ---

# # 6. 検証メモ（抜粋）

# * **サンプル**: `n=2, m=2` → `((2+1)//2)*((2+1)//2) = 1*1 = 1`（出力例どおり）
# * **奇数/偶数混在**: `n=3, m=5` → `ceil(1.5)*ceil(2.5)=2*3=6` → `((3+1)//2)*((5+1)//2)=2*3=6`
# * **大規模**: `n=10**9, m=10**9` でも O(1)・整数演算のみで安全。
