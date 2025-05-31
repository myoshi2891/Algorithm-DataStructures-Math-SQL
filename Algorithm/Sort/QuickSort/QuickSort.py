import sys
sys.setrecursionlimit(10**6)  # 再帰の上限を拡張

# 入力を受け取る
n = int(input())
A = list(map(int, input().split()))

count = 0  # スワップカウント用グローバル変数

def quick_sort(A, left, right):
    global count
    if left + 1 >= right:
        return

    pivot = A[right - 1]
    cur_index = left

    for i in range(left, right - 1):
        if A[i] < pivot:
            A[cur_index], A[i] = A[i], A[cur_index]
            cur_index += 1
            count += 1

    A[cur_index], A[right - 1] = A[right - 1], A[cur_index]

    quick_sort(A, left, cur_index)
    quick_sort(A, cur_index + 1, right)

# クイックソートを呼び出す
quick_sort(A, 0, n)

# 結果出力
print(' '.join(map(str, A)))
print(count)
