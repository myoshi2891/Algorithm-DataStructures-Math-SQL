function canPaintTiles(N, S) {
    for (let i = 0; i <= N - 3; i++) {
        if (S[i] === S[i + 1] && S[i + 1] === S[i + 2]) {
            return 'Yes';
        }
    }
    return 'No';
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const input = [];

rl.on('line', (line) => {
    input.push(line.trim());
}).on('close', () => {
    const N = parseInt(input[0]);
    const S = input[1];
    console.log(canPaintTiles(N, S));
});
