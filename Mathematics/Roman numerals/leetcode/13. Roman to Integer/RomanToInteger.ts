// `Error: EACCES: permission denied, open 'output.txt'` は、**`output.txt` ファイルを書き込もうとしたが、パーミッション（アクセス権限）がない**ために発生しています。

// ---

// ## ✅ 解決方法

// ### ✅ 方法 1: 権限を確認・修正する（推奨）

// ```bash
// ls -l
// ```

// `output.txt` が既に存在する場合、パーミッションが書き込み不可になっていないか確認します。

// ```bash
// chmod +w output.txt
// ```

// または、親ディレクトリの書き込み権限も確認：

// ```bash
// chmod u+w .
// ```

// ---

// ### ✅ 方法 2: 別のファイル名で書き出す

// 一時的に別名で出力することで、権限の問題を回避できます。

// ```ts
// fs.writeFileSync('output-result.txt', output.trim());
// ```

// ---

// ### ✅ 方法 3: 権限のあるディレクトリを使用

// 例えば `/tmp` ディレクトリや、ホームディレクトリなど確実に書き込み可能な場所を指定：

// ```ts
// fs.writeFileSync('/tmp/output.txt', output.trim());
// ```

// もしくは環境変数で取得：

// ```ts
// const path = require('path');
// const os = require('os');
// const filepath = path.join(os.homedir(), 'output.txt');
// fs.writeFileSync(filepath, output.trim());
// ```

// ---

// ### ✅ 方法 4: 書き込みコードをコメントアウト（デバッグ用）

// 一時的にファイル出力を無効にしてコンソールにだけ表示させる：

// ```ts
// // fs.writeFileSync('output.txt', output.trim());
// console.log(output.trim());
// ```

// ---

// ## 🧪 ファイル出力不要な最小実行バージョン

// 以下は、エラー回避のため `fs.writeFileSync()` を削除し、**標準出力のみに修正**したバージョンです：

// ```ts
const start = process.hrtime.bigint();
const startMem = process.memoryUsage().heapUsed;

function romanToInt(s: string): number {
    const romanMap: { [key: string]: number } = {
        I: 1, V: 5, X: 10,
        L: 50, C: 100, D: 500, M: 1000
    };
    let total = 0;
    for (let i = 0; i < s.length; i++) {
        const curr = romanMap[s[i]];
        const next = romanMap[s[i + 1]];
        if (next > curr) {
            total += next - curr;
            i++;
        } else {
            total += curr;
        }
    }
    return total;
}

const inputs = ['III', 'LVIII', 'MCMXCIV'];
const results = inputs.map(romanToInt);

const end = process.hrtime.bigint();
const endMem = process.memoryUsage().heapUsed;

const output = `
Inputs: ${JSON.stringify(inputs)}
Outputs: ${JSON.stringify(results)}

処理時間: ${(Number(end - start) / 1_000_000).toFixed(3)} ms
メモリ使用量: ${(endMem - startMem) / 1024} KB
`;

console.log(output.trim());

// 📌 補足
// process.hrtime.bigint() を使用してナノ秒単位の処理時間を測定。
// process.memoryUsage().heapUsed でヒープ使用量をバイト単位で取得。
// 測定対象は romanToInt() の3回実行全体。

