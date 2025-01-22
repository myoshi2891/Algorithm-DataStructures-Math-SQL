def main():
    import sys
    input = sys.stdin.read
    data = input().splitlines()

    # N と Q を取得
    N, Q = map(int, data[0].split())

    # 来場者数データを取得
    A = list(map(int, data[1].split()))

    # 累積和を計算
    prefix_sum = [0] * (N + 1)
    for i in range(1, N + 1):
        prefix_sum[i] = prefix_sum[i - 1] + A[i - 1]

    # 質問を処理
    results = []
    for i in range(Q):
        L, R = map(int, data[2 + i].split())
        # L 日目から R 日目までの合計を計算
        results.append(prefix_sum[R] - prefix_sum[L - 1])

    # 結果を出力
    print("\n".join(map(str, results)))

if __name__ == "__main__":
    main()
