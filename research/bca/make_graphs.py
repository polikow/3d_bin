import os

from research.bca.graphing_utils import make_graphs

# директория, в которой находятся результаты, которые надо визуализировать
DIR = "47blocks_1try"
RUNS = 150
os.chdir(DIR)
make_graphs(
    RUNS,
    size={'width': 900, 'height': 900},
    # ratio={'x': 1, 'y': 9, 'z': 9}
)
