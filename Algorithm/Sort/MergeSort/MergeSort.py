import sys
sys.setrecursionlimit(1 << 25)

# グローバル変数
count = 0

def merge(A, left, mid, right):
    global count
    INF = float('inf')

    nl = mid - left
    nr = right - mid

    L = A[left:mid] + [INF]
    R = A[mid:right] + [INF]

    lindex = 0
    rindex = 0

    for i in range(left, right):
        if L[lindex] < R[rindex]:
            A[i] = L[lindex]
            lindex += 1
        else:
            A[i] = R[rindex]
            rindex += 1
            count += 1

def merge_sort(A, left, right):
    if left + 1 < right:
        mid = (left + right) // 2
        merge_sort(A, left, mid)
        merge_sort(A, mid, right)
        merge(A, left, mid, right)

# 入力処理
n = int(sys.stdin.readline())
A = list(map(int, sys.stdin.readline().split()))

merge_sort(A, 0, n)

# 出力
print(' '.join(map(str, A)))
print(count)
