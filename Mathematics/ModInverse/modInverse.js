const fs = require('fs');
const [M, A] = fs.readFileSync(0, 'utf8').trim().split(' ').map(Number);

function modInverse(a, m) {
    let m0 = m;
    let x0 = 0,
        x1 = 1;

    while (a > 1) {
        const q = Math.floor(a / m);
        [a, m] = [m, a % m];
        [x0, x1] = [x1 - q * x0, x0];
    }

    if (x1 < 0) {
        x1 += m0;
    }

    return x1;
}

console.log(modInverse(A, M));
