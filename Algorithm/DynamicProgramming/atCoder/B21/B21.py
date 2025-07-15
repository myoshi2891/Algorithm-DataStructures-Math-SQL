# 以下に、**Python (CPython 3.11.4)** を用いて「最長回文部分列の長さ」を求める実装を提示します。
# また、**型アノテーション・関数構造・処理時間およびメモリ効率**を重視しています。

# ---

# ## ✅ 実装（Python）

# ```python
import sys

# 型アノテーションのインポート（任意）
from typing import List

def longest_palindromic_subsequence(S: str) -> int:
    """
    与えられた文字列 S に対して、削除操作のみで構成可能な最長の回文部分列の長さを返す。

    Parameters:
    - S (str): 入力文字列（英小文字のみ）

    Returns:
    - int: 最長回文部分列の長さ
    """

    N: int = len(S)
    # dp[i][j] は S[i..j] における最長回文部分列の長さ
    dp: List[List[int]] = [[0] * N for _ in range(N)]

    # 長さ1の部分列は必ず回文
    for i in range(N):
        dp[i][i] = 1

    # 長さ2以上の部分列に対するDP
    for length in range(2, N + 1):         # 長さ 2 から N
        for i in range(N - length + 1):
            j = i + length - 1
            if S[i] == S[j]:
                if length == 2:
                    dp[i][j] = 2
                else:
                    dp[i][j] = dp[i + 1][j - 1] + 2
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])

    return dp[0][N - 1]

# --- 入力処理 ---
def main() -> None:
    input_lines = sys.stdin.read().splitlines()
    _: int = int(input_lines[0])
    S: str = input_lines[1]
    
    result: int = longest_palindromic_subsequence(S)
    print(result)

if __name__ == "__main__":
    main()

# ## ✅ 入力例

# 標準入力で以下のように与えると：

# ```
# 11
# programming
# ```

# 出力：

# ```
# 4
# ```

# ---

# ## ✅ 時間・空間計算量

# | 項目    | 値        | 説明                  |
# | ----- | -------- | ------------------- |
# | 時間計算量 | `O(N^2)` | 二重ループ（最大1000×1000）  |
# | 空間計算量 | `O(N^2)` | 二次元リスト（最大1000×1000） |

# * `N = 1000` の場合でも、2次元配列は約4MB（Pythonの整数で1要素8バイト想定） → **余裕で収まります（制限1024MiB）**
# * 実行時間は最大でも **100万ステップ程度**なので、CPython 3.11.4でも1秒以内で完了します。

# ---

# ## ✅ 補足：DPテーブルを1次元に圧縮することも可能？

# はい、理論上は可能ですが、今回のように `dp[i+1][j-1]` を参照する遷移がある場合は「全ての状態を保持」していないと正しく計算できないため、**2次元テーブルが妥当**です。
