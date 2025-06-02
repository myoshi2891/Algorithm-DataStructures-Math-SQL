import sys

def main():
    input = sys.stdin.readline
    n = int(input())
    movies = []

    for _ in range(n):
        l, r = map(int, input().split())
        movies.append((r, l))  # 終了時間でソートしたいので (終了, 開始)

    # 終了時間で昇順ソート
    movies.sort()

    count = 0
    current_time = 0

    for r, l in movies:
        if l >= current_time:
            count += 1
            current_time = r

    print(count)

if __name__ == '__main__':
    main()
