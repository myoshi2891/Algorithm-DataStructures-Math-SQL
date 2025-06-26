function extendedGCD(a: number, b: number): [number, number, number] {
    if (b === 0) return [1, 0, a];
    const [x1, y1, gcd] = extendedGCD(b, a % b);
    const x = y1;
    const y = x1 - Math.floor(a / b) * y1;
    return [x, y, gcd];
}

function modInverse(a: number, m: number): number {
    const [x, , gcd] = extendedGCD(a, m);
    if (gcd !== 1) throw new Error('mod inverse does not exist');
    return ((x % m) + m) % m;
}

function chineseRemainder(m1: number, m2: number, b1: number, b2: number): number {
    const M = m1 * m2;
    const m1_inv = modInverse(m1, m2);
    const m2_inv = modInverse(m2, m1);
    const term1 = b1 * m2 * m2_inv;
    const term2 = b2 * m1 * m1_inv;
    return (term1 + term2) % M;
}
