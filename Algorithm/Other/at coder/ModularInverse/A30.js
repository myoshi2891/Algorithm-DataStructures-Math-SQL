const readline = require("readline");
const MOD = 1000000007;
const MAX = 100000;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const fac = new Array(MAX + 1);
const invFac = new Array(MAX + 1);

// a^b % MOD
function modPow(a, b, mod) {
	let result = 1n;
	a = BigInt(a);
	b = BigInt(b);
	mod = BigInt(mod);
	while (b > 0) {
		if (b % 2n === 1n) result = (result * a) % mod;
		a = (a * a) % mod;
		b /= 2n;
	}
	return result;
}

function preprocess() {
	fac[0] = 1n;
	for (let i = 1; i <= MAX; i++) {
		fac[i] = (fac[i - 1] * BigInt(i)) % BigInt(MOD);
	}
	invFac[MAX] = modPow(fac[MAX], MOD - 2, MOD);
	for (let i = MAX - 1; i >= 0; i--) {
		invFac[i] = (invFac[i + 1] * BigInt(i + 1)) % BigInt(MOD);
	}
}

preprocess();

rl.on("line", (line) => {
	const [n, r] = line.split(" ").map(Number);
	const res =
		(((fac[n] * invFac[r]) % BigInt(MOD)) * invFac[n - r]) % BigInt(MOD);
	console.log(res.toString());
	rl.close();
});
