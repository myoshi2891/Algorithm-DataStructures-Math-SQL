import * as readline from 'readline';

// 標準入力を読み込むための準備
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const inputLines: string[] = [];

rl.on('line', (line) => {
    inputLines.push(line);
}).on('close', () => {
    // 入力の処理
    const [N, S] = inputLines[0].split(' ').map(Number);
    const A = inputLines[1].split(' ').map(Number);

    // DPテーブル作成
    const dp: boolean[] = new Array(S + 1).fill(false);
    dp[0] = true; // 合計0は何も選ばないとき可能

    for (const a of A) {
        for (let j = S; j >= a; j--) {
            if (dp[j - a]) {
                dp[j] = true;
            }
        }
    }

    console.log(dp[S] ? 'Yes' : 'No');
});
