const fs = require('fs');

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const Q = parseInt(input[0], 10);

const stack = [];
const output = [];

for (let i = 1; i <= Q; i++) {
    const line = input[i];
    const [type, x] = line.split(' ');

    if (type === '1') {
        // クエリ1: 本を積む
        stack.push(x);
    } else if (type === '2') {
        // クエリ2: 一番上の本を出力
        output.push(stack[stack.length - 1]);
    } else if (type === '3') {
        // クエリ3: 一番上の本を取り除く
        stack.pop();
    }
}

console.log(output.join('\n'));
