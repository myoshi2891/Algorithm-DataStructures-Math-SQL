const fs = require('fs');

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [H, W, K] = input[0].split(' ').map(Number);
const grid = input.slice(1).map((line) => line.split(''));

let maxBlack = 0;

for (let bit = 0; bit < 1 << H; bit++) {
    const paintedRows = [];
    for (let i = 0; i < H; i++) {
        if ((bit >> i) & 1) paintedRows.push(i);
    }
    const rowPaintCount = paintedRows.length;
    if (rowPaintCount > K) continue;

    const painted = Array.from({ length: H }, (_, i) => grid[i].slice());

    // 行を黒く塗る
    for (const row of paintedRows) {
        for (let j = 0; j < W; j++) {
            painted[row][j] = '#';
        }
    }

    // 各列の黒マス数を数える
    const blackCountPerCol = Array(W).fill(0);
    for (let j = 0; j < W; j++) {
        for (let i = 0; i < H; i++) {
            if (painted[i][j] === '#') blackCountPerCol[j]++;
        }
    }

    // 残りの操作回数で列を黒く塗る（貪欲に黒マスの増加が大きいものを選ぶ）
    const columnGain = [];
    for (let j = 0; j < W; j++) {
        const gain = H - blackCountPerCol[j];
        columnGain.push([gain, j]);
    }
    columnGain.sort((a, b) => b[0] - a[0]);

    const columnsToPaint = new Set();
    for (let i = 0; i < K - rowPaintCount && i < columnGain.length; i++) {
        columnsToPaint.add(columnGain[i][1]);
    }

    // 合計黒マス数を数える
    let totalBlack = 0;
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++) {
            if (painted[i][j] === '#' || columnsToPaint.has(j)) {
                totalBlack++;
            }
        }
    }

    maxBlack = Math.max(maxBlack, totalBlack);
}

console.log(maxBlack);
