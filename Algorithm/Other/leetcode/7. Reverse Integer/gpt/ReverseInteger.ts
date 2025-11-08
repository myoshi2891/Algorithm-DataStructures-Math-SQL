import * as fs from 'fs';

const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
const x = parseInt(input);

/**
 * 32ビット整数の範囲
 */
const INT_MIN = -(2 ** 31);
const INT_MAX = 2 ** 31 - 1;

function reverse(x: number): number {
    let result = 0;
    let num = x;

    while (num !== 0) {
        const digit = num % 10 | 0; // 小数点対策で |0 して整数化
        num = (num / 10) | 0;

        // resultが次の桁を追加したときにオーバーフローしないか確認
        if (
            result > Math.floor(INT_MAX / 10) ||
            (result === Math.floor(INT_MAX / 10) && digit > 7)
        ) {
            return 0;
        }
        if (
            result < Math.ceil(INT_MIN / 10) ||
            (result === Math.ceil(INT_MIN / 10) && digit < -8)
        ) {
            return 0;
        }

        result = result * 10 + digit;
    }

    return result;
}

console.log(reverse(x));
