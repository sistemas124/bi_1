// Datos simulados por periodo para que los filtros funcionen sin backend.
const dashboardData = {
  month: {
    kpis: { active: 2480, approval: 86.4, average: 8.2, completion: 74.8 },
    trends: { active: 8.2, approval: 3.1, average: -0.4, completion: 5.6 },
    subjects: { labels: ["Matemáticas", "Ciencias", "Lengua", "Historia", "Tecnología", "Arte"], values: [7.6, 8.4, 8.1, 7.9, 8.8, 9.1] },
    levels: { labels: ["Primaria", "Secundaria", "Universidad"], values: [860, 940, 680] },
    enrollment: { labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"], values: [212, 238, 195, 246, 265, 220, 204, 287, 318, 276, 301, 354] },
    courses: { labels: ["Introducción a datos", "Comunicación", "Biología", "Álgebra", "Historia"], values: [96, 93, 91, 89, 87] },
    status: { labels: ["Activos", "Inactivos", "Graduados", "Retirados"], values: [2480, 165, 520, 95] }
  },
  semester: {
    kpis: { active: 2480, approval: 86.4, average: 8.2, completion: 74.8 },
    trends: { active: 8.2, approval: 3.1, average: -0.4, completion: 5.6 },
    subjects: { labels: ["Matemáticas", "Ciencias", "Lengua", "Historia", "Tecnología", "Arte"], values: [7.6, 8.4, 8.1, 7.9, 8.8, 9.1] },
    levels: { labels: ["Primaria", "Secundaria", "Universidad"], values: [860, 940, 680] },
    enrollment: { labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"], values: [212, 238, 195, 246, 265, 220, 204, 287, 318, 276, 301, 354] },
    courses: { labels: ["Introducción a datos", "Comunicación", "Biología", "Álgebra", "Historia"], values: [96, 93, 91, 89, 87] },
    status: { labels: ["Activos", "Inactivos", "Graduados", "Retirados"], values: [2480, 165, 520, 95] }
  },
  year: {
    kpis: { active: 7340, approval: 83.7, average: 8.0, completion: 71.2 },
    trends: { active: 11.4, approval: 2.4, average: 1.2, completion: 4.3 },
    subjects: { labels: ["Matemáticas", "Ciencias", "Lengua", "Historia", "Tecnología", "Arte"], values: [7.4, 8.1, 8.3, 7.8, 8.6, 8.9] },
    levels: { labels: ["Primaria", "Secundaria", "Universidad"], values: [2580, 2940, 1820] },
    enrollment: { labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"], values: [480, 520, 430, 590, 650, 570, 460, 720, 810, 680, 770, 920] },
    courses: { labels: ["Introducción a datos", "Comunicación", "Biología", "Álgebra", "Historia"], values: [95, 92, 90, 88, 85] },
    status: { labels: ["Activos", "Inactivos", "Graduados", "Retirados"], values: [7340, 510, 1540, 280] }
  }
};

const students = [
  { id: "ED-24081", name: "Lucía Fernández", course: "Ciencias", grade: 9.6, status: "Activo", date: "18 oct 2026" },
  { id: "ED-24076", name: "Mateo González", course: "Matemáticas", grade: 9.3, status: "Activo", date: "17 oct 2026" },
  { id: "ED-24069", name: "Valentina Ruiz", course: "Tecnología", grade: 9.1, status: "Seguimiento", date: "16 oct 2026" },
  { id: "ED-24055", name: "Santiago López", course: "Comunicación", grade: 8.9, status: "Activo", date: "15 oct 2026" },
  { id: "ED-24042", name: "Camila Torres", course: "Historia", grade: 8.8, status: "Graduado", date: "14 oct 2026" }
];

function formatNumber(value) { return new Intl.NumberFormat("es-ES").format(value); }

function updateKpiTrend(id, value) {
  const element = document.getElementById(id);
  const rising = value >= 0;
  element.className = `kpi-trend ${rising ? "trend-up" : "trend-down"}`;
  element.innerHTML = `<i class="bi ${rising ? "bi-arrow-up-right" : "bi-arrow-down-right"}" aria-hidden="true"></i> ${Math.abs(value).toFixed(1)}% <span>vs. periodo anterior</span>`;
}

function renderKpis(data) {
  document.getElementById("kpiActive").textContent = formatNumber(data.kpis.active);
  document.getElementById("kpiApproval").innerHTML = `${data.kpis.approval.toFixed(1)}<span>%</span>`;
  document.getElementById("kpiAverage").innerHTML = `${data.kpis.average.toFixed(1)}<span>/10</span>`;
  document.getElementById("kpiCompletion").innerHTML = `${data.kpis.completion.toFixed(1)}<span>%</span>`;
  updateKpiTrend("trendActive", data.trends.active);
  updateKpiTrend("trendApproval", data.trends.approval);
  updateKpiTrend("trendAverage", data.trends.average);
  updateKpiTrend("trendCompletion", data.trends.completion);
}

function renderStudentTable() {
  const tbody = document.getElementById("studentRows");
  tbody.innerHTML = students.map(student => {
    const statusClass = student.status === "Activo" ? "active" : student.status === "Graduado" ? "graduate" : "follow";
    return `<tr><td class="student-id">${student.id}</td><td class="student-name">${student.name}</td><td>${student.course}</td><td class="grade-value">${student.grade.toFixed(1)}</td><td><span class="status-badge ${statusClass}">${student.status}</span></td><td>${student.date}</td></tr>`;
  }).join("");
}

function cloneData(period) {
  return JSON.parse(JSON.stringify(dashboardData[period] || dashboardData.semester));
}

function randomizeData(data) {
  const variation = (value, range, decimals = 0) => {
    const result = value * (1 + (Math.random() * 2 - 1) * range);
    return decimals ? Number(result.toFixed(decimals)) : Math.round(result);
  };
  // Cada actualización conserva los rangos plausibles del conjunto elegido.
  data.kpis.active = variation(data.kpis.active, .035);
  data.kpis.approval = variation(data.kpis.approval, .025, 1);
  data.kpis.average = Math.min(10, variation(data.kpis.average, .025, 1));
  data.kpis.completion = variation(data.kpis.completion, .04, 1);
  Object.keys(data.trends).forEach(key => { data.trends[key] = Number((Math.random() * 12 - 3).toFixed(1)); });
  data.subjects.values = data.subjects.values.map(value => Math.min(10, Math.max(5, variation(value, .08, 1))));
  data.levels.values = data.levels.values.map(value => variation(value, .06));
  data.enrollment.values = data.enrollment.values.map(value => variation(value, .12));
  data.courses.values = data.courses.values.map(value => Math.min(99, variation(value, .04)));
  data.status.values = data.status.values.map(value => variation(value, .06));
  return data;
}

function renderDashboard(data) {
  renderKpis(data);
  renderDashboardCharts(data);
}

function initDashboard() {
  initDashboardSharedUI();
  renderStudentTable();
  const periodFilter = document.getElementById("periodFilter");
  let currentData = cloneData(periodFilter.value);
  renderDashboard(currentData);
  periodFilter.addEventListener("change", () => {
    currentData = cloneData(periodFilter.value);
    renderDashboard(currentData);
  });
  document.getElementById("refreshData").addEventListener("click", event => {
    const button = event.currentTarget;
    button.classList.add("is-loading");
    currentData = randomizeData(cloneData(periodFilter.value));
    renderDashboard(currentData);
    document.getElementById("lastUpdated").textContent = `Actualizado ${new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(new Date())}`;
    window.setTimeout(() => button.classList.remove("is-loading"), 500);
  });
}

function initDashboardSharedUI() {
  const themeButton = document.querySelector(".theme-toggle");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (localStorage.getItem("aulaDatosTheme") === "dark" || (!localStorage.getItem("aulaDatosTheme") && prefersDark)) document.body.classList.add("theme-dark");
  function updateThemeButton() {
    if (!themeButton) return;
    const dark = document.body.classList.contains("theme-dark");
    themeButton.setAttribute("aria-label", dark ? "Activar tema claro" : "Activar tema oscuro");
    themeButton.innerHTML = `<i class="bi ${dark ? "bi-sun" : "bi-moon-stars"}" aria-hidden="true"></i>`;
  }
  updateThemeButton();
  themeButton?.addEventListener("click", () => {
    document.body.classList.toggle("theme-dark");
    localStorage.setItem("aulaDatosTheme", document.body.classList.contains("theme-dark") ? "dark" : "light");
    updateThemeButton();
    const currentPeriod = document.getElementById("periodFilter").value;
    renderDashboard(cloneData(currentPeriod));
  });
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));
}

document.addEventListener("DOMContentLoaded", initDashboard);
