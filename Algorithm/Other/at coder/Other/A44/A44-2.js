const fs = require('fs');

function main(input) {
    const lines = input.trim().split('\n');
    const [N, Q] = lines[0].split(' ').map(Number);

    const changes = new Map(); // 差分記録
    let reversed = false;
    const output = [];

    for (let i = 1; i <= Q; i++) {
        const tokens = lines[i].split(' ');
        const t = parseInt(tokens[0]);

        if (t === 1) {
            let x = parseInt(tokens[1]) - 1;
            const y = parseInt(tokens[2]);
            if (reversed) x = N - 1 - x;
            changes.set(x, y);
        } else if (t === 2) {
            reversed = !reversed;
        } else if (t === 3) {
            let x = parseInt(tokens[1]) - 1;
            if (reversed) x = N - 1 - x;
            output.push(changes.has(x) ? changes.get(x) : x + 1);
        }
    }

    console.log(output.join('\n'));
}

main(fs.readFileSync('/dev/stdin', 'utf8'));
