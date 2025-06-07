const fs = require('fs');

class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(val) {
        this.heap.push(val);
        this._bubbleUp();
    }

    getMin() {
        return this.heap[0];
    }

    removeMin() {
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this._sinkDown();
        }
        return min;
    }

    _bubbleUp() {
        let idx = this.heap.length - 1;
        const element = this.heap[idx];
        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2);
            let parent = this.heap[parentIdx];
            if (element >= parent) break;
            this.heap[parentIdx] = element;
            this.heap[idx] = parent;
            idx = parentIdx;
        }
    }

    _sinkDown() {
        let idx = 0;
        const length = this.heap.length;
        const element = this.heap[0];
        while (true) {
            let leftIdx = 2 * idx + 1;
            let rightIdx = 2 * idx + 2;
            let swap = null;

            if (leftIdx < length) {
                if (this.heap[leftIdx] < element) {
                    swap = leftIdx;
                }
            }

            if (rightIdx < length) {
                if (
                    (swap === null && this.heap[rightIdx] < element) ||
                    (swap !== null && this.heap[rightIdx] < this.heap[leftIdx])
                ) {
                    swap = rightIdx;
                }
            }

            if (swap === null) break;
            this.heap[idx] = this.heap[swap];
            this.heap[swap] = element;
            idx = swap;
        }
    }
}

const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\n');
const Q = parseInt(input[0]);
const heap = new MinHeap();
const output = [];

for (let i = 1; i <= Q; i++) {
    const parts = input[i].split(' ').map(Number);
    if (parts[0] === 1) {
        heap.insert(parts[1]);
    } else if (parts[0] === 2) {
        output.push(heap.getMin());
    } else if (parts[0] === 3) {
        heap.removeMin();
    }
}

console.log(output.join('\n'));
