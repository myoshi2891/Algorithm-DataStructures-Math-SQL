import * as fs from "fs";

function main(input: string): void {
	const [line1, line2] = input.trim().split("\n");
	const parts: string[] = line1.split(" ");
	const N: number = parseInt(parts[0]);
	const target: string = parts[1];
	const colors: string[] = line2.trim().split("");

	const combine: { [key: string]: string } = {
		WW: "W",
		BB: "R",
		RR: "B",
		WB: "B",
		BW: "B",
		BR: "W",
		RB: "W",
		RW: "R",
		WR: "R",
	};

	let current: string = colors[0];
	for (let i = 1; i < colors.length; i++) {
		const pair: string = current + colors[i];
		current = combine[pair];
	}

	console.log(current === target ? "Yes" : "No");
}

const input: string = fs.readFileSync("/dev/stdin", "utf8");
main(input);
