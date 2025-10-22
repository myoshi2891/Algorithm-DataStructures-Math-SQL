import * as fs from 'fs';

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [H, W, K] = input[0].split(' ').map(Number);
const grid: string[][] = input.slice(1).map((line) => line.split(''));

let maxBlack = 0;

for (let bit = 0; bit < 1 << H; bit++) {
    const paintedRows: number[] = [];
    for (let i = 0; i < H; i++) {
        if ((bit >> i) & 1) paintedRows.push(i);
    }

    const rowPaintCount = paintedRows.length;
    if (rowPaintCount > K) continue;

    // 塗り操作のコピー
    const painted: string[][] = grid.map((row) => [...row]);

    // 行を黒に塗る
    for (const row of paintedRows) {
        for (let j = 0; j < W; j++) {
            painted[row][j] = '#';
        }
    }

    // 各列の黒マス数
    const blackCountPerCol: number[] = new Array(W).fill(0);
    for (let j = 0; j < W; j++) {
        for (let i = 0; i < H; i++) {
            if (painted[i][j] === '#') {
                blackCountPerCol[j]++;
            }
        }
    }

    // 残り操作回数で列を貪欲に選ぶ
    const columnGain: [number, number][] = [];
    for (let j = 0; j < W; j++) {
        const gain = H - blackCountPerCol[j];
        columnGain.push([gain, j]);
    }

    columnGain.sort((a, b) => b[0] - a[0]);

    const columnsToPaint = new Set<number>();
    const remainingCols = K - rowPaintCount;
    for (let i = 0; i < Math.min(remainingCols, columnGain.length); i++) {
        columnsToPaint.add(columnGain[i][1]);
    }

    // 黒マス合計を計算
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
