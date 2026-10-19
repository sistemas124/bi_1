const chartPalette = { blue: "#397f9f", green: "#76a86e", orange: "#e6a05d", violet: "#817eae", paleBlue: "#a9cbd5", red: "#c87569", grid: "rgba(115,132,147,.16)", text: "#738493" };
const chartInstances = {};

function getChartTheme() {
  const dark = document.body.classList.contains("theme-dark");
  return { text: dark ? "#c2d0d7" : chartPalette.text, grid: dark ? "rgba(194,208,215,.14)" : chartPalette.grid };
}

function createChart(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas || typeof Chart === "undefined") return;
  if (chartInstances[id]) chartInstances[id].destroy();
  chartInstances[id] = new Chart(canvas, config);
}

function renderDashboardCharts(data) {
  if (typeof Chart === "undefined") return;
  const theme = getChartTheme();
  Chart.defaults.font.family = '"DM Sans", sans-serif';
  Chart.defaults.color = theme.text;
  Chart.defaults.plugins.tooltip.backgroundColor = "#102b3f";
  Chart.defaults.plugins.tooltip.padding = 11;
  Chart.defaults.plugins.tooltip.cornerRadius = 3;

  createChart("subjectChart", {
    type: "bar",
    data: { labels: data.subjects.labels, datasets: [{ label: "Promedio / 10", data: data.subjects.values, backgroundColor: [chartPalette.blue, chartPalette.green, chartPalette.orange, chartPalette.violet, chartPalette.paleBlue, "#83a58f"], borderRadius: 3, maxBarThickness: 36 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: context => ` ${context.parsed.y.toFixed(1)} / 10` } } }, scales: { y: { beginAtZero: true, max: 10, grid: { color: theme.grid }, ticks: { stepSize: 2 } }, x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: false } } } }
  });

  // Ambas donas comparten leyenda y tooltip para mantener la lectura consistente.
  const donutOptions = { responsive: true, maintainAspectRatio: false, cutout: "65%", plugins: { legend: { position: "bottom", labels: { usePointStyle: true, pointStyle: "circle", padding: 15, boxWidth: 8, font: { size: 10 } } }, tooltip: { callbacks: { label: context => ` ${context.label}: ${context.parsed.toLocaleString("es-ES")} estudiantes` } } } };
  createChart("levelChart", { type: "doughnut", data: { labels: data.levels.labels, datasets: [{ data: data.levels.values, backgroundColor: [chartPalette.blue, chartPalette.orange, chartPalette.green], borderWidth: 3, borderColor: document.body.classList.contains("theme-dark") ? "#1b3545" : "#ffffff", hoverOffset: 5 }] }, options: donutOptions });

  createChart("enrollmentChart", {
    type: "line",
    data: { labels: data.enrollment.labels, datasets: [{ label: "Inscripciones", data: data.enrollment.values, borderColor: chartPalette.blue, backgroundColor: "rgba(57,127,159,.12)", fill: true, tension: .35, pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: chartPalette.blue, borderWidth: 2 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: context => ` ${context.parsed.y.toLocaleString("es-ES")} estudiantes` } } }, scales: { y: { beginAtZero: false, grid: { color: theme.grid }, ticks: { callback: value => `${value}` } }, x: { grid: { display: false } } } }
  });

  createChart("courseChart", {
    type: "bar",
    data: { labels: data.courses.labels, datasets: [{ label: "Aprobación", data: data.courses.values, backgroundColor: [chartPalette.green, chartPalette.blue, chartPalette.orange, chartPalette.violet, chartPalette.paleBlue], borderRadius: 3, maxBarThickness: 22 }] },
    options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: context => ` ${context.parsed.x}% de aprobación` } } }, scales: { x: { beginAtZero: true, max: 100, grid: { color: theme.grid }, ticks: { callback: value => `${value}%` } }, y: { grid: { display: false }, ticks: { font: { size: 10 } } } } }
  });

  createChart("statusChart", { type: "doughnut", data: { labels: data.status.labels, datasets: [{ data: data.status.values, backgroundColor: [chartPalette.green, chartPalette.orange, chartPalette.blue, chartPalette.red], borderWidth: 3, borderColor: document.body.classList.contains("theme-dark") ? "#1b3545" : "#ffffff", hoverOffset: 5 }] }, options: donutOptions });
}
