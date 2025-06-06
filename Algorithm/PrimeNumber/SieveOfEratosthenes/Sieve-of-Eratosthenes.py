N = int(input().strip())

# Nが1以下なら素数ではない
if N <= 1:
    print("NO")
    exit()

# is_prime 配列を初期化
is_prime = [True] * (N + 1)
is_prime[0] = False
is_prime[1] = False

# エラトステネスの篩
for i in range(2, int(N**0.5) + 1):
    if is_prime[i]:
        for j in range(i * i, N + 1, i):
            is_prime[j] = False

# Nが素数ならYES、そうでなければNO
print("YES" if is_prime[N] else "NO")
