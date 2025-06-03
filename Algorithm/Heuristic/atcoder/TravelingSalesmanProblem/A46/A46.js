const fs = require("fs");

function readInput() {
	const input = fs.readFileSync(0, "utf8").trim().split("\n");
	const N = parseInt(input[0], 10);
	const cities = input.slice(1).map((line) => {
		const [x, y] = line.split(" ").map(Number);
		return { x, y };
	});
	return { N, cities };
}

function dist2(a, b) {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	return dx * dx + dy * dy;
}

function nearestNeighbor(N, cities) {
	const visited = Array(N).fill(false);
	const route = [0];
	visited[0] = true;

	for (let i = 1; i < N; i++) {
		const last = route[route.length - 1];
		let nearest = -1;
		let minDist = Infinity;

		for (let j = 0; j < N; j++) {
			if (!visited[j]) {
				const d = dist2(cities[last], cities[j]);
				if (d < minDist) {
					minDist = d;
					nearest = j;
				}
			}
		}
		visited[nearest] = true;
		route.push(nearest);
	}

	return route;
}

function totalDist(route, cities) {
	let dist = 0;
	for (let i = 0; i < route.length; i++) {
		const a = cities[route[i]];
		const b = cities[route[(i + 1) % route.length]];
		dist += Math.sqrt(dist2(a, b));
	}
	return dist;
}

function twoOpt(route, cities) {
	const N = route.length;
	let improved = true;

	while (improved) {
		improved = false;
		for (let i = 1; i < N - 2; i++) {
			for (let j = i + 1; j < N - 1; j++) {
				const a = cities[route[i - 1]];
				const b = cities[route[i]];
				const c = cities[route[j]];
				const d = cities[route[j + 1]];

				const current = Math.sqrt(dist2(a, b)) + Math.sqrt(dist2(c, d));
				const swapped = Math.sqrt(dist2(a, c)) + Math.sqrt(dist2(b, d));

				if (swapped < current) {
					// reverse route[i...j]
					while (i < j) {
						[route[i], route[j]] = [route[j], route[i]];
						i++;
						j--;
					}
					improved = true;
				}
			}
		}
	}

	return route;
}

function main() {
	const { N, cities } = readInput();

	let route = nearestNeighbor(N, cities);
	route = twoOpt(route, cities);

	// 出力 (1-indexed)
	for (let i = 0; i < N; i++) {
		console.log(route[i] + 1);
	}
	console.log(route[0] + 1); // return to start
}

main();
