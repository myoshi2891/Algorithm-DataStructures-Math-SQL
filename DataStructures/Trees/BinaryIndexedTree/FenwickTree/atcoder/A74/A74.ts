import * as fs from 'fs';

const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/);
const N = Number(input[0]);
const grid: number[][] = [];

let idx = 1;
for (let i = 0; i < N; i++) {
    const row: number[] = [];
    for (let j = 0; j < N; j++) {
        row.push(Number(input[idx++]));
    }
    grid.push(row);
}

// 数字 k がどの位置 (行, 列) にあるか記録
const rowPos: number[] = Array(N + 1);
const colPos: number[] = Array(N + 1);

for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
        const val = grid[i][j];
        if (val !== 0) {
            rowPos[val] = i;
            colPos[val] = j;
        }
    }
}

// 各数字の現在位置の順列を構成
const rowPerm: number[] = [];
const colPerm: number[] = [];

for (let k = 1; k <= N; k++) {
    rowPerm.push(rowPos[k]);
    colPerm.push(colPos[k]);
}

// 転倒数を求める（Fenwick Treeで O(N log N)）
function countInversions(arr: number[]): number {
    const BIT: number[] = Array(N + 2).fill(0);
    let res = 0;

    const update = (i: number) => {
        i++;
        while (i <= N + 1) {
            BIT[i]++;
            i += i & -i;
        }
    };

    const query = (i: number): number => {
        i++;
        let sum = 0;
        while (i > 0) {
            sum += BIT[i];
            i -= i & -i;
        }
        return sum;
    };

    for (let i = arr.length - 1; i >= 0; i--) {
        res += query(arr[i] - 1);
        update(arr[i]);
    }

    return res;
}

const rowMoves = countInversions(rowPerm);
const colMoves = countInversions(colPerm);

console.log(rowMoves + colMoves);
