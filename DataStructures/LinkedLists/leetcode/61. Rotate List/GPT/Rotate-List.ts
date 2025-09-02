// TypeScript（Node.js v18+ / TS 5+ / strict）で「**Rotate List**（連結リストを右に k 回回転）」を、指定テンプレートに沿ってまとめます。

// ---

// ## 1. 問題の分析

// ### 競技プログラミング視点

// * 重要ポイントは `k` が非常に大きい（最大 2e9）ため **`k % n`** による正規化が必須。
// * 最小の計算量と追加メモリで済むのは、**長さ n を測って環状化 → 切断**という定石。
// * 計算量: **O(n)**、追加メモリ: **O(1)**、再帰無し（ループのみ）で高速。

// ### 業務開発視点

// * **型安全性**: `ListNode` と関数の入出力を厳密に型定義。`null` / `undefined` を明確に扱う。
// * **保守性**: 補助関数（配列⇄リスト変換）を分離。JSDoc と `readonly` を併用。
// * **エラーハンドリング**: 実行時型ガード（`instanceof`）と引数検証。サイズの上限チェックを用意。

// ### TypeScript特有の考慮点

// * **strictNullChecks** 前提で `ListNode | null` を正しく扱う。
// * **型推論** を活かしつつ、外部 API の境界では明示型を付与。
// * 実行時性能は JS と同等だが、**型で不正をコンパイル時に防止**することで運用コストを下げる。

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ             | 時間計算量  | 空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考               |
// | ----------------- | ------ | ----- | ------- | ---- | --- | ---------------- |
// | 方法A: 長さ取得→環状化→切断  | O(n)   | O(1)  | 低       | 高    | 高   | 最適。再リンクのみで追加確保なし |
// | 方法B: 配列へ展開→回転→再構築 | O(n)   | O(n)  | 中       | 高    | 中   | 簡単だが無駄な配列/ノード生成  |
// | 方法C: 逐次1回転×k      | O(n·k) | O(1)  | 低       | 高    | 中   | k が大きいと実用外       |

// **採用: 方法A**
// 理由: 最小オーダー（O(n)/O(1)）・実装明快・リンクリスト本来の利点を活用。

// ---

// ## 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（環状化して切断）
// * **理由**:

//   * `k % n` 正規化後に **`n - (k % n)` ステップ**で新しい tail を一発特定できる。
//   * 追加確保が不要で GC 負荷が最小（**O(1)**）。
//   * ループのみで V8 最適化が効きやすい直線的フロー。

// **TS最適化ポイント**

// * `ListNode` を安定レイアウトで定義（プロパティ順を固定）。
// * 無駄なオブジェクト生成を避けて **再リンクのみ**。
// * `readonly` を配列引数などに適用して不変性（設計上の純度）を保持。
//   ※連結リストは\*\*ノード接続を付け替えるため “入力構造をインプレースで回転”\*\*します（外部副作用なし／追加ノードなし）。

// ---

// ## 4. 実装コード（TypeScript / strict）

// ```typescript
// rotate_list.ts
/* eslint-disable no-console */
import assert from 'assert';
import { performance } from 'perf_hooks';

/** 単方向連結リストのノード */
export class ListNode {
  public val: number;
  public next: ListNode | null;

  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * 連結リストを右に k 回回転する（環状化→切断）
 * @param head - 連結リストの先頭（null 可）
 * @param k - 回転回数（0 以上, 2e9 まで想定）
 * @returns 回転後の先頭ノード（null 可）
 * @throws {TypeError} head が ListNode/null 以外、k が負 or 非数
 * @complexity Time: O(n), Space: O(1)
 */
export function rotateRight(head: ListNode | null, k: number): ListNode | null {
  // 実行時型ガード
  if (head !== null && !(head instanceof ListNode)) {
    throw new TypeError('head must be ListNode or null');
  }
  if (typeof k !== 'number' || !Number.isFinite(k) || k < 0) {
    throw new TypeError('k must be a non-negative finite number');
  }

  if (head === null || head.next === null || k === 0) return head;

  // 長さ n と tail を取得
  let n = 1;
  let tail: ListNode = head;
  while (tail.next !== null) {
    tail = tail.next;
    n++;
  }

  const shift = k % n;
  if (shift === 0) return head;

  // 環状化
  tail.next = head;

  // 新しい tail は (n - shift - 1) ステップ先
  let steps = n - shift - 1;
  let newTail: ListNode = head;
  while (steps > 0) {
    // steps は n<=1e6 程度想定、ループで十分
    newTail = newTail.next as ListNode;
    steps--;
  }

  const newHead = newTail.next as ListNode;
  newTail.next = null; // 環を切断
  return newHead;
}

/* ===========================
 * ユーティリティ（型安全）
 * =========================== */

/** 配列から連結リストを構築（テスト補助） */
export function buildList(nums: readonly number[]): ListNode | null {
  if (!Array.isArray(nums)) {
    throw new TypeError('nums must be an array');
  }
  if (nums.length === 0) return null;
  let head: ListNode = new ListNode(nums[0]);
  let cur = head;
  for (let i = 1; i < nums.length; i++) {
    const node = new ListNode(nums[i]);
    cur.next = node;
    cur = node;
  }
  return head;
}

/** 連結リストを配列へ（テスト補助） */
export function listToArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur !== null) {
    out.push(cur.val);
    cur = cur.next;
  }
  return out;
}

/* ===========================
 * 性能計測ユーティリティ
 * =========================== */

export interface BenchmarkResult {
  readonly avg: string;
  readonly min: string;
  readonly max: string;
}

export function measureTime<T extends unknown[], R>(
  fn: (...args: T) => R,
  ...args: T
): R {
  const start = performance.now();
  const result = fn(...args);
  const end = performance.now();
  console.log(`実行時間: ${(end - start).toFixed(3)}ms`);
  return result;
}

export function measureMemory<T extends unknown[], R>(
  fn: (...args: T) => R,
  ...args: T
): R {
  const before = process.memoryUsage();
  const result = fn(...args);
  const after = process.memoryUsage();
  const heapDiffMB = (after.heapUsed - before.heapUsed) / 1024 / 1024;
  console.log(`ヒープ使用量差分: ${heapDiffMB.toFixed(3)}MB`);
  return result;
}

export function benchmark<T extends unknown[]>(
  fn: (...args: T) => unknown,
  args: T,
  iterations: number = 100
): BenchmarkResult {
  const times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn(...args);
    const end = performance.now();
    times.push(end - start);
  }
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  return { avg: avg.toFixed(3), min: min.toFixed(3), max: max.toFixed(3) };
}

/* ===========================
 * テスト（assert 必須）
 * =========================== */

function runBasicTests(): void {
  console.log('=== 基本テスト ===');
  assert.deepStrictEqual(
    listToArray(rotateRight(buildList([1, 2, 3, 4, 5]), 2)),
    [4, 5, 1, 2, 3],
    'Example 1'
  );
  assert.deepStrictEqual(
    listToArray(rotateRight(buildList([0, 1, 2]), 4)),
    [2, 0, 1],
    'Example 2'
  );
  console.log('✅ 基本テスト通過');
}

function runBoundaryTests(): void {
  console.log('=== 境界値テスト ===');
  // 空
  assert.deepStrictEqual(listToArray(rotateRight(buildList([]), 10)), []);
  // 単一要素
  assert.deepStrictEqual(listToArray(rotateRight(buildList([42]), 999)), [42]);
  // k=0
  assert.deepStrictEqual(listToArray(rotateRight(buildList([1, 2, 3]), 0)), [1, 2, 3]);
  // k が n の倍数
  assert.deepStrictEqual(listToArray(rotateRight(buildList([1, 2, 3]), 3)), [1, 2, 3]);
  console.log('✅ 境界値テスト通過');
}

function runErrorTests(): void {
  console.log('=== エラーケーステスト ===');
  // 型不正
  assert.throws(() => rotateRight('invalid' as any, 1), TypeError);
  assert.throws(() => rotateRight(buildList([1, 2, 3]), -1), TypeError);
  // head 型不正（オブジェクトだが ListNode でない）
  assert.throws(() => rotateRight({} as any, 0), TypeError);
  console.log('✅ エラーケーステスト通過');
}

function runPerformanceTests(): void {
  console.log('=== 大規模データテスト ===');
  const sizes = [1_000, 10_000, 100_000] as const;
  for (const size of sizes) {
    const data = Array.from({ length: size }, (_, i) => i);
    const head = buildList(data);
    const start = performance.now();
    const result = rotateRight(head, 123_456_789);
    const end = performance.now();
    const elapsed = end - start;
    assert(elapsed < 1000, `タイムアウト制約違反 (${size}要素: ${elapsed}ms)`);
    // 軽い整合性チェック（長さ保持）
    assert.strictEqual(listToArray(result).length, size);
    console.log(`✅ サイズ${size}: ${elapsed.toFixed(3)}ms`);
  }
}

export function runAllTests(): void {
  try {
    runBasicTests();
    runBoundaryTests();
    runErrorTests();
    runPerformanceTests();
    console.log('\n🎉 全テストケース成功');
  } catch (e) {
    console.error('❌ テスト失敗:', (e as Error).message);
    process.exit(1);
  }
}

/* ===========================
 * 参考: 単発の計測例
 * =========================== */
// 単発計測（必要なら有効化）
// const head = buildList([1,2,3,4,5]);
// measureTime(rotateRight, head, 2);
// measureMemory(rotateRight, head, 2);
// console.log(benchmark(rotateRight, [buildList(Array.from({length: 5000}, (_, i) => i)), 123456], 50));
// ```

// ---

// ## 5. 計算量まとめ

// * **時間計算量**: `O(n)`（長さ測定 + 1 回の走査 + 切断）
// * **空間計算量**: `O(1)`（ポインタ付け替えのみ、追加配列/ノード生成なし）
// * **実測**: 上記 `runPerformanceTests`（1e5 ノード）でも 1 秒未満を目標（環境依存）。

// ---

// ## 6. テスト実行結果（例）

// ```
// === 基本テスト ===
// ✅ 基本テスト通過
// === 境界値テスト ===
// ✅ 境界値テスト通過
// === エラーケーステスト ===
// ✅ エラーケーステスト通過
// === 大規模データテスト ===
// ✅ サイズ1000:   X.XXXms
// ✅ サイズ10000:  XX.XXXms
// ✅ サイズ100000: XXX.XXXms

// 🎉 全テストケース成功
// ```

// ---

// ## TypeScript固有の最適化観点

// * **strict mode & null 安全性**: `ListNode | null` を正しく扱い NPE を排除。
// * **readonly/const**: API 境界の不変性を維持（配列引数は `readonly number[]`）。
// * **実行時型ガード**: コンパイル外入力（外部境界）での安全性確保。
// * **安定したオブジェクト形状**: `ListNode` のプロパティ順を固定し V8 の Hidden Class 最適化に寄与。
// * **GC 負荷抑制**: ノードの再利用（追加確保なし）で一時オブジェクトを最小化。

// ---

// 必要なら、**配列 I/O だけで使いたい**方向けに「`rotateRightArrayLike`（配列を受け取り内部で一度だけリスト化→回転→配列返却）」も追加できます。用途に合わせて用意します。
