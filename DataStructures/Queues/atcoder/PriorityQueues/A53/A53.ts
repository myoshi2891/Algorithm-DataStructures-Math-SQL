import * as fs from 'fs';

class MinHeap {
    private heap: number[] = [];

    insert(val: number): void {
        this.heap.push(val);
        this.bubbleUp();
    }

    getMin(): number {
        return this.heap[0];
    }

    removeMin(): number | undefined {
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0 && end !== undefined) {
            this.heap[0] = end;
            this.sinkDown();
        }
        return min;
    }

    private bubbleUp(): void {
        let idx = this.heap.length - 1;
        const element = this.heap[idx];

        while (idx > 0) {
            const parentIdx = Math.floor((idx - 1) / 2);
            const parent = this.heap[parentIdx];
            if (element >= parent) break;
            this.heap[parentIdx] = element;
            this.heap[idx] = parent;
            idx = parentIdx;
        }
    }

    private sinkDown(): void {
        let idx = 0;
        const length = this.heap.length;
        const element = this.heap[0];

        while (true) {
            let leftChildIdx = 2 * idx + 1;
            let rightChildIdx = 2 * idx + 2;
            let swap: number | null = null;

            if (leftChildIdx < length) {
                if (this.heap[leftChildIdx] < element) {
                    swap = leftChildIdx;
                }
            }

            if (rightChildIdx < length) {
                if (
                    (swap === null && this.heap[rightChildIdx] < element) ||
                    (swap !== null && this.heap[rightChildIdx] < this.heap[leftChildIdx])
                ) {
                    swap = rightChildIdx;
                }
            }

            if (swap === null) break;
            this.heap[idx] = this.heap[swap];
            this.heap[swap] = element;
            idx = swap;
        }
    }
}

// 標準入力の読み込み
const input: string = fs.readFileSync('/dev/stdin', 'utf-8');
const lines: string[] = input.trim().split('\n');
const Q: number = parseInt(lines[0]);
const heap = new MinHeap();
const output: number[] = [];

for (let i = 1; i <= Q; i++) {
    const parts = lines[i].split(' ').map(Number);
    if (parts[0] === 1) {
        heap.insert(parts[1]);
    } else if (parts[0] === 2) {
        output.push(heap.getMin());
    } else if (parts[0] === 3) {
        heap.removeMin();
    }
}

console.log(output.join('\n'));
