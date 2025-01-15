class SegmentTree {
	constructor(arr) {
		this.n = arr.length;
		this.tree = new Array(4 * this.n);
		this.build(arr, 0, 0, this.n - 1);
	}

	build(arr, node, start, end) {
		if (start === end) {
			this.tree[node] = arr[start];
		} else {
			const mid = Math.floor((start + end) / 2);
			this.build(arr, 2 * node + 1, start, mid);
			this.build(arr, 2 * node + 2, mid + 1, end);
			this.tree[node] = Math.max(
				this.tree[2 * node + 1],
				this.tree[2 * node + 2]
			);
		}
	}

	query(node, start, end, l, r) {
		if (r < start || end < l) {
			return -Infinity;
		}
		if (l <= start && end <= r) {
			return this.tree[node];
		}
		const mid = Math.floor((start + end) / 2);
		const left = this.query(2 * node + 1, start, mid, l, r);
		const right = this.query(2 * node + 2, mid + 1, end, l, r);
		return Math.max(left, right);
	}

	rangeQuery(l, r) {
		return this.query(0, 0, this.n - 1, l, r);
	}
}

function solve(input) {
	const lines = input.trim().split("\n");
	const N = parseInt(lines[0]);
	const A = lines[1].split(" ").map(Number);
	const D = parseInt(lines[2]);
	const queries = lines.slice(3).map((line) => line.split(" ").map(Number));

	const segTree = new SegmentTree(A);
	const results = [];

	for (const [L, R] of queries) {
		const maxLeft = L > 1 ? segTree.rangeQuery(0, L - 2) : -Infinity;
		const maxRight = R < N ? segTree.rangeQuery(R, N - 1) : -Infinity;
		results.push(Math.max(maxLeft, maxRight));
	}

	console.log(results.join("\n"));
}

const fs = require("fs");
const input = fs.readFileSync("/dev/stdin", "utf-8").trim();
solve(input);
