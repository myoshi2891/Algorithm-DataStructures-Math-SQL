const fs = require('fs');

// 入力をすべて読み込んで行ごとに分割
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');

const Q = parseInt(input[0], 10);
const scores = new Map();
const output = [];

for (let i = 1; i <= Q; i++) {
    const parts = input[i].split(' ');
    const type = parseInt(parts[0]);

    if (type === 1) {
        const name = parts[1];
        const score = parseInt(parts[2]);
        scores.set(name, score);
    } else if (type === 2) {
        const name = parts[1];
        output.push(scores.get(name));
    }
}

// 出力
console.log(output.join('\n'));
