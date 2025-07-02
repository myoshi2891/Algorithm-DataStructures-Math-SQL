from typing import List, Tuple

def solve_lottery_problem(N: int, A: List[int], queries: List[Tuple[int, int]]) -> List[str]:
    # 累積和: acc[i] は A[0] から A[i-1] までの 1 の個数
    acc: List[int] = [0] * (N + 1)
    for i in range(N):
        acc[i + 1] = acc[i] + A[i]

    results: List[str] = []
    for L, R in queries:
        ones: int = acc[R] - acc[L - 1]
        total: int = R - L + 1
        zeros: int = total - ones
        if ones > zeros:
            results.append("win")
        elif zeros > ones:
            results.append("lose")
        else:
            results.append("draw")
    return results

def main() -> None:
    import sys
    input = sys.stdin.read
    data = input().split()

    N: int = int(data[0])
    A: List[int] = list(map(int, data[1:N+1]))
    Q: int = int(data[N+1])
    
    queries: List[Tuple[int, int]] = []
    index = N + 2
    for _ in range(Q):
        L: int = int(data[index])
        R: int = int(data[index + 1])
        queries.append((L, R))
        index += 2

    results = solve_lottery_problem(N, A, queries)
    print('\n'.join(results))

if __name__ == "__main__":
    main()

# ✅ 計算量
# 累積和構築: O(N)
# 各クエリ処理: O(1)
# 全体: O(N + Q)

# ✅ まとめ
# 型ヒントで可読性と安全性が向上
# acc（累積和）で高速にクエリ処理
# Python標準の sys.stdin.read() により高速な入力処理対応済み