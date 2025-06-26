<?php

class SegmentTree {
    private $size;
    private $data;

    public function __construct($n) {
        $this->size = 1;
        while ($this->size < $n) {
            $this->size <<= 1;
        }
        $this->data = array_fill(0, $this->size * 2, 0);
    }

    public function update($pos, $value) {
        $pos += $this->size;
        $this->data[$pos] = $value;
        while ($pos > 1) {
            $pos >>= 1;
            $this->data[$pos] = max($this->data[$pos * 2], $this->data[$pos * 2 + 1]);
        }
    }

    public function query($l, $r) {
        $l += $this->size;
        $r += $this->size;
        $res = 0;
        while ($l < $r) {
            if ($l % 2 === 1) {
                $res = max($res, $this->data[$l]);
                $l++;
            }
            if ($r % 2 === 1) {
                $r--;
                $res = max($res, $this->data[$r]);
            }
            $l >>= 1;
            $r >>= 1;
        }
        return $res;
    }
}

// 標準入力から読み込む
fscanf(STDIN, "%d %d", $n, $q);
$seg = new SegmentTree($n);

for ($i = 0; $i < $q; $i++) {
    $line = trim(fgets(STDIN));
    $parts = explode(" ", $line);
    if ((int)$parts[0] === 1) {
        // クエリ1: 更新
        $pos = (int)$parts[1] - 1;
        $x = (int)$parts[2];
        $seg->update($pos, $x);
    } else {
        // クエリ2: 区間最大値
        $l = (int)$parts[1] - 1;
        $r = (int)$parts[2] - 1;
        echo $seg->query($l, $r) . PHP_EOL;
    }
}