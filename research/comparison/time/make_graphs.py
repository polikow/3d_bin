import pandas as pd
import plotly.graph_objects as go

from research.utils import unique, average, set_plotly_theme, figures_to_html

data = pd.read_json("results.json")

bca = pd.json_normalize(data.bca)
gaDarwin = pd.json_normalize(data.gaDarwin)
gaDeVries = pd.json_normalize(data.gaDeVries)

n = len(bca)
sizes = unique(bca["size"].values)  # размеры задач
k = len(sizes)
m = n // k  # количество запусков для одной и той же задачи


def average_time(df):
    return [average(df["time"][m * i:m * (i + 1)].values) for i in range(k)]


def milliseconds_to_seconds(iterable):
    return [a / 1000 for a in iterable]


bca_average_time = milliseconds_to_seconds(average_time(bca))
gaDarwin_average_time = milliseconds_to_seconds(average_time(gaDarwin))
gaDeVries_average_time = milliseconds_to_seconds(average_time(gaDeVries))

set_plotly_theme(theme="plotly_white")
figure = go.Figure()
figure.add_trace(go.Scatter(x=sizes, mode="lines",
                            y=bca_average_time,
                            name="BCA",
                            line={'color': "blue"},
                            ))

figure.add_trace(go.Scatter(x=sizes, mode="lines",
                            y=gaDarwin_average_time,
                            name="GA Darwin",
                            line={'color': "crimson"},
                            ))

figure.add_trace(go.Scatter(x=sizes, mode="lines",
                            y=gaDeVries_average_time,
                            name="GA DeVries",
                            line={'color': "orange"},
                            ))

figure.update_layout(
    width=900,
    height=700,
    font={
        'family': "Courier New, monospace",
        'size': 13,
        'color': "black",
    },
    xaxis_title="Количество грузов",
    yaxis_title="Время выполнения (сек.)",
    legend={
        'orientation': 'h',
        'yanchor': "bottom",
        'y': 1.0,
        'x': 0.6
    }
)

figures_to_html([figure], filename="comparison.html")
figure.show()
