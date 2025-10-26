const fs = require('fs');

const [a, b] = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(' ').map(Number);

function extendedGCD(a, b) {
    if (b === 0) {
        return { gcd: a, x: 1, y: 0 };
    }
    let { gcd, x: x1, y: y1 } = extendedGCD(b, a % b);
    let x = y1;
    let y = x1 - Math.floor(a / b) * y1;
    return { gcd, x, y };
}

const obj = extendedGCD(a, b);
console.log(obj.x, obj.y);
