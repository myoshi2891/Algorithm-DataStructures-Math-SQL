# 入力
N, K = map(int, input().split())
students = [tuple(map(int, input().split())) for _ in range(N)]

# 体力でソート
students.sort(key=lambda x: x[0])

max_count = 0

for i in range(N):
    temp = []
    for j in range(i, N):
        if students[j][0] - students[i][0] > K:
            break
        temp.append(students[j])

    # 気力でソート
    temp.sort(key=lambda x: x[1])

    # スライディングウィンドウ（気力の差がK以内）
    l = 0
    for r in range(len(temp)):
        while temp[r][1] - temp[l][1] > K:
            l += 1
        max_count = max(max_count, r - l + 1)

print(max_count)
