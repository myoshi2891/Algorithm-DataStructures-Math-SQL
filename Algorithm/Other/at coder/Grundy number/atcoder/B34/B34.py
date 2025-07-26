# 以下は、**Python (CPython 3.11.4)** を用いた、`X = 2, Y = 3` 固定の **取り石ゲーム（Game 3）** に対する完全解答です。

# ---

# ## ✅ 解法概要（Nimゲーム + Grundy数周期活用）

# * 操作は `X = 2`, `Y = 3` 固定。
# * 各山の石の数に応じて Grundy 数（勝敗情報）を求める。
# * `XOR` 和が 0 → **後手必勝（"Second"）**、非 0 → **先手必勝（"First"）**。
# * `Grundy数 mod 5` が周期になることが知られているので高速化可能。

# ---

# ## ✅ Python コード（型注釈付き、処理時間・メモリ効率◎）

# ```python
import sys
from typing import List

def determine_winner(A: List[int]) -> str:
    """
    石取りゲームの勝者を判定する関数。
    
    パラメータ:
        A (List[int]) : 各山の石の個数（最大 10^18）
    
    戻り値:
        str : 'First' または 'Second'
    
    時間計算量: O(N)
    空間計算量: O(1) （定数サイズのGrundy数テーブルのみ使用）
    """
    # Grundy数の周期テーブル (X=2, Y=3 のとき mod 5 で周期)
    grundy_mod: List[int] = [0, 0, 1, 1, 2]

    xor_sum: int = 0
    for a in A:
        g = grundy_mod[a % 5]
        xor_sum ^= g

    return "Second" if xor_sum == 0 else "First"

def main() -> None:
    """
    標準入力から読み込んで結果を出力するメイン関数。
    """
    input_lines = sys.stdin.read().split()
    _: int = int(input_lines[0])
    # input_lines[1] と input_lines[2] は X, Y だが今回は固定なので無視
    A: List[int] = list(map(int, input_lines[3:]))  # A1〜AN

    result: str = determine_winner(A)
    print(result)

if __name__ == "__main__":
    main()
# ```

# ---

# ## ✅ 各処理の補足と理由

# | 処理                             | 内容                     | 備考               |
# | ------------------------------ | ---------------------- | ---------------- |
# | `grundy_mod = [0, 0, 1, 1, 2]` | Grundy数は mod 5 で周期化できる | X=2, Y=3 固定による性質 |
# | `a % 5`                        | 石数を周期化しGrundy数取得       | 高速かつ O(1)        |
# | `xor_sum ^= g`                 | 各山のGrundy数のXOR合計       | Nimゲーム理論の勝敗判定に必須 |
# | `xor_sum == 0`                 | 後手必勝の条件                | XOR=0 が負け状態を示す   |

# ---

# ## ✅ 処理時間・メモリ使用量の見積もり

# | 要素     | 使用量                                 |
# | ------ | ----------------------------------- |
# | 時間計算量  | O(N)（最大 100,000 山でも余裕）              |
# | メモリ使用量 | O(N) + O(1)（入力 + Grundy数表のみ）        |
# | 対応範囲   | Ai ≤ 10^18 対応済み（Python の int は任意精度） |

# ---

# ## ✅ 入出力例

# ### 入力

# ```
# 2 2 3
# 5 8
# ```

# ### 出力

# ```
# First
# ```

# ---

# ## ✅ テスト用の補足コード例（ローカルテスト用）

# ```python
# if __name__ == "__main__":
#     # ローカルテスト用
#     import io
#     sys.stdin = io.StringIO("2 2 3\n5 8\n")
#     main()
# ```

# ---

# ## ✅ 拡張対応も可能

# 必要に応じて：

# * 任意の `X`, `Y` に対応する汎用Grundy数列生成
# * メモ化・周期発見の自動化
# * 一般化 Nim ゲームへの拡張

# なども対応可能です。必要があればお知らせください。
