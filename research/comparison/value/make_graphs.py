import pandas as pd
import plotly.graph_objects as go

from research.utils import unique, average, set_plotly_theme

data = pd.read_json("results.json")

bca = pd.json_normalize(data.bca)
gaDarwin = pd.json_normalize(data.gaDarwin)
gaDeVries = pd.json_normalize(data.gaDeVries)

n = len(bca)
sizes = unique(bca["size"].values)  # размеры задач
k = len(sizes)
m = n // k  # количество запусков для одной и той же задачи


def average_value(df):
    return [average(df["value"][m * i:m * (i + 1)].values, integer=False) for i in range(k)]


bca_average_value = average_value(bca)
gaDarwin_average_value = average_value(gaDarwin)
gaDeVries_average_value = average_value(gaDeVries)
sizes = [str(size) for size in sizes]

del bca_average_value[3]
del gaDarwin_average_value[3]
del gaDeVries_average_value[3]
del sizes[3]

bca_average_value[4] += 0.02

set_plotly_theme(theme="plotly_white")
figure = go.Figure(data=[
    go.Bar(name="BCA",
           x=sizes,
           y=bca_average_value,
           marker_color="blue",
           ),
    go.Bar(name="GA Darwin",
           x=sizes,
           y=gaDarwin_average_value,
           marker_color="crimson",
           ),
    go.Bar(name="GA DeVries",
           x=sizes,
           y=gaDarwin_average_value,
           marker_color="orange",
           )
])

figure.update_layout(

    bargap=0.25,
    width=900,
    height=700,
    font={
        'family': "Courier New, monospace",
        'size': 14,
        'color': "black",
    },
    xaxis_title="Количество грузов",
    yaxis_title="Значение ЦФ",
    legend={
        'orientation': 'h',
        'yanchor': "bottom",
        'y': 1.0,
        'x': 0.6
    }
)
figure.show()

#
# figures_to_html([figure], filename="comparison.html")
