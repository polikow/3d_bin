import os

import pandas as pd
import plotly.graph_objects as go


# преобразует в упорядоченный список, состоящий из уникальных значений
def unique(iterable):
    return sorted(set(iterable))


def surface_figure(df, title, size=None, ratio=None):
    x = df.ci.values
    y = unique(df.ni.values)
    z = df.value.values.reshape((len(unique(y)), len(unique(x))))
    surface = go.Surface(x=x, y=y, z=z)
    figure = go.Figure(data=[surface])
    figure.update_layout(
        **size,
        scene_aspectmode="manual",
        scene_aspectratio={**ratio},
        font={
            'family': "Courier New, monospace",
            'size': 12,
            'color': "black",
        },
        title={
            'text': title,
            'x': 0.5,
            'font': {
                'size': 18,
            }
        },
        scene={
            'xaxis': {
                'title': 'Ci (коэффициент интенсивности мутации)',
                'tickmode': 'array',
                'tickvals': x,
            },
            'yaxis': {
                'title': 'Ni (количество итераций)',
                'tickmode': 'array',
                'tickvals': y,
            },
            'zaxis': {
                'title': 'Значение ЦФ',
            },
        })

    return figure


def figures_to_html(figs, filename="dashboard.html"):
    dashboard = open(filename, 'w')
    dashboard.write("<html><head></head><body>" + "\n")
    for fig in figs:
        inner_html = fig.to_html().split('<body>')[1].split('</body>')[0]
        dashboard.write(inner_html)
    dashboard.write("</body></html>" + "\n")


def make_graphs(runs_per_point=150, size=None, ratio=None):
    """
    defaults:
        size = {"width": 900, 'height': 900}\n
        ratio = {'x': 1, 'y': 1, 'z': 1}
    """
    if size is None:
        size = {"width": 900, 'height': 900}
    if ratio is None:
        ratio = {'x': 1, 'y': 1, 'z': 1}

    wd = os.getcwd()
    average = pd.read_json(f"{wd}/average.json")
    maximum = pd.read_json(f"{wd}/maximum.json")
    n = average.__len__()
    np_values = unique(average.np.values)
    np = len(np_values)  # количество тестов с разными размерами популяции
    np_shift = n // np  # промежуток между разными популяциями

    # среднее цф
    figures = []
    for i, np_value in zip(range(np), np_values):
        figure = surface_figure(
            average[i * np_shift:(i + 1) * np_shift],
            f"Среднее ЦФ (Размер популяции = {np_value}, количество запусков = {runs_per_point})",
            size, ratio)
        figures.append(figure)
    figures_to_html(figures, filename="graphs_average.html")

    # максимальное цф
    figures = []
    for i, np_value in zip(range(np), np_values):
        figure = surface_figure(
            maximum[i * np_shift:(i + 1) * np_shift],
            f"Максимальное ЦФ (Размер популяции = {np_value}, количество запусков = {runs_per_point})",
            size, ratio)
        figures.append(figure)
    figures_to_html(figures, filename="graphs_maximum.html")
