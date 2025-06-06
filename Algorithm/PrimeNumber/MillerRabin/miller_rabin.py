def mod_pow(base, exponent, modulus):
    result = 1
    base %= modulus
    while exponent > 0:
        if exponent & 1:
            result = (result * base) % modulus
        base = (base * base) % modulus
        exponent >>= 1
    return result

def miller_rabin(n):
    if n < 2:
        return False
    # 小さい素数チェック（高速化のため）
    small_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23]
    for sp in small_primes:
        if n == sp:
            return True
        if n % sp == 0 and n != sp:
            return False

    # n-1 = d * 2^r を求める
    d = n - 1
    r = 0
    while d % 2 == 0:
        d //= 2
        r += 1

    # 判定用の基数（1兆クラスならこのセットで十分信頼できる）
    test_bases = [2, 325, 9375, 28178, 450775, 9780504, 1795265022]

    for a in test_bases:
        if a % n == 0:
            return True
        x = mod_pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(r - 1):
            x = (x * x) % n
            if x == n - 1:
                break
        else:
            return False
    return True

N = int(input().strip())
print("YES" if miller_rabin(N) else "NO")
