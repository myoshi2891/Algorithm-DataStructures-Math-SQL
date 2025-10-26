const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let N = 0,
    L = 0,
    lineCount = 0;
let maxTime = 0;

rl.on('line', (line) => {
    if (lineCount === 0) {
        // 最初の行：N, L を読み取る
        const [N_str, L_str] = line.trim().split(' ');
        N = parseInt(N_str);
        L = parseInt(L_str);
    } else {
        // 各人の位置と方向を処理
        const [A_str, B] = line.trim().split(' ');
        const A = parseInt(A_str);

        const time = B === 'E' ? L - A : A;
        if (time > maxTime) {
            maxTime = time;
        }
    }

    lineCount++;
    if (lineCount > N) {
        console.log(maxTime);
        rl.close();
    }
});
