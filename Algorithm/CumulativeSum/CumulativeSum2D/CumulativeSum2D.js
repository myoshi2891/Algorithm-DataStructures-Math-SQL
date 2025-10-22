const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
let [HW, ...rest] = input.split('\n');
const [H, W] = HW.split(' ');
const grid = rest.splice(0, H).map((row) => row.split(' ').map(Number));

function twoDimensionalSum(grid) {
    const H = grid.length;
    const W = grid[0].length;

    const S = Array.from({ length: H + 1 }, () => Array(W + 1).fill(0));

    for (let i = 1; i <= H; i++) {
        for (let j = 1; j <= W; j++) {
            S[i][j] = grid[i - 1][j - 1] + S[i - 1][j] + S[i][j - 1] - S[i - 1][j - 1];
        }
    }
    return S;
}

function querySum(Sum, A, B, C, D) {
    return Sum[C][D] - Sum[A - 1][D] - Sum[C][B - 1] + Sum[A - 1][B - 1];
}

const Sum = twoDimensionalSum(grid);
let [num, ...questions] = rest;

questions.map((q) => {
    const [A, B, C, D] = q.split(' ').map(Number);
    console.log(querySum(Sum, A, B, C, D));
});
