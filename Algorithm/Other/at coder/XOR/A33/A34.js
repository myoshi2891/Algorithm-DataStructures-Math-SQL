function main(input) {
    const lines = input.trim().split('\n');
    const [N, X, Y] = lines[0].split(' ').map(Number);
    const A = lines[1].split(' ').map(Number);

    const MAX = 100000;
    const grundy = new Array(MAX + 1).fill(0);

    // Grundy数の前計算
    for (let i = 0; i <= MAX; i++) {
        const next = new Set();
        if (i >= X) next.add(grundy[i - X]);
        if (i >= Y) next.add(grundy[i - Y]);

        // メキシム（mex: 最小の非負整数）を求める
        let g = 0;
        while (next.has(g)) g++;
        grundy[i] = g;
    }

    // 各山に対応するGrundy数のXORを取る
    let xorSum = 0;
    for (const stones of A) {
        xorSum ^= grundy[stones];
    }

    console.log(xorSum === 0 ? 'Second' : 'First');
}

// 以下は標準入力処理用 (Node.jsで使用)
const fs = require('fs');
main(fs.readFileSync('/dev/stdin', 'utf8'));
