def main():
    import sys
    input = sys.stdin.read

    data = list(map(int, input().split()))
    N = data[0]
    A = data[1:]

    stack = []  # インデックスを保持
    result = [-1] * N

    for i in range(N):
        # 今の株価より小さいまたは同じ株価は使えない → pop
        while stack and A[stack[-1]] <= A[i]:
            stack.pop()

        # 残っていればそのインデックスが起算日（1-basedに直す）
        if stack:
            result[i] = stack[-1] + 1

        # 現在のインデックスをスタックに積む
        stack.append(i)

    print(' '.join(map(str, result)))

if __name__ == "__main__":
    main()
