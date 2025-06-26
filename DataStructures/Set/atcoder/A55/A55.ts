import * as fs from 'fs';

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');

const Q = Number(input[0]);
const queries = input.slice(1);

const cards: number[] = [];
const result: number[] = [];

// 二分探索で x 以上の最小のインデックスを返す
function lowerBound(arr: number[], x: number): number {
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

for (let i = 0; i < Q; i++) {
    const [typeStr, xStr] = queries[i].split(' ');
    const type = Number(typeStr);
    const x = Number(xStr);

    if (type === 1) {
        const idx = lowerBound(cards, x);
        cards.splice(idx, 0, x);
    } else if (type === 2) {
        const idx = lowerBound(cards, x);
        if (idx < cards.length && cards[idx] === x) {
            cards.splice(idx, 1);
        }
    } else if (type === 3) {
        const idx = lowerBound(cards, x);
        result.push(idx < cards.length ? cards[idx] : -1);
    }
}

console.log(result.join('\n'));
