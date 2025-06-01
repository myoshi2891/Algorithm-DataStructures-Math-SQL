import sys

def main():
    input = sys.stdin.read
    data = input().split()

    N = int(data[0])
    Q = int(data[1])

    changes = {}  # 差分記録
    reversed_flag = False
    output = []

    idx = 2  # クエリ読み取り開始位置

    for _ in range(Q):
        t = int(data[idx])

        if t == 1:
            x = int(data[idx + 1])
            y = int(data[idx + 2])
            real_x = N - x if reversed_flag else x - 1
            changes[real_x] = y
            idx += 3

        elif t == 2:
            reversed_flag = not reversed_flag
            idx += 1

        elif t == 3:
            x = int(data[idx + 1])
            real_x = N - x if reversed_flag else x - 1
            value = changes.get(real_x, real_x + 1)
            output.append(str(value))
            idx += 2

    print('\n'.join(output))

if __name__ == "__main__":
    main()
