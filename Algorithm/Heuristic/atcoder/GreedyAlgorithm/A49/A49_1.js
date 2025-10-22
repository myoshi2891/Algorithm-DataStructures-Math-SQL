const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let input = [];

rl.on('line', (line) => {
    input.push(line.trim());
}).on('close', () => {
    const T = parseInt(input[0]);
    const ops = input.slice(1).map((line) => line.split(' ').map(Number));

    const X = Array(20).fill(0); // 初期配列
    const res = [];

    for (let i = 0; i < T; i++) {
        const [p, q, r] = ops[i].map((x) => x - 1); // 0-indexed

        // シミュレート
        // A操作（+1）
        X[p]++;
        X[q]++;
        X[r]++;
        const scoreA = X.filter((v) => v === 0).length;
        X[p]--;
        X[q]--;
        X[r]--;

        // B操作（-1）
        X[p]--;
        X[q]--;
        X[r]--;
        const scoreB = X.filter((v) => v === 0).length;
        X[p]++;
        X[q]++;
        X[r]++;

        if (scoreA >= scoreB) {
            res.push('A');
            X[p]++;
            X[q]++;
            X[r]++;
        } else {
            res.push('B');
            X[p]--;
            X[q]--;
            X[r]--;
        }
    }

    console.log(res.join('\n'));
});
