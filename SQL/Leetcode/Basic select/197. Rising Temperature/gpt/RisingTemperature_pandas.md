# 　 Python 3.10.15 / pandas 2.2.2

## 1) 問題（原文）

- `Write a solution to find all dates' id with higher temperatures compared to its previous dates (yesterday).`
- 入力 DF: `Weather(id: int, recordDate: date/datetime64[ns], temperature: int)`
- 出力: `id` — 各 `recordDate` が **前日（recordDate - 1 日）** より気温が高い行の `id` を返す（順不同）

## 2) 実装（指定シグネチャ厳守）

> **列最小化 → map による軽量結合 → 条件抽出**。欠日（前日が存在しない日）は `NaN` になり自然に除外されます。

```python
import pandas as pd

def rising_temperature(weather: pd.DataFrame) -> pd.DataFrame:
    """
    Returns:
        pd.DataFrame: 列名と順序は ['id']
    """
    # 列最小化（必要列のみ）
    w = weather[['id', 'recordDate', 'temperature']].copy()

    # 日付を安全に datetime64[ns] へ（既に datetime の場合は無変更）
    w['recordDate'] = pd.to_datetime(w['recordDate'], errors='coerce')

    # 前日キーを作成
    yday = w['recordDate'] - pd.Timedelta(days=1)

    # recordDate -> temperature の辞書を作り、前日の気温を map で取得
    temp_by_date = w.set_index('recordDate')['temperature']
    prev_temp = yday.map(temp_by_date)

    # 条件抽出：前日が存在し、かつ気温が上昇
    mask = prev_temp.notna() & (w['temperature'] > prev_temp)

    # 仕様どおりの列・順序で返す（順不同指定のため ORDER は付けない）
    out = w.loc[mask, ['id']].reset_index(drop=True)
    return out

Analyze Complexity

Runtime
326
ms
Beats
29.18%
Memory
68.08
MB
Beats
35.24%
```

## 3) アルゴリズム説明

- 使用 API

  - `pd.to_datetime`: 型の安全化（不正値は `NaT`）
  - `Series.map`: **単一キー → 値**（`recordDate → temperature`）の軽量結合
  - `Series.notna` と ブールインデックス: 条件抽出

- **NULL / 重複 / 型**

  - 前日が無い行は `map` 結果が `NaN` となり除外されるため安全
  - `recordDate` がユニーク前提のためインデックス化は一意に決まる
  - `recordDate` は `datetime64[ns]` に統一してから `Timedelta` 演算を行う

## 4) 計算量（概算）

- 辞書化（`set_index`）: **O(N)**
- `map` によるルックアップ: **O(N)**（ハッシュ参照）
- フィルタリング: **O(N)**
  総計おおむね **O(N)**、メモリは一時 Series 程度

## 5) 図解（Mermaid 超保守版）

```mermaid
flowchart TD
  A[入力 データフレーム]
  B[前処理 列最小化と日付型統一]
  C[recordDate→temperature を辞書化]
  D[前日キーを作成して map]
  E[条件で必要行を抽出]
  F[出力 id 列のみ]
  A --> B
  B --> C
  B --> D
  C --> D
  D --> E
  E --> F
```

## 改善案

ボトルネックは **`map` が内部でインデックス用のハッシュを作りつつ `Series` をもう 1 本作る**点です。`recordDate` がユニークで「前日があるかを**完全一致**で見たい」だけなら、**整数位置のインデクサ**を使うと速く・省メモリになります。

下は **`Index.get_indexer` + `numpy.take`** を使った差し替え版です（ソート不要・I/O なし・`sort_values` 不使用）。

```python
import pandas as pd
import numpy as np

def rising_temperature(weather: pd.DataFrame) -> pd.DataFrame:
    """
    Returns:
        pd.DataFrame: 列名と順序は ['id']
    """
    # 必要列のみ（参照主体でコピーを最小化）
    w = weather[['id', 'recordDate', 'temperature']]

    # 日付を datetime64[ns] に統一（NaT は自動で除外される）
    rd = pd.to_datetime(w['recordDate'], errors='coerce')

    # 可変長オブジェクトを避けて numpy 配列で演算
    temp = w['temperature'].to_numpy()
    ids  = w['id'].to_numpy()

    # DateIndex を作り、(当日-1日) が指す行番号を一括で取得（完全一致のみ）
    idx = pd.Index(rd)  # ユニーク前提
    idxer = idx.get_indexer(idx - pd.Timedelta(days=1))  # 見つからない箇所は -1

    # 前日が存在する位置だけ抽出し、numpy.take で O(1) 参照
    has_prev = idxer != -1
    prev_temp = np.empty_like(temp)
    # 値のある箇所だけ埋める（不要な全要素代入を避ける）
    prev_temp[has_prev] = np.take(temp, idxer[has_prev])

    mask = has_prev & (temp > prev_temp)

    # 仕様どおりの列・順序で返却
    return pd.DataFrame({'id': ids[mask]})

Analyze Complexity

Runtime
278
ms
Beats
91.42%
Memory
67.75
MB
Beats
67.00%

```

### なぜ速く・軽くなるか

- `get_indexer` は **ベクタ化された整数位置探索**で、`map` のような `Series`/辞書中間物を作りません。
- `numpy` 配列で比較まで行うため、**Python レベルのオーバーヘッドが減少**。
- 中間 `Series`（`yday`, `prev_temp`）を作らないので **メモリ削減**。

### 追加の微調整（効果が見込める順）

1. **列型の固定**
   `temperature` が `int32/64`、`id` が `int32/64` になっているか確認（`object` 避け）。

   ```python
   weather = weather.astype({'id':'int64','temperature':'int64'})
   ```

2. **`recordDate` をあらかじめ datetime に**（前処理段階で保証できるなら関数内の変換コストを削減）。
3. **欠日が少なく、データがほぼ連続日**のときだけ：
   並び順が保証されているなら `shift(1)`＋差分チェック（ただし `sort_values` 禁止ポリシーなら、**入力が日付昇順**と仕様で明記できる場合に限定）。
4. **巨大データで列最小化をさらに徹底**
   呼び出し側で `weather = weather[['id','recordDate','temperature']]` にしてから渡す。

### 計算量の見立て（改良版）

- `Index.get_indexer`: **O(N)** に近い（内部実装は型によりハッシュ/二分探索）
- `numpy.take` と比較: **O(N)**
- 総じて **O(N)**、かつ中間オブジェクトが減るぶん **メモリフットプリント縮小**

この置き換えで、一般に **ランタイム短縮（数十％）**・**メモリ削減**が期待できます。
