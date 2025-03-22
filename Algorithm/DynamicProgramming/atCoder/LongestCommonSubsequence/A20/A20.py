def longest_common_subsequence(S: str, T: str) -> int:
    m, n = len(S), len(T)

    # メモリ削減のため 1D 配列を2つ使用
    prev = [0] * (n + 1)
    curr = [0] * (n + 1)

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if S[i - 1] == T[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = max(prev[j], curr[j - 1])
        # prev を curr に更新
        prev, curr = curr, prev

    return prev[n]

# 標準入力からデータを取得
if __name__ == "__main__":
    S = input().strip()
    T = input().strip()

    # LCS の長さを出力
    print(longest_common_subsequence(S, T))
