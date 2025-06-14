// 標準入力からの値取得（例: Node.js用）
const input = require('fs').readFileSync(0, 'utf-8').trim();
const [m1, m2, b1, b2] = input.split(' ').map(Number);

// 拡張ユークリッド互除法を用いて逆元を求める
function extendedGCD(a, b) {
    if (b === 0) return [1, 0, a];
    const [x1, y1, gcd] = extendedGCD(b, a % b);
    const x = y1;
    const y = x1 - Math.floor(a / b) * y1;
    return [x, y, gcd];
}

// m1のm2における逆元（mod m2）を求める
function modInverse(a, m) {
    const [x, , gcd] = extendedGCD(a, m);
    if (gcd !== 1) throw new Error('mod inverse does not exist');
    return ((x % m) + m) % m;
}

// 中国剰余定理によるZの計算
function chineseRemainder(m1, m2, b1, b2) {
    const M = m1 * m2;
    const m1_inv = modInverse(m1, m2);
    const m2_inv = modInverse(m2, m1);
    const term1 = b1 * m2 * m2_inv;
    const term2 = b2 * m1 * m1_inv;
    const Z = (term1 + term2) % M;
    return Z;
}

const result = chineseRemainder(m1, m2, b1, b2);
console.log(result);
