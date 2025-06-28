def modpow(a: int, b: int, m: int) -> int:
    ans = 1
    while 0 < b:
        if b & 1 == 1:
            ans = (ans * a) % m
        a = (a * a) % m
        b >>= 1
    return ans
a: int
b: int
m: int
a, b, m = map(int, input().split())
print(modpow(a, b, m))