#!/bin/python3

# import math
import os

# import random
# import re
# import sys
from typing import List

#
# Complete the 'findPoint' function below.
#
# The function is expected to return an INTEGER_ARRAY.
# The function accepts following parameters:
#  1. INTEGER px
#  2. INTEGER py
#  3. INTEGER qx
#  4. INTEGER qy
#


def findPoint(px: int, py: int, qx: int, qy: int) -> List[int]:
    """
    Reflect point P(px, py) across point Q(qx, qy).
    Reflection R satisfies: Q is the midpoint of PR.
    Therefore: rx = 2*qx - px, ry = 2*qy - py
    """
    rx: int = 2 * qx - px
    ry: int = 2 * qy - py
    return [rx, ry]


if __name__ == "__main__":
    fptr = open(os.environ["OUTPUT_PATH"], "w")

    n = int(input().strip())

    for n_itr in range(n):
        first_multiple_input = input().rstrip().split()

        px = int(first_multiple_input[0])

        py = int(first_multiple_input[1])

        qx = int(first_multiple_input[2])

        qy = int(first_multiple_input[3])

        result = findPoint(px, py, qx, qy)

        fptr.write(" ".join(map(str, result)))
        fptr.write("\n")

    fptr.close()
