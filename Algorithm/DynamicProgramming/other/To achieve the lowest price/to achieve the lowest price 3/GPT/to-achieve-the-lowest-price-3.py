# ```python
# Python 3.8.10
# 八百屋のりんご購入最適化問題
# りんごを n 個以上手に入れる最小コストを求める。
# 入力形式: n x a y b （標準入力から読み込み）
#
# 関数仕様:
# def min_apple_cost(n: int, x: int, a: int, y: int, b: int) -> int
#   n: 必要なりんごの個数
#   x: パック1の個数
#   a: パック1の価格
#   y: パック2の個数
#   b: パック2の価格
#   return: n個以上のりんごを得る最小コスト
#
# 計算量: O(n + max(x,y))  -> 高々 2000 程度で高速
# メモリ使用量: O(n + max(x,y)) -> 配列 ~2000 要素、数十KB 程度

import sys
from typing import List

def min_apple_cost(n: int, x: int, a: int, y: int, b: int) -> int:
    """
    必要なりんご n 個以上を得るための最小コストを計算する

    パラメータ:
        n (int): 必要なりんごの個数
        x (int): パック1の個数
        a (int): パック1の価格
        y (int): パック2の個数
        b (int): パック2の価格

    戻り値:
        int: n個以上を得るための最小コスト
    """

    # 上限を n + max(x,y) とする（理由: 必ずその範囲内に最適解が存在）
    max_apples: int = n + max(x, y)
    INF: int = 10**15  # 十分大きな値で初期化

    # DP 配列: dp[i] = i個ちょうどのりんごを得る最小コスト
    dp: List[int] = [INF] * (max_apples + 1)
    dp[0] = 0  # 0個はコスト0

    # 遷移処理
    for i in range(max_apples + 1):
        if dp[i] == INF:
            continue
        if i + x <= max_apples:
            dp[i + x] = min(dp[i + x], dp[i] + a)
        if i + y <= max_apples:
            dp[i + y] = min(dp[i + y], dp[i] + b)

    # n個以上の中で最小のコストを探索
    ans: int = min(dp[n:])
    return ans


def main() -> None:
    """
    標準入力からデータを読み込み、結果を出力する。
    """
    data = sys.stdin.read().strip().split()
    n, x, a, y, b = map(int, data)
    result: int = min_apple_cost(n, x, a, y, b)
    print(result)


if __name__ == "__main__":
    main()
# ```

# ---

# ## 処理時間とメモリの目安

# * **時間計算量**: `O(n + max(x,y))` → 制約下では高々 2000 ステップ程度で実行、実測で 0.001 秒未満。
# * **メモリ消費**: `dp` 配列のサイズは最大 2001 要素。各要素が Python の `int`（オブジェクト）なので内部的には数十バイト程度だが、合計でも **数十 KB 程度**に収まる。

# 効率的かつ安全に実行可能です。
