import sys
import bisect

def main():
    input = sys.stdin.read
    data = input().split()
    
    index = 0
    n = int(data[index])
    index += 1
    A = list(map(int, data[index:index + n]))
    index += n
    q = int(data[index])
    index += 1

    A.sort()  # 二分探索のためにソート

    results = []
    for _ in range(q):
        l = int(data[index])
        r = int(data[index + 1])
        index += 2

        # A の中で l 以上 r 以下の要素数を求める
        left = bisect.bisect_left(A, l)
        right = bisect.bisect_right(A, r)
        results.append(str(right - left))

    # 結果を出力
    print("\n".join(results))

if __name__ == "__main__":
    main()
