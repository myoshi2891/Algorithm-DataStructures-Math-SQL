from collections import Counter
import sys

def main():
    # 入力の読み取り
    N = int(sys.stdin.readline())
    A = list(map(int, sys.stdin.readline().split()))

    # 長さごとの本数をカウント
    count = Counter(A)

    result = 0
    for c in count.values():
        if c >= 3:
            result += c * (c - 1) * (c - 2) // 6  # C(c, 3)

    print(result)

if __name__ == "__main__":
    main()
