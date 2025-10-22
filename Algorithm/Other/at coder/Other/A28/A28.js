// 標準入力を受け取るための準備（AtCoderなどを想定）
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let input = [];
rl.on('line', (line) => {
    input.push(line.trim());
});

rl.on('close', () => {
    const N = Number(input[0]);
    let current = 0;

    for (let i = 1; i <= N; i++) {
        const [op, numStr] = input[i].split(' ');
        const num = Number(numStr);

        if (op === '+') {
            current += num;
        } else if (op === '-') {
            current -= num;
        } else if (op === '*') {
            current *= num;
        }

        current %= 10000; // 10000で割った余りを取る

        if (current < 0) current += 10000; // 念のため、負になることがないように

        console.log(current);
    }
});
