def insertion_sort(A, n, h):
    num_of_move = 0
    for i in range(h, n):
        x = A[i]
        j = i - h
        while j >= 0 and A[j] > x:
            A[j + h] = A[j]
            j -= h
            num_of_move += 1
        A[j + h] = x
    return num_of_move

def shell_sort(A, n, H):
    for h in H:
        num_of_move = insertion_sort(A, n, h)
        print(num_of_move)

# 入力処理
import sys
input = sys.stdin.read
data = input().split()

n = int(data[0])
A = list(map(int, data[1:n+1]))
k = int(data[n+1])
H = list(map(int, data[n+2:n+2+k]))

shell_sort(A, n, H)
