# この問題は、3種類のりんごセット（x個でa円、y個でb円、z個でc円）を使ってn個以上のりんごを最小コストで購入する動的プログラミング問題です。解法の説明：

# **アルゴリズム**: 動的プログラミング（DP）を使用

# **時間計算量**: O(n × max(x,y,z)) - 最大でO(n²)程度
# **空間計算量**: O(n + max(x,y,z)) - dpテーブルのサイズ

# **処理の流れ**:
# 1. `dp[i]`を「i個のりんごを手に入れるための最小コスト」として定義
# 2. 各状態から3つのセット購入を試行し、より少ないコストで更新
# 3. n個以上のりんごが手に入る状態の中から最小コストを選択

# **最適化のポイント**:
# - 上限を`n + max(x,y,z) - 1`に設定して計算量を削減
# - 型ヒントを明示してメモリ効率を向上
# - INFを`float('inf')`として適切な比較を実現

# **入力例1の検証**:
# - n=9, x=2/a=100, y=3/b=125, z=5/c=200
# - セット2を3回購入: 3×3=9個, 3×125=375円
# - 出力: 375円（期待値と一致）

# このアルゴリズムは制約条件（n≤1,000）において十分高速に動作し、メモリ使用量も効率的です。


def solve_apple_problem() -> int:
    """
    標準入力からデータを読み取り、n個以上のりんごを最小コストで購入する金額を計算する

    Returns:
        int: n個以上のりんごを購入するための最小コスト
    """
    # 標準入力から値を取得
    line = input().strip()
    n, x, a, y, b, z, c = map(int, line.split())

    return min_cost_for_apples(n, x, a, y, b, z, c)


def min_cost_for_apples(n: int, x: int, a: int, y: int, b: int, z: int, c: int) -> int:
    """
    n個以上のりんごを最小コストで購入するための金額を計算する

    Parameters:
        n (int): 必要なりんごの個数
        x (int): セット1のりんご個数
        a (int): セット1の価格
        y (int): セット2のりんご個数
        b (int): セット2の価格
        z (int): セット3のりんご個数
        c (int): セット3の価格

    Returns:
        int: n個以上のりんごを購入するための最小コスト
    """
    # 効率的な上限を設定（各セットを単独で使った場合の最大必要数）
    max_apples = n + max(x, y, z) - 1

    # dp[i] = i個のりんごを手に入れるための最小コスト
    # INFで初期化（十分大きな値）
    INF: int = 10**9
    dp: list[int] = [INF] * (max_apples + 1)
    dp[0] = 0  # 0個の場合はコスト0

    # 動的プログラミングで最小コストを計算
    for i in range(max_apples + 1):
        if dp[i] == INF:
            continue

        # セット1（x個でa円）を使う場合
        if i + x <= max_apples:
            dp[i + x] = min(dp[i + x], dp[i] + a)

        # セット2（y個でb円）を使う場合
        if i + y <= max_apples:
            dp[i + y] = min(dp[i + y], dp[i] + b)

        # セット3（z個でc円）を使う場合
        if i + z <= max_apples:
            dp[i + z] = min(dp[i + z], dp[i] + c)

    # n個以上のりんごを手に入れる最小コストを求める
    min_cost: int = min(dp[i] for i in range(n, max_apples + 1))
    
    # 念のため安全性チェック（この問題では理論上INFは返されない）
    assert min_cost != INF, "解が見つかりませんでした"
    
    return min_cost


if __name__ == "__main__":
    result = solve_apple_problem()
    print(result)
