# この問題は最長増加部分列（Longest Increasing Subsequence, LIS）を求める問題です。動的プログラミングを使って解決します。この解答の特徴を説明します：

# ## アルゴリズムの説明

# 1. **動的プログラミング（DP）アプローチ**：
#    - `dp[i]` = i番目の木を最後とする増加部分列の最大長
#    - 各木について、その木より前にある全ての木をチェック
#    - 前の木の高さが現在の木より低い場合、その部分列に現在の木を追加可能

# 2. **状態遷移**：
#    - `dp[i] = max(dp[i], dp[j] + 1)` （j < i かつ heights[j] < heights[i]の場合）

# ## 計算量の分析

# - **時間計算量**: O(n²)
#   - 外側のループがn回、内側のループが最大n回
#   - n ≤ 5,000なので、最大25,000,000回の操作で十分高速

# - **空間計算量**: O(n)
#   - dpテーブルとheightsリストのみ使用

# ## 型の明示とメモリ効率

# - 全ての変数に型ヒントを明示
# - リストは事前にサイズが分かる場合は初期化
# - 不要な中間変数を避けてメモリ使用量を最小化

# ## 入力例1の動作確認

# 入力: `[100, 102, 101, 91, 199]`
# - dp[0] = 1 (100のみ)
# - dp[1] = 2 (100→102)
# - dp[2] = 2 (100→101)
# - dp[3] = 1 (91のみ)
# - dp[4] = 3 (100→101→199 または 100→102→199)

# 最大値は3なので、出力は3となります。


def longest_increasing_subsequence(n: int, heights: list[int]) -> int:
    """
    最長増加部分列の長さを求める関数

    Parameters:
    n (int): 木の本数
    heights (list[int]): 各木の高さのリスト

    Returns:
    int: 最長増加部分列の長さ（残せる木の最大本数）

    時間計算量: O(n^2)
    空間計算量: O(n)
    """
    # dp[i] = i番目の木を最後とする増加部分列の最大長
    dp: list[int] = [1] * n

    # 各木について、その木を最後とする最長増加部分列の長さを計算
    for i in range(1, n):
        # i番目の木より前の全ての木をチェック
        for j in range(i):
            # j番目の木の高さがi番目の木の高さより小さい場合
            if heights[j] < heights[i]:
                # j番目の木を最後とする部分列にi番目の木を追加
                dp[i] = max(dp[i], dp[j] + 1)

    # 全てのdp値の中で最大値を返す
    return max(dp)


def main() -> None:
    """
    メイン処理関数
    標準入力から値を読み取り、結果を出力する
    """
    # 標準入力から木の本数を読み取り
    n: int = int(input().strip())

    # 各木の高さを読み取り
    heights: list[int] = []
    for _ in range(n):
        height: int = int(input().strip())
        heights.append(height)

    # 最長増加部分列の長さを計算
    result: int = longest_increasing_subsequence(n, heights)

    # 結果を出力
    print(result)


if __name__ == "__main__":
    main()
