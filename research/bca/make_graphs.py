from research.utils import make_graphs

make_graphs(
    dir="/home/aleksey/3d_bin/research/bca/47blocks_4try",
    runs_per_point=200,
    size={'width': 1300, 'height': 950},
    xyz={'x': "ci", 'y': "ni", 'z': "value"},
    axis_title={
        'x': "Ci (коэффициент интенсивности мутации)",
        'y': "Ni (количество итераций)",
        'z': "Значение ЦФ",
    },
    ratio={'x': 3, 'y': 1, 'z': 1}
)
