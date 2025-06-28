const fs = require('fs');

// 入力読み取り
const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
const [A, B, M] = input.split(' ').map(Number);

// 繰り返し二乗法
function modPow(a, b, m) {
    let result = 1;
    a = a % m;
    while (b > 0) {
        if (b & 1) {
            result = (result * a) % m;
        }
        a = (a * a) % m;
        b >>= 1;
    }
    return result;
}

// 出力
console.log(modPow(A, B, M));
