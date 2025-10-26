function main(input) {
    const lines = input.trim().split('\n');
    let index = 0;

    // Read T1
    const N1 = parseInt(lines[index++]);
    const edges1 = [];
    for (let i = 0; i < N1 - 1; i++) {
        const [a, b] = lines[index++].split(' ').map(Number);
        edges1.push([a - 1, b - 1]); // 0-indexed
    }

    // Read T2
    const N2 = parseInt(lines[index++]);
    const edges2 = [];
    for (let i = 0; i < N2 - 1; i++) {
        const [a, b] = lines[index++].split(' ').map(Number);
        edges2.push([a - 1, b - 1]); // 0-indexed
    }

    if (N1 !== N2) {
        console.log('NO');
        return;
    }

    const N = N1;

    // ヘルパー: エッジをソートして比較可能な形にする
    const normalizeEdges = (edges) => {
        return edges
            .map(([a, b]) => (a < b ? [a, b] : [b, a]))
            .sort((e1, e2) => e1[0] - e2[0] || e1[1] - e2[1]);
    };

    const normalizedEdges2 = normalizeEdges(edges2);

    // 全ての写像（順列）を試す
    const permute = (arr) => {
        const results = [];
        const used = Array(arr.length).fill(false);
        const path = [];
        function dfs() {
            if (path.length === arr.length) {
                results.push([...path]);
                return;
            }
            for (let i = 0; i < arr.length; i++) {
                if (!used[i]) {
                    used[i] = true;
                    path.push(arr[i]);
                    dfs();
                    path.pop();
                    used[i] = false;
                }
            }
        }
        dfs();
        return results;
    };

    const permutations = permute([...Array(N).keys()]);

    for (const perm of permutations) {
        const mappedEdges = edges1
            .map(([a, b]) => {
                const ma = perm[a];
                const mb = perm[b];
                return ma < mb ? [ma, mb] : [mb, ma];
            })
            .sort((e1, e2) => e1[0] - e2[0] || e1[1] - e2[1]);

        let same = true;
        for (let i = 0; i < mappedEdges.length; i++) {
            if (
                mappedEdges[i][0] !== normalizedEdges2[i][0] ||
                mappedEdges[i][1] !== normalizedEdges2[i][1]
            ) {
                same = false;
                break;
            }
        }

        if (same) {
            console.log('YES');
            return;
        }
    }

    console.log('NO');
}

// 標準入力を受け取る
const fs = require('fs');
main(fs.readFileSync(0, 'utf-8'));
