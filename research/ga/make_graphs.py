from research.graphing_utils import make_graphs

make_graphs(
    dir="/home/aleksey/3d_bin/research/ga/47blocks_1try",
    runs_per_point=150,
    size={'width': 1300, 'height': 900},
    xyz={'x': "mp", 'y': "ni", 'z': "value"},
    axis_title={
        'x': "Mp (вероятность мутации)",
        'y': "Ni (количество итераций)",
        'z': "Значение ЦФ",
    },
    ratio={'x': 3, 'y': 2, 'z': 2}
)
