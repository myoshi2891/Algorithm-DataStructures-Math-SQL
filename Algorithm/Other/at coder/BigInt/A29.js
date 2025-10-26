const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const MOD = 1000000007n; // BigIntのnを付ける

// BigInt版高速累乗
function modPow(a, b, mod) {
    let result = 1n;
    a = BigInt(a) % mod;
    b = BigInt(b);

    while (b > 0) {
        if (b % 2n === 1n) {
            result = (result * a) % mod;
        }
        a = (a * a) % mod;
        b = b / 2n;
    }

    return result;
}

let input = [];
rl.on('line', (line) => {
    input = line.trim().split(' ');
    rl.close();
});

rl.on('close', () => {
    const a = input[0];
    const b = input[1];
    console.log(modPow(a, b, MOD).toString()); // 出力は文字列に変換
});
