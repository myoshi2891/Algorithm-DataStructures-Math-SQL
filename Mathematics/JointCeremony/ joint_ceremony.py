n, a = map(int, input().split())

for i in range(1,100001):
    if a % n == i % n:
        print(i)