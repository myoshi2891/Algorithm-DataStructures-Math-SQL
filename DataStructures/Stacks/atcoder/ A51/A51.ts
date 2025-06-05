import * as fs from 'fs';

const input: string[] = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const Q: number = parseInt(input[0], 10);

const stack: string[] = [];
const output: string[] = [];

for (let i = 1; i <= Q; i++) {
    const line = input[i];
    const [type, x] = line.split(' ');

    if (type === '1') {
        stack.push(x);
    } else if (type === '2') {
        output.push(stack[stack.length - 1]);
    } else if (type === '3') {
        stack.pop();
    }
}

console.log(output.join('\n'));
