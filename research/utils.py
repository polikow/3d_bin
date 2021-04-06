import pandas as pd
import plotly.graph_objects as go


# преобразует в упорядоченный список, состоящий из уникальных значений
def unique(iterable):
    return sorted(set(iterable))


def average(iterable):
    return sum(iterable) // len(iterable)


def set_plotly_theme(theme="plotly_white"):
    import plotly.io as pio
    pio.templates.default = "plotly_white"


def surface_figure(df, title, size, ratio, xyz, axis_title):
    x = df[xyz['x']].values
    y = unique(df[xyz['y']].values)
    z = df[xyz['z']].values.reshape((len(unique(y)), len(unique(x))))
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
                'title': axis_title['x'],
                'tickmode': 'array',
                'tickvals': x,
            },
            'yaxis': {
                'title': axis_title['y'],
                'tickmode': 'array',
                'tickvals': y,
            },
            'zaxis': {
                'title': axis_title['z'],
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


def make_graphs(dir, runs_per_point, size=None, ratio=None, xyz=None, axis_title=None):
    """
    defaults:
        size = {"width": 900, 'height': 900}\n
        ratio = {'x': 1, 'y': 1, 'z': 1}
        xyz = {'x': "ci", 'y': "ni", 'z': "value"}\n
        axis_title = {
            'x': "Ci (коэффициент интенсивности мутации)",
            'y': "Ni (количество итераций)",
            'z': "Значение ЦФ"\n
        }
    """
    if size is None:
        size = {"width": 900, 'height': 900}
    if ratio is None:
        ratio = {'x': 1, 'y': 1, 'z': 1}
    if xyz is None:
        xyz = {'x': "ci", 'y': "ni", 'z': "value"}
    if axis_title is None:
        axis_title = {
            'x': "Ci (коэффициент интенсивности мутации)",
            'y': "Ni (количество итераций)",
            'z': "Значение ЦФ"
        }

    average = pd.read_json(f"{dir}/average.json")
    maximum = pd.read_json(f"{dir}/maximum.json")
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
            size, ratio,
            xyz=xyz,
            axis_title=axis_title
        )
        figures.append(figure)
    figures_to_html(figures, filename=f"{dir}/graphs_average.html")

    # максимальное цф
    figures = []
    for i, np_value in zip(range(np), np_values):
        figure = surface_figure(
            maximum[i * np_shift:(i + 1) * np_shift],
            f"Максимальное ЦФ (Размер популяции = {np_value}, количество запусков = {runs_per_point})",
            size, ratio,
            xyz=xyz,
            axis_title=axis_title
        )
        figures.append(figure)
    figures_to_html(figures, filename=f"{dir}/graphs_maximum.html")
