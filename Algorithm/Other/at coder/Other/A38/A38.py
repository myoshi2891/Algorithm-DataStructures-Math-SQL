def main():
    import sys
    input = sys.stdin.read
    data = input().split()

    D = int(data[0])
    N = int(data[1])
    
    # 各日の最大労働時間を24時間で初期化
    max_hours = [24] * D

    # 制約に基づいて制限
    index = 2
    for _ in range(N):
        L = int(data[index])
        R = int(data[index + 1])
        H = int(data[index + 2])
        index += 3
        for day in range(L - 1, R):
            max_hours[day] = min(max_hours[day], H)

    # 合計を出力
    print(sum(max_hours))

if __name__ == "__main__":
    main()
