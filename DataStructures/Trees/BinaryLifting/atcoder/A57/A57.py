import sys
input = sys.stdin.read
sys.setrecursionlimit(1 << 25)

def main():
    data = list(map(int, input().split()))
    idx = 0

    N = data[idx]; idx += 1
    Q = data[idx]; idx += 1
    A = [x - 1 for x in data[idx:idx + N]]  # 0-indexed
    idx += N

    LOG = 30  # 2^30 > 10^9

    # doubling[k][i] := i番の穴から2^k日後にいる穴
    doubling = [[0] * N for _ in range(LOG)]

    # 初期化（1日後）
    for i in range(N):
        doubling[0][i] = A[i]

    # ダブリングテーブル作成
    for k in range(1, LOG):
        for i in range(N):
            doubling[k][i] = doubling[k - 1][doubling[k - 1][i]]

    # クエリ処理
    result = []
    for q in range(Q):
        x = data[idx] - 1  # 0-indexed
        y = data[idx + 1]
        idx += 2

        for k in range(LOG):
            if (y >> k) & 1:
                x = doubling[k][x]

        result.append(x + 1)  # 1-indexed に戻す

    print('\n'.join(map(str, result)))

if __name__ == "__main__":
    main()
