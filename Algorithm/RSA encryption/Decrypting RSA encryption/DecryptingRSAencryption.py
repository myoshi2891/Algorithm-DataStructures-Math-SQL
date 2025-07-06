from typing import Tuple

def extgcd(a: int, b: int) -> Tuple[int, int, int]:
    if b != 0:
        c, y, x = extgcd(b, a % b)
        y -= (a // b) * x
        return c, x, y
    return a, 1, 0


def modpow(a: int, b: int, m: int) -> int:
    ans = 1
    while 0 < b:
        if b & 1 == 1:
            ans = (ans * a) % m
        a = (a * a) % m
        b >>= 1
    return ans


p, q, e, E = map(int, input().split())
n = p * q
n_prime = (p - 1) * (q - 1)

c, x, y = extgcd(e, n_prime)
d = (x + n_prime) % n_prime
M = modpow(E, d, n)

print(chr(M))