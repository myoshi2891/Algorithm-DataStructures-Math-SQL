# 同じ `num` が **少なくとも 3 回連続** して出現する数値」を求める実装

---

## ✅ 実装（関数 1 本で切り替え可能）

```python
import pandas as pd

def consecutive_nums(logs: pd.DataFrame, method: str = "rle") -> pd.DataFrame:
    """
    Find numbers that appear at least three times consecutively (by id order).

    Parameters
    ----------
    logs : pd.DataFrame
        Columns: 'id' (int-like, unique), 'num' (str/int-like)
    method : {"rle", "rolling"}
        - "rle": Run-Length Encoding via change points (推奨: 長い連続に強い)
        - "rolling": shiftを使った直感的判定（短いコード）

    Returns
    -------
    pd.DataFrame
        Single column 'ConsecutiveNums' in any order (unique).
    """
    # 1) 入力の最小前処理
    df = logs.loc[:, ["id", "num"]].copy()
    df = df.sort_values("id", kind="mergesort")  # 安定ソート（同idは無い想定だが安全側）

    if method == "rolling":
        # 2A) rolling法：直近2つと同じなら3連続
        m = df["num"].eq(df["num"].shift(1)) & df["num"].eq(df["num"].shift(2))
        out = df.loc[m, "num"].drop_duplicates()

    else:
        # 2B) RLE法（推奨）：変化点で run_id を振って区間長を集計
        df["run_id"] = (df["num"] != df["num"].shift(1)).cumsum()
        run = (
            df.groupby(["num", "run_id"], sort=False)
              .size()
              .reset_index(name="run_len")
        )
        out = run.loc[run["run_len"] >= 3, "num"].drop_duplicates()

    return pd.DataFrame({"ConsecutiveNums": out})
```

### 使い方（サンプルと同じデータ）

```python
logs = pd.DataFrame(
    {"id":[1,2,3,4,5,6,7], "num":[1,1,1,2,1,2,2]}
)
print(consecutive_nums(logs, method="rle"))
#   ConsecutiveNums
# 0               1

print(consecutive_nums(logs, method="rolling"))
#   ConsecutiveNums
# 0               1
```

---

## 🧠 アルゴリズム解説

### 方法 A：RLE（Run-Length Encoding）法【推奨】

- `num` が変わった場所で **変化フラグ** を立て、累積和で **run_id** を振る
  （同じ `num` が続く区間は同じ run_id になる）
- `groupby(["num","run_id"])` で **区間長（run_len）** を集計
- `run_len >= 3` の `num` を重複排除して返す

**長所**：超長い連続（例：100 連続）があっても、**区間単位**で 1 回の集計に畳めるため安定・高速。

### 方法 B：rolling（shift）法

- `num == shift(1)` かつ `num == shift(2)` を満たす行があれば、その `num` は 3 連続
- ヒットした行から `num` を重複排除

**長所**：コードが短く直感的。
**短所**：長い連続が大量にあると、ヒット行が増えて後段の重複排除コストがやや増える。

---

## ⏱️ 計算量（どちらも線形）

- ソート：`O(n log n)`（`id` が既に昇順なら省略可 → 実質 `O(n)`）
- RLE 法：シフト・累積和・groupby/size の合計で **`O(n)`**
- rolling 法：シフト 2 回＋ブール演算＋重複排除で **`O(n)`**

---

## ✅ 図解（GitHub Mermaid で安全に描画できる表記）

### 図 1：RLE 法の流れ

```mermaid
flowchart LR
  A["Sort by id"] --> B["Compute change flag: num != shift(num)"]
  B --> C["run_id = cumulative sum of change flag"]
  C --> D["Group by (num, run_id) and size"]
  D --> E{"run_len >= 3"}
  E -- Yes --> F["Collect num"]
  E -- No --> G["Skip"]
  F --> H["Drop duplicates"]
  H --> I["Return DataFrame: ConsecutiveNums"]
```

### 図 2：rolling 法の流れ

```mermaid
flowchart LR
  A["Sort by id"] --> B["eq1 = num == shift(1)"]
  B --> C["eq2 = num == shift(2)"]
  C --> D["mask = eq1 and eq2"]
  D --> E["Filter rows where mask is True"]
  E --> F["Unique num"]
  F --> G["Return DataFrame: ConsecutiveNums"]
```

> 注: 改行コードや `<br/>` は使わず、ラベルはシンプルな英語文にすると安定して描画できます。

---

## 🔧 実務 Tips

- **連続の定義**が `id` ではなく「時刻列」等の場合は、`sort_values("timestamp")` に差し替えるだけで OK。
- `num` の型は文字列でも数値でも動きます（そのまま返します）。数値に統一したいなら `pd.to_numeric(df["num"], errors="coerce")` を検討。
- データがすでに `id` 昇順なら、並べ替えをスキップしてさらに高速化できます。

了解です。指定のシグネチャに沿って、**RLE（連続区間の長さを数える）方式**で実装します。`id` 昇順を“連続”の基準にし、3 回以上連続した `num` を一意に返します。

```python
import pandas as pd

def consecutive_numbers(logs: pd.DataFrame) -> pd.DataFrame:
    """
    Return numbers that appear at least three times consecutively by id order.

    Parameters
    ----------
    logs : pd.DataFrame
        Must contain columns:
          - 'id'  : integer-like primary key
          - 'num' : value to check consecutive appearances (str/int)

    Returns
    -------
    pd.DataFrame
        Single column 'ConsecutiveNums' (unique values, any order).
    """
    # 必要列だけコピーし、id昇順で安定ソート（念のため mergesort を明示）
    df = logs.loc[:, ["id", "num"]].copy()
    if df.empty:
        return pd.DataFrame({"ConsecutiveNums": pd.Series(dtype=df["num"].dtype if "num" in df else object)})

    df.sort_values("id", kind="mergesort", inplace=True)

    # 直前行と num が異なる箇所を「変化点」として検出し、累積和で run_id を付与
    # 同じ num が続く区間は同じ run_id になる
    df["run_id"] = (df["num"].ne(df["num"].shift(1))).cumsum()

    # (num, run_id) ごとの区間長を集計し、3以上のみ抽出 → num を一意化
    run = (
        df.groupby(["num", "run_id"], sort=False)
          .size()
          .reset_index(name="run_len")
    )
    out = run.loc[run["run_len"] >= 3, "num"].drop_duplicates()

    return pd.DataFrame({"ConsecutiveNums": out})
```

### 使い方（サンプル）

```python
logs = pd.DataFrame(
    {"id":[1,2,3,4,5,6,7], "num":[1,1,1,2,1,2,2]}
)
consecutive_numbers(logs)
#   ConsecutiveNums
# 0               1
```

---

## 図解：処理の流れ（Mermaid 安全表記）

## 図 1：RLE 方式のパイプライン

```mermaid
flowchart LR
  A["Sort by id"] --> B["Change flag = num != shift(num)"]
  B --> C["run_id = cumsum(change flag)"]
  C --> D["Group by (num, run_id) and size"]
  D --> E{"run_len >= 3"}
  E -- Yes --> F["Collect num"]
  E -- No  --> G["Skip"]
  F --> H["Drop duplicates"]
  H --> I["Return DataFrame: ConsecutiveNums"]
```

## 図 2：run_id の付き方（イメージ）

```mermaid
flowchart TB
  subgraph Input["id, num (ordered by id)"]
    X1["1, 1"] --> X2["2, 1"] --> X3["3, 1"] --> X4["4, 2"] --> X5["5, 1"] --> X6["6, 2"] --> X7["7, 2"]
  end
  subgraph RunID["run_id after cumsum(num != shift)"]
    R1["1"] --> R2["1"] --> R3["1"] --> R4["2"] --> R5["3"] --> R6["4"] --> R7["4"]
  end
  Input --> RunID
```

---

## 補足

- `id` がすでに昇順なら `sort_values` は省略可（さらに高速）。
- `num` が文字列でも数値でも動作します（返却も同じ型）。
- “k 回以上連続”に一般化する場合は、`run_len >= 3` を `>= k` に変えるだけで OK。

原因の可能性が高いのは次の 2 点です。どちらもオンライン採点でよく落ちる“地雷”です。

1. **`num` に `NaN`（欠損）が混ざるケースの未対応**
   　今の実装だと `NaN != NaN` が常に `True` になるため、
   `NaN` の連続が **誤って 1 つの“数値”として 3 連続扱い**され、`ConsecutiveNums` に `NaN` が紛れ込みます（想定外）。
2. **出力の決定性（並び・dtype）の不一致**
   　問題文は「順不同で OK」でも、採点側が内部で比較するときに **並びや dtype の違い**で弾かれることがあります（特に空結果や単一結果）。

下の修正版は ①`NaN` を**非対象**として完全に除外し、②**決定的な並び**（値で昇順）で返し、③ 空結果でも正しいカラム名・dtype で返すようにしています。

---

## 修正版（RLE 法・安全版）

```python
import pandas as pd

def consecutive_numbers(logs: pd.DataFrame) -> pd.DataFrame:
    """
    Return numbers that appear at least three times consecutively by id order.

    Parameters
    ----------
    logs : pd.DataFrame
        Columns:
          - 'id'  : integer-like primary key
          - 'num' : value to check (str/int-like). NaN is ignored.

    Returns
    -------
    pd.DataFrame
        Single column 'ConsecutiveNums' (unique values, ascending, stable dtype).
    """
    # 空や必要列欠如のガード
    if logs is None or logs.empty or not {"id", "num"} <= set(logs.columns):
        return pd.DataFrame({"ConsecutiveNums": pd.Series([], dtype="object")})

    # 並びの基準は id 昇順
    df = logs.loc[:, ["id", "num"]].sort_values("id", kind="mergesort").copy()

    # NaN は連続判定の対象外（完全除外）
    df_valid = df[df["num"].notna()].copy()
    if df_valid.empty:
        # 空でも必ず列名は 'ConsecutiveNums'
        return pd.DataFrame({"ConsecutiveNums": pd.Series([], dtype=df["num"].dtype)})

    # 変化点 → 累積和で run_id（同じ num が続く区間は同一 run_id）
    df_valid["run_id"] = (df_valid["num"].ne(df_valid["num"].shift(1))).cumsum()

    # 区間長 >= 3 の num を一意に抽出
    run_len = (
        df_valid.groupby(["num", "run_id"], sort=False)
                .size()
                .reset_index(name="run_len")
    )
    winners = run_len.loc[run_len["run_len"] >= 3, "num"].drop_duplicates()

    # 採点安定性のため値で昇順に整列（数値と文字が混在し得るため astype(str) でソートキーを作る）
    if not winners.empty:
        winners = winners.iloc[winners.astype(str).sort_values().index]

    return pd.DataFrame({"ConsecutiveNums": winners})
```

### 変更点の要旨

- **NaN 完全除外**：`df_valid = df[df["num"].notna()]`
  → `NaN` が連続しても拾わない／返さない。
- **決定的な戻り順**：`astype(str)` のキーで昇順ソート
  → 数値と文字列が混在しても安定して比較でき、採点ブレを防止。
- **空結果時の dtype**：入力 `num` の dtype を尊重して空 Series を生成
  → 採点側の strict な型チェックに耐える。

---

## 参考：最小テスト

```python
# 1) サンプル
logs = pd.DataFrame({"id":[1,2,3,4,5,6,7], "num":[1,1,1,2,1,2,2]})
print(consecutive_numbers(logs))
#   ConsecutiveNums
# 0               1

# 2) NaN が混ざる（NaNは無視）
logs = pd.DataFrame({"id":[1,2,3,4,5], "num":[None, 5,5,5, None]})
print(consecutive_numbers(logs))
#   ConsecutiveNums
# 0               5

# 3) 長い連続と複数候補
logs = pd.DataFrame({"id":[1,2,3,4,5,6,7,8,9],
                     "num":[2,2,2,  3,3,3,3,  2,2]})
print(consecutive_numbers(logs))
#   ConsecutiveNums
# 0               2
# 1               3

# 4) 空
logs = pd.DataFrame(columns=["id","num"])
print(consecutive_numbers(logs))
# Empty DataFrame with column 'ConsecutiveNums'
```

---

## もしまだ通らない場合のチェックリスト

- 採点側が **厳密な並び**を要求している → 既に昇順にしたが、必要に応じて「数値としての昇順」に変える
  （`pd.to_numeric(winners, errors="ignore")` をキーにしても OK）
- 採点側が **dtype 固定**を要求している → 期待が `int64` なら `winners = winners.astype("int64", copy=False)` でそろえる
- `id` が既に昇順で、不要なソートが嫌われる → `sort_values` を条件付きに（ただし一般には残して OK）

---

なるほど。まずは「**なぜ落ちるかを自分で特定できる**」ように、失敗しやすい要因 → 診断チェック → 修正版コード → 最小テスト → 自動デバッグ（可視化・ファズテスト）の順で置いておきます。
23 中 6 パス＝**基本は動くが特定パターンで崩れる**サインです。

---

## よく落ちる原因トップ 5

1. **`num` 型の不一致（int と str の混在）**
    - SQL では `num` は `varchar`。pandas 側で `1`（int）と `"1"`（str）が混在すると、**同値判定がズレて連続を見落とす**/余計に拾う。

2. **前後スペース等の汚れ（" 1 " vs "1"）**
    - SQL の `varchar` 由来だと稀に混入。**strip 不足**で不一致。

3. **NaN/None の扱い**
    - `NaN != NaN` のため、**誤った分割**や**'nan' 文字**として残してしまう。

4. **並び順の取り違え**
    - 連続の定義は `id` 昇順。**未ソート**/別キーでソートすると全部ズレます。

5. **出力の“決定性”**
    - 採点側が内部で厳格比較していると、**dtype（文字列で返すべき）や並び**が原因で NG になることがある。

---

## デバッグ手順（最短ルート）

### 1) まずは“入力の実態”を観測

```python
print(logs.dtypes)
print(logs.head(10))
print(logs.tail(10))
print("unique types in num:", {type(x) for x in logs["num"].dropna().unique()})
```

- `num` に **int と str が混在**していないか、前後スペースがないか確認。

### 2) 並びと NaN の確認

```python
print("is_id_sorted:", logs["id"].is_monotonic_increasing)
print("num_has_nan:", logs["num"].isna().any())
```

### 3) 中間生成物を覗く（run_id と run_len）

後述の **デバッグ版** 関数を使って `df_debug` を出力し、
**どの区間がどんな長さで数えられたか**を目視確認。

---

## 修正版（“varchar 前提”の厳密クリーニング + RLE）

> 連続の判定列は **文字列化＋ strip** 済みの `key` に統一。
> NaN は完全除外。出力は **文字列（object dtype）** で返します。

```python
import pandas as pd

def consecutive_numbers(logs: pd.DataFrame) -> pd.DataFrame:
    """
    Return numbers (as strings) that appear at least three times consecutively by id order.
    Assumes SQL source where `num` is varchar.
    """
    # ガード
    if logs is None or logs.empty or not {"id", "num"} <= set(logs.columns):
        return pd.DataFrame({"ConsecutiveNums": pd.Series([], dtype="object")})

    # 1) id 昇順に安定ソート
    df = logs.loc[:, ["id", "num"]].sort_values("id", kind="mergesort").copy()

    # 2) NaN 除外（varchar なので None/NaN は“値”として扱わない）
    df = df[df["num"].notna()].copy()
    if df.empty:
        return pd.DataFrame({"ConsecutiveNums": pd.Series([], dtype="object")})

    # 3) varchar 正規化（型混在・空白差異を吸収）
    #    - 先に文字列化→strip
    df["key"] = df["num"].astype(str).str.strip()

    # 4) RLE: 変化点→累積和で run_id
    df["run_id"] = (df["key"].ne(df["key"].shift(1))).cumsum()

    # 5) 区間長集計
    run = (
        df.groupby(["key", "run_id"], sort=False)
          .size()
          .reset_index(name="run_len")
    )
    winners = run.loc[run["run_len"] >= 3, "key"].drop_duplicates()

    # 6) 採点安定のため、文字列として昇順（varchar 振る舞い）
    winners = winners.sort_values(kind="mergesort")

    # 7) 返却（varchar 想定なので文字列 dtype）
    return pd.DataFrame({"ConsecutiveNums": winners.astype("object")})
```

> これで「1 と '1' の混在」「' 1 '」「NaN」「順序」「dtype」の地雷をすべて踏まない構成になります。

---

## 中間を覗けるデバッグ版（何が起きているかを可視化）

```python
def consecutive_numbers_debug(logs: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    df = logs.loc[:, ["id", "num"]].sort_values("id", kind="mergesort").copy()
    df["key_raw"] = df["num"]                     # まずは生の型を観る
    df = df[df["num"].notna()].copy()
    df["key"] = df["num"].astype(str).str.strip() # 正規化キー
    df["run_id"] = (df["key"].ne(df["key"].shift(1))).cumsum()

    run = (
        df.groupby(["key", "run_id"], sort=False)
          .size()
          .reset_index(name="run_len")
    )
    winners = run.loc[run["run_len"] >= 3, "key"].drop_duplicates().sort_values()
    return df, run, winners.to_frame(name="ConsecutiveNums")
```

呼び出し:

```python
df_debug, runs_debug, out_debug = consecutive_numbers_debug(logs)
print(df_debug.head(20))   # 並び・key・run_id をチェック
print(runs_debug.sort_values(["key","run_id"]))  # 各区間の run_len
print(out_debug)           # 最終候補
```

---

## 最小テスト（落ちやすいケース集）

```python
import pandas as pd

# 1) int と str 混在
logs = pd.DataFrame({"id":[1,2,3,4,5], "num":[1,"1","1","1",2]})
print(consecutive_numbers(logs))
# → "1" が返るべき

# 2) 前後スペース
logs = pd.DataFrame({"id":[1,2,3], "num":[" 2","2 ","2"]})
print(consecutive_numbers(logs))
# → "2"

# 3) NaN を挟む（無視）
logs = pd.DataFrame({"id":[1,2,3,4,5], "num":[None,"3","3","3",None]})
print(consecutive_numbers(logs))
# → "3"

# 4) 不規則順（idで並べ替えできるか）
logs = pd.DataFrame({"id":[3,1,2,4], "num":["7","7","7","8"]})
print(consecutive_numbers(logs))
# → "7"

# 5) 長い連続＋複数候補
logs = pd.DataFrame({"id":[1,2,3,4,5,6,7,8,9],
                     "num":["2","2","2","3","3","3","3","2","2"]})
print(consecutive_numbers(logs))
# → "2","3"（順不同可）
```

---

## さらに詰めるなら：自動ファズテストでロジック検証

**rolling 法（基準実装）**と**RLE 法（本実装）**をランダムデータで突き合わせます。
両者が常に一致するならロジックは堅い、ズレるなら入力特性を調べて対処。

```python
import numpy as np
import pandas as pd

def ref_rolling(logs: pd.DataFrame) -> set:
    df = logs.sort_values("id")
    df = df[df["num"].notna()].copy()
    key = df["num"].astype(str).str.strip()
    m = (key.eq(key.shift(1))) & (key.eq(key.shift(2)))
    return set(key[m].unique())

def impl_rle(logs: pd.DataFrame) -> set:
    return set(consecutive_numbers(logs)["ConsecutiveNums"].tolist())

rng = np.random.default_rng(0)
for _ in range(500):
    n = rng.integers(0, 50)
    ids = np.arange(1, n+1)
    rng.shuffle(ids)  # 無秩序な id でテスト
    # 値は int or str を混在させる。たまに None も入れる
    vals = []
    for i in range(n):
        if rng.random() < 0.1:
            vals.append(None)
        else:
            v = int(rng.integers(0, 5))
            vals.append(str(v) if rng.random() < 0.5 else v)
    logs = pd.DataFrame({"id": ids, "num": vals})
    a = impl_rle(logs)
    b = ref_rolling(logs)
    if a != b:
        print("Mismatch!", logs.head(20), a, b)
        break
```

---

## まとめ（デバッグの勘所）

- **まず型と汚れを観る**：`type` 集合・先頭/末尾確認。
- **varchar を前提に“文字列正規化キー”で判定**：`astype(str).str.strip()`。
- **NaN は完全除外**（値ではない）。
- **`id` 昇順に安定ソート**してから判定。
- **出力は object（文字列）で返す**：SQL の `varchar` と揃える。

原因はシンプルで、**提出コードのトップレベルに `print(logs.dtypes)` など「`logs` という変数」を直接参照するデバッグ文が残っている**ためです。
オンラインジャッジではその変数は存在しないので `NameError` になります。
👉 提出は **関数だけ** にしてください（トップレベルに `print(...)` やテストコードを置かない）。

---

## 提出用（関数のみ・デバッグ出力なし）

```python
import pandas as pd

def consecutive_numbers(logs: pd.DataFrame) -> pd.DataFrame:
    """
    Return numbers that appear at least three times consecutively by id order.
    Output schema: single column 'ConsecutiveNums'.
    """
    # ガード
    if logs is None or logs.empty or not {"id", "num"} <= set(logs.columns):
        return pd.DataFrame({"ConsecutiveNums": pd.Series([], dtype="object")})

    # id昇順で安定ソート（連続の基準）
    df = logs.loc[:, ["id", "num"]].sort_values("id", kind="mergesort").copy()

    # 連続判定は正規化キー（文字列＋strip）で行うが、返却値は元のnumを使う
    key = df["num"].astype(str).str.strip()
    df["run_id"] = (key != key.shift(1)).cumsum()

    # 各連続区間の長さ
    run = (
        df.groupby("run_id", sort=False)
          .agg(num=("num", "first"), run_len=("run_id", "size"))
          .reset_index(drop=True)
    )

    winners = run.loc[run["run_len"] >= 3, "num"].drop_duplicates()

    # 並びは安定化（数値なら数値順、そうでなければ文字列順）
    if pd.api.types.is_numeric_dtype(df["num"]):
        winners = winners.sort_values(kind="mergesort")
    else:
        winners = winners.astype(str).sort_values(kind="mergesort")

    return pd.DataFrame({"ConsecutiveNums": winners.reset_index(drop=True)})
```

> 重要：**これ以外のコードは提出しない**でください。`print(...)`、サンプル実行、`if __name__ == "__main__":` なども外してください（環境によっては失敗要因になります）。

---

## ローカルでデバッグしたいときのコツ（提出には含めない）

- テストコードは**別ファイル**か `if __name__ == "__main__":` の中に置く。
- 自分で `logs = pd.DataFrame({...})` を用意してから `print(consecutive_numbers(logs))` を呼ぶ。
- 型・汚れを確認するときは：

    ```python
    print(logs.dtypes)
    print({type(x) for x in logs["num"].dropna().unique()})
    ```

これで `NameError` は解消し、採点環境でも動くはずです。

原因はズバリ、**最終出力が文字列（"1"）になっていた**ことです。
前回の実装では連続判定のために `num` をいったん **文字列正規化**（`astype(str).str.strip()`）していましたが、その **正規化キーをそのまま返していた**ため、
評価側が期待する **整数 1** ではなく **文字列 "1"** になっていました。

下の修正版は、**連続判定は文字列キーで厳密に**行い、**返却時は “すべてが整数表現なら int64 にキャストして返す”** ようにしています（整数でない値が混じるケースでは文字列のまま返します）。

---

```python
import pandas as pd
import re

def consecutive_numbers(logs: pd.DataFrame) -> pd.DataFrame:
    """
    Return numbers that appear at least three times consecutively by id order.
    Output schema: single column 'ConsecutiveNums'.

    - 判定は文字列正規化キーで行い（混在/空白対策）
    - 返却は、候補がすべて整数表現なら int64 にキャストして返す
      （評価系が 1 を期待しているため）
    """
    # ガード
    if logs is None or logs.empty or not {"id", "num"} <= set(logs.columns):
        return pd.DataFrame({"ConsecutiveNums": pd.Series([], dtype="int64")})

    # 1) 連続の基準は id 昇順
    df = logs.loc[:, ["id", "num"]].sort_values("id", kind="mergesort").copy()

    # 2) NaN は対象外（値として扱わない）
    df = df[df["num"].notna()].copy()
    if df.empty:
        return pd.DataFrame({"ConsecutiveNums": pd.Series([], dtype="int64")})

    # 3) 文字列正規化キー（混在型/前後空白を吸収）
    key = df["num"].astype(str).str.strip()
    df["run_id"] = (key != key.shift(1)).cumsum()

    # 4) 連続区間の長さを集計（run_id 単位）
    runs = (
        df.assign(key=key)
          .groupby("run_id", sort=False)
          .agg(key=("key", "first"), run_len=("run_id", "size"))
          .reset_index(drop=True)
    )

    winners_key = runs.loc[runs["run_len"] >= 3, "key"].drop_duplicates()

    if winners_key.empty:
        return pd.DataFrame({"ConsecutiveNums": pd.Series([], dtype="int64")})

    # 5) 返却型の決定：
    #    候補がすべて「整数だけで構成」されていれば int64 にキャストして返す。
    #    それ以外（小数や英字が混じる等）は文字列のまま返す。
    int_pat = re.compile(r"^[+-]?\d+$")
    all_int_like = winners_key.map(lambda s: bool(int_pat.match(s))).all()

    if all_int_like:
        out = winners_key.astype("int64").sort_values(kind="mergesort").reset_index(drop=True)
        return pd.DataFrame({"ConsecutiveNums": out})
    else:
        # 数字以外が混ざる場合は文字列で返す（並びは安定化）
        out = winners_key.sort_values(kind="mergesort").reset_index(drop=True).astype("object")
        return pd.DataFrame({"ConsecutiveNums": out})
```

### これで直る理由

- 連続判定は「表記ゆれ」に強い **文字列キー**で実施（`"1"`, `1`, `" 1 "` でも同一扱い）。
- しかし **返却時は評価系の期待**に合わせ、**すべて整数表現なら int64 に変換**して返すため、
  `1`（数値）として出力され、`"1"` との不一致が解消されます。

### サンプル（質問のケース）

```python
logs = pd.DataFrame({"id":[1,2,3,4,5,6], "num":[1,1,1,2,1,2]})
print(consecutive_numbers(logs))
#   ConsecutiveNums
# 0               1   <- 数値 (int64)
```

> 提出の際は、この関数以外（print やテストコード）は含めないでください。

速度ボトルネックは `groupby`/`size`/`drop_duplicates`/文字列処理あたりです。
下は **ほぼ NumPy だけ**でラン長（RLE）を出して重い `groupby` を無くした高速版。
判定キーは型を見て **数値に統一できるなら統一**（"1" と 1 を同一視）、最後の出力は **可能なら int64** に落として返します。

```python
import pandas as pd
import numpy as np

def consecutive_numbers(logs: pd.DataFrame) -> pd.DataFrame:
    """
    Return numbers that appear at least three times consecutively by id order.
    - 判定はできるだけ数値に統一（"1" と 1 を同一視）
    - RLE を NumPy で実装して groupby を回避
    - 返却は可能なら int64（採点の期待に合わせる）
    """
    # 入力ガード
    if logs is None or logs.empty or not {"id", "num"} <= set(logs.columns):
        return pd.DataFrame({"ConsecutiveNums": pd.Series([], dtype="int64")})

    # id 昇順。既に単調増加ならソート省略（高速化）
    df = logs.loc[:, ["id", "num"]]
    if not df["id"].is_monotonic_increasing:
        df = df.sort_values("id", kind="mergesort", ignore_index=True)
    else:
        df = df.reset_index(drop=True)

    # NaN は連続判定の対象外（丸ごと除外）
    mask_valid = df["num"].notna().to_numpy()
    if not mask_valid.any():
        return pd.DataFrame({"ConsecutiveNums": pd.Series([], dtype="int64")})
    s = df.loc[mask_valid, "num"]

    # 可能なら数値に統一（"1" と 1 を同一視、出力も数値化しやすくなる）
    if pd.api.types.is_numeric_dtype(s):
        key = s.to_numpy()                  # 数値のまま
        out_vals = key                      # 出力候補も数値
        out_is_numeric = True
    else:
        coerced = pd.to_numeric(s, errors="coerce")
        if coerced.notna().all():
            key = coerced.to_numpy()        # すべて数値化できた
            out_vals = key
            out_is_numeric = True
        else:
            # 数値化できない値が混じる場合は文字列で判定（strip は高コストなので省略）
            key = s.astype(str).to_numpy()
            out_vals = key
            out_is_numeric = False

    n = key.shape[0]
    if n == 0:
        return pd.DataFrame({"ConsecutiveNums": pd.Series([], dtype="int64")})

    # --- RLE（NumPy）---
    # 変化点（先頭は必ず変化点）
    change = np.empty(n, dtype=bool)
    change[0] = True
    change[1:] = key[1:] != key[:-1]

    # 連続ブロックID（0..k-1）
    run_id = np.cumsum(change) - 1

    # 各ブロック長と開始位置
    run_len = np.bincount(run_id)                 # shape: (k,)
    start_idx = np.flatnonzero(change)            # shape: (k,)

    # 長さ>=3 のブロックの先頭値を候補に
    ok = run_len >= 3
    if not ok.any():
        return pd.DataFrame({"ConsecutiveNums": pd.Series([], dtype="int64")})

    winners = out_vals[start_idx[ok]]

    # 重複除去（順序保持・高速）
    winners = pd.unique(winners)

    # 出力 dtype を確定（可能なら int64）
    if out_is_numeric:
        # 浮動小数が紛れても全て整数値なら int64 に落とす
        arr = np.asarray(winners)
        if np.issubdtype(arr.dtype, np.floating):
            if np.all(np.isfinite(arr)) and np.all(arr == np.floor(arr)):
                winners = arr.astype("int64", copy=False)
        elif np.issubdtype(arr.dtype, np.integer):
            winners = arr
        else:
            # それ以外の数値型は一旦整数化を試みる
            try:
                winners = arr.astype("int64", copy=False)
            except Exception:
                pass
        return pd.DataFrame({"ConsecutiveNums": pd.Series(winners)})
    else:
        # 文字列でも、全て整数表現なら int64 に変換（採点互換）
        coerced_w = pd.to_numeric(pd.Series(winners), errors="coerce")
        if coerced_w.notna().all() and np.all(coerced_w == np.floor(coerced_w)):
            return pd.DataFrame({"ConsecutiveNums": coerced_w.astype("int64")})
        # そうでなければ文字列のまま返す
        return pd.DataFrame({"ConsecutiveNums": pd.Series(winners, dtype="object")})
```

## 速くなる理由（要点）

- **NumPy で RLE**：`groupby(["num","run_id"]).size()` をやめ、`change → run_id → bincount` で O(n)・低オーバーヘッド化。
- **ソート回避**：`id` が単調増加ならソートせずに進む。
- **不要な正規化を回避**：文字列の `.str.strip()` や正規表現をやめ、まず数値統一を試みる。
- **重複除去は `pd.unique`**：順序保持で高速、`drop_duplicates` より軽い。
- **“任意順序”仕様利用**：出力の並び替えを省略（評価に不要）。

### 計算量

- 前処理（必要ならソート）: `O(n log n)`（単調ならスキップ）
- RLE（NumPy）: `O(n)` 時間・ `O(n)` 空間（追加列なし）

> これで `groupby` 版より **CPU・メモリの両方**がかなり軽くなるはずです。
> さらに詰めるなら、入力が常に数値だと分かっている環境では「数値統一の分岐」を削ってもっと軽くできます。
