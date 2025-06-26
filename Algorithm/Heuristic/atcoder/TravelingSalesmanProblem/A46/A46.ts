type City = { x: number; y: number };
const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
const inputLines: string[] = [];

rl.on("line", (line: string) => inputLines.push(line));
rl.on("close", () => {
	const N = parseInt(inputLines[0]);
	const cities: City[] = inputLines.slice(1).map((line) => {
		const [x, y] = line.split(" ").map(Number);
		return { x, y };
	});

	const dist = (i: number, j: number): number => {
		const dx = cities[i].x - cities[j].x;
		const dy = cities[i].y - cities[j].y;
		return dx * dx + dy * dy;
	};

	// Greedy 初期解生成
	const visited = Array(N).fill(false);
	let tour: number[] = [0]; // 都市インデックス 0 は都市1
	visited[0] = true;

	for (let i = 0; i < N - 1; i++) {
		const current = tour[tour.length - 1];
		let next = -1;
		let minDist = Infinity;
		for (let j = 0; j < N; j++) {
			if (!visited[j] && dist(current, j) < minDist) {
				minDist = dist(current, j);
				next = j;
			}
		}
		visited[next] = true;
		tour.push(next);
	}

	// 2-opt で局所探索
	const totalDist = (route: number[]) => {
		let d = 0;
		for (let i = 0; i < route.length - 1; i++)
			d += dist(route[i], route[i + 1]);
		d += dist(route[route.length - 1], route[0]);
		return d;
	};

	const twoOpt = (route: number[]): number[] => {
		let improved = true;
		while (improved) {
			improved = false;
			for (let i = 1; i < route.length - 2; i++) {
				for (let j = i + 1; j < route.length - 1; j++) {
					const A = route[i - 1],
						B = route[i];
					const C = route[j],
						D = route[j + 1];
					const before = dist(A, B) + dist(C, D);
					const after = dist(A, C) + dist(B, D);
					if (after < before) {
						const newRoute = [...route];
						newRoute.splice(
							i,
							j - i + 1,
							...route.slice(i, j + 1).reverse()
						);
						route = newRoute;
						improved = true;
					}
				}
			}
		}
		return route;
	};

	tour = twoOpt(tour);

	// 出力（都市番号を1-indexedで）
	for (const city of tour) {
		console.log(city + 1);
	}
	console.log(tour[0] + 1); // 最後に都市1へ戻る
});
