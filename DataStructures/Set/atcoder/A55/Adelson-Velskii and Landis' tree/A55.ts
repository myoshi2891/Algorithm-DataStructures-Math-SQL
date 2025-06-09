import * as fs from 'fs';

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const Q = Number(input[0]);
const queries = input.slice(1);

// --- AVL Tree Implementation ---
class AVLNode {
    value: number;
    height: number;
    left: AVLNode | null = null;
    right: AVLNode | null = null;

    constructor(value: number) {
        this.value = value;
        this.height = 1;
    }
}

class AVLTree {
    root: AVLNode | null = null;

    height(node: AVLNode | null): number {
        return node ? node.height : 0;
    }

    updateHeight(node: AVLNode): void {
        node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;
    }

    balanceFactor(node: AVLNode): number {
        return this.height(node.left) - this.height(node.right);
    }

    rotateRight(y: AVLNode): AVLNode {
        const x = y.left!;
        y.left = x.right;
        x.right = y;
        this.updateHeight(y);
        this.updateHeight(x);
        return x;
    }

    rotateLeft(x: AVLNode): AVLNode {
        const y = x.right!;
        x.right = y.left;
        y.left = x;
        this.updateHeight(x);
        this.updateHeight(y);
        return y;
    }

    balance(node: AVLNode): AVLNode {
        this.updateHeight(node);
        const bf = this.balanceFactor(node);

        if (bf > 1) {
            if (this.balanceFactor(node.left!) < 0) {
                node.left = this.rotateLeft(node.left!);
            }
            return this.rotateRight(node);
        }

        if (bf < -1) {
            if (this.balanceFactor(node.right!) > 0) {
                node.right = this.rotateRight(node.right!);
            }
            return this.rotateLeft(node);
        }

        return node;
    }

    insert(value: number): void {
        this.root = this._insert(this.root, value);
    }

    private _insert(node: AVLNode | null, value: number): AVLNode {
        if (!node) return new AVLNode(value);

        if (value < node.value) {
            node.left = this._insert(node.left, value);
        } else {
            node.right = this._insert(node.right, value);
        }

        return this.balance(node);
    }

    delete(value: number): void {
        this.root = this._delete(this.root, value);
    }

    private _delete(node: AVLNode | null, value: number): AVLNode | null {
        if (!node) return null;

        if (value < node.value) {
            node.left = this._delete(node.left, value);
        } else if (value > node.value) {
            node.right = this._delete(node.right, value);
        } else {
            if (!node.left || !node.right) {
                return node.left || node.right;
            } else {
                const minLargerNode = this.findMin(node.right);
                node.value = minLargerNode.value;
                node.right = this._delete(node.right, minLargerNode.value);
            }
        }

        return this.balance(node);
    }

    findMin(node: AVLNode): AVLNode {
        while (node.left) node = node.left;
        return node;
    }

    // Returns the smallest value >= x, or null if not found
    lowerBound(x: number): number | null {
        let node = this.root;
        let res: number | null = null;
        while (node) {
            if (node.value >= x) {
                res = node.value;
                node = node.left;
            } else {
                node = node.right;
            }
        }
        return res;
    }
}

// --- Main Logic ---
const tree = new AVLTree();
const result: number[] = [];

for (const line of queries) {
    const [typeStr, xStr] = line.split(' ');
    const type = Number(typeStr);
    const x = Number(xStr);

    if (type === 1) {
        tree.insert(x);
    } else if (type === 2) {
        tree.delete(x);
    } else if (type === 3) {
        const res = tree.lowerBound(x);
        result.push(res !== null ? res : -1);
    }
}

console.log(result.join('\n'));
