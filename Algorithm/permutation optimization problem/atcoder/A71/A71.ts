import * as fs from 'fs';

function main(input: string): void {
    const lines = input.trim().split('\n');
    const N = Number(lines[0]);
    const A: number[] = lines[1].split(' ').map(Number); // 難易度
    const B: number[] = lines[2].split(' ').map(Number); // 気温

    // 難易度を降順、気温を昇順でソート
    const sortedA = [...A].sort((a, b) => b - a);
    const sortedB = [...B].sort((a, b) => a - b);

    let totalEffort = 0;
    for (let i = 0; i < N; i++) {
        totalEffort += sortedA[i] * sortedB[i];
    }

    console.log(totalEffort);
}

// 標準入力から受け取って処理する
main(fs.readFileSync('/dev/stdin', 'utf8'));
