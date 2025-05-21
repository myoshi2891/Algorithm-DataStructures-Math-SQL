import sys
sys.setrecursionlimit(10000)

def solve(A):
    N = len(A)
    dp = [[None] * N for _ in range(N)]

    def dfs(l, r):
        if l == r:
            return A[l]
        if dp[l][r] is not None:
            return dp[l][r]

        taro_turn = (r - l + 1) % 2 == N % 2

        if taro_turn:
            dp[l][r] = max(dfs(l + 1, r), dfs(l, r - 1))
        else:
            dp[l][r] = min(dfs(l + 1, r), dfs(l, r - 1))

        return dp[l][r]

    return dfs(0, N - 1)

# ----------------------
# 入力処理
# ----------------------
def main():
    N = int(input())
    A = list(map(int, input().split()))
    print(solve(A))

if __name__ == "__main__":
    main()
