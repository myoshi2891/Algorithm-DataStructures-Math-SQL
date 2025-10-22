import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const input: string[] = [];

rl.on('line', (line) => {
    input.push(line.trim());
}).on('close', () => {
    const T = Number(input[0]);
    const ops: [number, number, number][] = input.slice(1).map((line) => {
        const [p, q, r] = line.split(' ').map((v) => Number(v) - 1); // 0-indexed
        return [p, q, r];
    });

    const X = new Int8Array(20); // 配列X（20要素）
    let zeroCount = 20; // 現在の0の個数
    const result: string[] = [];

    for (let i = 0; i < T; i++) {
        const [p, q, r] = ops[i];
        const indices = [p, q, r];

        // A操作（+1）によるスコア変化
        let gainA = 0;
        for (const idx of indices) {
            if (X[idx] === 0) gainA--;
            if (X[idx] + 1 === 0) gainA++;
        }

        // B操作（-1）によるスコア変化
        let gainB = 0;
        for (const idx of indices) {
            if (X[idx] === 0) gainB--;
            if (X[idx] - 1 === 0) gainB++;
        }

        if (zeroCount + gainA >= zeroCount + gainB) {
            // 操作Aを選択
            result.push('A');
            for (const idx of indices) {
                if (X[idx] === 0) zeroCount--;
                X[idx]++;
                if (X[idx] === 0) zeroCount++;
            }
        } else {
            // 操作Bを選択
            result.push('B');
            for (const idx of indices) {
                if (X[idx] === 0) zeroCount--;
                X[idx]--;
                if (X[idx] === 0) zeroCount++;
            }
        }
    }

    console.log(result.join('\n'));
});
