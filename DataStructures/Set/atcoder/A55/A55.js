const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let input = [];
rl.on('line', (line) => input.push(line));
rl.on('close', () => {
    const Q = parseInt(input[0]);
    const queries = input.slice(1);

    const cards = [];
    const result = [];

    function lowerBound(arr, x) {
        let left = 0,
            right = arr.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] < x) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }

    for (const line of queries) {
        const [type, xStr] = line.split(' ');
        const x = parseInt(xStr);
        if (type === '1') {
            // insert x in sorted order
            const idx = lowerBound(cards, x);
            cards.splice(idx, 0, x);
        } else if (type === '2') {
            // remove x
            const idx = lowerBound(cards, x);
            if (idx < cards.length && cards[idx] === x) {
                cards.splice(idx, 1);
            }
        } else if (type === '3') {
            // find smallest y >= x
            const idx = lowerBound(cards, x);
            if (idx < cards.length) {
                result.push(cards[idx]);
            } else {
                result.push(-1);
            }
        }
    }

    console.log(result.join('\n'));
});
