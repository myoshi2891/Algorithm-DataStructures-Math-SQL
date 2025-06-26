const fs = require('fs');

function main(input) {
    const lines = input.trim().split('\n');
    const N = Number(lines[0]);
    const A = lines[1].split(' ').map(Number); // 難易度
    const B = lines[2].split(' ').map(Number); // 気温

    // 難易度は降順、気温は昇順にソート
    const sortedA = A.sort((a, b) => b - a);
    const sortedB = B.sort((a, b) => a - b);

    let totalEffort = 0;
    for (let i = 0; i < N; i++) {
        totalEffort += sortedA[i] * sortedB[i];
    }

    console.log(totalEffort);
}

// 標準入力の読み取り
main(fs.readFileSync('/dev/stdin', 'utf8'));
