const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf8');

function countEquilateralTriangles(input) {
    const lines = input.trim().split('\n');
    const N = parseInt(lines[0], 10);
    const A = lines[1].split(' ').map(Number);

    // 長さごとにカウント（1 <= Ai <= 100）
    const count = Array(101).fill(0);
    for (let i = 0; i < N; i++) {
        count[A[i]]++;
    }

    // 長さごとの3本の組み合わせを計算
    let result = 0;
    for (let i = 1; i <= 100; i++) {
        if (count[i] >= 3) {
            const c = count[i];
            result += (c * (c - 1) * (c - 2)) / 6; // 組み合わせC(n,3)
        }
    }

    console.log(result);
}

countEquilateralTriangles(input);
