const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf8').trim();

const [N, A] = input.split(' ').map(Number);

const r = A % N;

for (let i = 1; i <= 100000; i++) {
    if (i % N === r) {
        console.log(i);
    }
}
