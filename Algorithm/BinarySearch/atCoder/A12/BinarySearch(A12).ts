import * as fs from 'fs';

const input: string = fs.readFileSync('/dev/stdin').toString().trim();
const lines: string[] = input.split('\n');

const [N, K]: number[] = lines[0].split(' ').map(Number);
const A: number[] = lines[1].split(' ').map(Number);

function findPrintTime(N: number, K: number, A: number[]): void {
    const minA: number = Math.min(...A);
    let left: number = 1,
        right: number = K * minA;

    const canPrintK = (T: number): boolean => A.reduce((sum, i) => sum + Math.floor(T / i), 0) >= K;

    while (left < right) {
        const mid: number = Math.floor((left + right) / 2);
        if (canPrintK(mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }

    console.log(left);
}

findPrintTime(N, K, A);
