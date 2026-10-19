// Banco temático: cada explicación refuerza el concepto después de responder.
const quizQuestions = [
  { category: "Toma de decisiones", question: "¿Qué caracteriza una decisión basada en datos?", options: ["Se apoya en evidencia relevante, objetivos y contexto", "Sigue siempre el indicador más alto", "Elimina por completo el criterio profesional", "Usa la mayor cantidad posible de datos"], answer: 0, explanation: "La evidencia informa la decisión junto con el contexto, los objetivos y el criterio profesional." },
  { category: "Toma de decisiones", question: "La dirección analiza demanda y costos para decidir si abre un nuevo campus. ¿Qué tipo de decisión es?", options: ["Operativa", "Estratégica", "Táctica", "Automática"], answer: 1, explanation: "Es estratégica: define dirección y recursos a largo plazo para la institución." },
  { category: "Toma de decisiones", question: "¿Cuál es el orden correcto del ciclo de toma de decisiones?", options: ["Análisis → acción → identificación → evaluación", "Acción → evaluación → identificación → análisis", "Identificación → análisis → acción → evaluación", "Evaluación → análisis → acción → identificación"], answer: 2, explanation: "Primero se delimita el problema, luego se analiza, se actúa y finalmente se evalúa el impacto." },
  { category: "Toma de decisiones", question: "¿Cómo ayuda BI principalmente durante la etapa de evaluación?", options: ["Oculta las variaciones inesperadas", "Mide resultados frente a objetivos definidos", "Sustituye la intervención por un informe", "Reúne datos sin considerar el periodo"], answer: 1, explanation: "Los indicadores permiten comparar resultados con objetivos y aprender del efecto de la intervención." },
  { category: "Toma de decisiones", question: "Una coordinación asigna tutorías para el próximo semestre según resultados por curso. Es una decisión…", options: ["Estratégica", "Táctica", "Operativa", "Financiera"], answer: 1, explanation: "Es táctica: traduce objetivos institucionales en asignación de recursos a mediano plazo." },
  { category: "Proceso ETL", question: "¿Qué significa la fase Extract en ETL?", options: ["Publicar informes para usuarios", "Extraer datos desde una o varias fuentes", "Eliminar datos históricos", "Entrenar un modelo predictivo"], answer: 1, explanation: "Extract captura datos desde sistemas como ERP, CRM, APIs o archivos planos." },
  { category: "Proceso ETL", question: "¿Cuál es una tarea propia de Transform?", options: ["Limpiar duplicados y normalizar formatos", "Diseñar un panel de control", "Dar permisos al data warehouse", "Definir la pregunta del análisis"], answer: 0, explanation: "En Transform se limpian, normalizan, enriquecen y validan los datos." },
  { category: "Proceso ETL", question: "¿Cuál de estos es un posible destino de la fase Load?", options: ["Una API de origen", "Una hoja sin validar", "Un data warehouse", "El sistema CRM fuente"], answer: 2, explanation: "Load carga los datos preparados en destinos analíticos como un warehouse, lake o data mart." },
  { category: "Proceso ETL", question: "¿Por qué conviene validar la calidad antes de cargar los datos?", options: ["Para asegurar que cumplen reglas y evitar análisis engañosos", "Para aumentar el volumen almacenado", "Para convertir datos en opiniones", "Para eliminar la necesidad de documentar"], answer: 0, explanation: "Las validaciones detectan errores antes de que afecten informes o decisiones." },
  { category: "Proceso ETL", question: "Una institución integra asistencia, entregas y notas para detectar estudiantes que necesitan apoyo. ¿Qué práctica es más responsable?", options: ["Usar la alerta como diagnóstico definitivo", "Compartir los datos sin restricciones", "Proteger datos sensibles y usar la alerta para orientar apoyo", "Ignorar el contexto de cada estudiante"], answer: 2, explanation: "Los indicadores deben protegerse y orientar el acompañamiento, nunca etiquetar por sí solos." },
  { category: "Toma de decisiones", question: "¿Qué pregunta debería guiar un análisis útil de BI?", options: ["¿Qué gráficos podemos añadir?", "¿Qué decisión queremos informar?", "¿Cuántas métricas caben en la pantalla?", "¿Qué herramienta tiene más funciones?"], answer: 1, explanation: "El análisis comienza con una pregunta de decisión concreta; las métricas y herramientas vienen después." },
  { category: "Proceso ETL", question: "¿Qué beneficio ofrece una carga incremental?", options: ["Actualiza solo datos nuevos o modificados", "Evita cualquier regla de validación", "Transforma datos sin registrar errores", "Elimina la necesidad de una fuente"], answer: 0, explanation: "Las cargas incrementales reducen trabajo y transferencia al procesar solo cambios desde la última ejecución." }
];

const quizState = { questions: quizQuestions, current: 0, score: 0, correctAnswers: 0, streak: 0, bestStreak: 0, answered: false, timer: null, secondsLeft: 0, timedOut: false };
const bestScoreKey = "aulaDatosQuizBest";

function initSharedUI() {
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
  });
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));
}

function updateQuizProgress() {
  const progress = Math.round((quizState.current / quizState.questions.length) * 100);
  const bar = document.getElementById("progressBar");
  const progressContainer = document.querySelector(".quiz-progress");
  bar.style.width = `${progress}%`;
  progressContainer.setAttribute("aria-valuemax", String(quizState.questions.length));
  progressContainer.setAttribute("aria-valuenow", String(quizState.current));
  document.getElementById("questionCounter").textContent = `Pregunta ${quizState.current + 1} de ${quizState.questions.length}`;
  document.getElementById("scoreDisplay").textContent = `${quizState.score} pts`;
  document.getElementById("streakDisplay").innerHTML = `<i class="bi bi-fire" aria-hidden="true"></i> Racha: ${quizState.streak}`;
}

function renderQuestion() {
  quizState.answered = false;
  quizState.timedOut = false;
  const item = quizState.questions[quizState.current];
  updateQuizProgress();
  const content = document.getElementById("quizContent");
  content.innerHTML = `<div class="question-heading"><div><p class="question-category">${item.category}</p><h3 id="activeQuestion">${item.question}</h3></div><span class="question-clock" id="questionClock" aria-live="polite"></span></div><div class="answer-list" role="group" aria-labelledby="activeQuestion">${item.options.map((option, index) => `<button type="button" class="answer-option" data-answer="${index}"><span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span></button>`).join("")}</div><div id="feedbackArea" aria-live="polite"></div>`;
  content.querySelectorAll(".answer-option").forEach(button => button.addEventListener("click", () => selectAnswer(Number(button.dataset.answer))));
  startQuestionTimer();
}

function startQuestionTimer() {
  clearInterval(quizState.timer);
  const enabled = document.getElementById("timerEnabled").checked;
  const clock = document.getElementById("questionClock");
  if (!enabled) { clock.classList.remove("active"); return; }
  quizState.secondsLeft = Number(document.getElementById("timerDuration").value);
  clock.classList.add("active");
  function tick() {
    clock.textContent = `${quizState.secondsLeft}s`;
    clock.classList.toggle("urgent", quizState.secondsLeft <= 5);
    if (quizState.secondsLeft <= 0) {
      clearInterval(quizState.timer);
      quizState.timedOut = true;
      selectAnswer(-1);
      return;
    }
    quizState.secondsLeft -= 1;
  }
  tick();
  quizState.timer = window.setInterval(tick, 1000);
}

function selectAnswer(selectedIndex) {
  if (quizState.answered) return;
  quizState.answered = true;
  clearInterval(quizState.timer);
  const item = quizState.questions[quizState.current];
  const correct = selectedIndex === item.answer;
  const buttons = document.querySelectorAll(".answer-option");
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.answer) button.classList.add("correct");
    if (index === selectedIndex && !correct) button.classList.add("incorrect");
  });
  if (correct) {
    quizState.correctAnswers += 1;
    quizState.streak += 1;
    quizState.bestStreak = Math.max(quizState.bestStreak, quizState.streak);
    // La bonificación crece con la racha, además de los 100 puntos base.
    quizState.score += 100 + Math.max(0, quizState.streak - 1) * 25;
  } else {
    quizState.streak = 0;
  }
  updateQuizProgress();
  const feedbackTitle = correct ? "¡Correcto!" : quizState.timedOut ? "Se acabó el tiempo" : "No exactamente";
  const feedbackClass = correct ? "is-correct" : "is-wrong";
  document.getElementById("feedbackArea").innerHTML = `<div class="quiz-feedback ${feedbackClass}"><strong>${feedbackTitle}${correct && quizState.streak > 1 ? ` · Racha x${quizState.streak}` : ""}</strong><p>${item.explanation}</p></div><div class="quiz-next-row"><button type="button" class="btn btn-accent" id="nextQuestion">${quizState.current === quizState.questions.length - 1 ? "Ver resultados" : "Siguiente pregunta"} <i class="bi bi-arrow-right" aria-hidden="true"></i></button></div>`;
  document.getElementById("nextQuestion").addEventListener("click", () => {
    quizState.current += 1;
    if (quizState.current >= quizState.questions.length) showResults();
    else renderQuestion();
  });
}

function getBadge(percentage) {
  if (percentage >= 90) return { title: "Experto BI", icon: "bi-trophy-fill", message: "Excelente lectura de los datos. Ya puedes aplicar estos fundamentos con criterio." };
  if (percentage >= 70) return { title: "Analista BI", icon: "bi-award-fill", message: "Vas por muy buen camino. Conectas conceptos y decisiones con solidez." };
  if (percentage >= 40) return { title: "Aprendiz BI", icon: "bi-lightning-charge-fill", message: "Ya tienes una base. Repasa el ciclo ETL y vuelve a intentarlo para afianzarla." };
  return { title: "Explorador de datos", icon: "bi-compass-fill", message: "Cada análisis empieza con una pregunta. Revisa los fundamentos y prueba de nuevo." };
}

function showResults() {
  clearInterval(quizState.timer);
  const total = quizState.questions.length;
  const correct = quizState.correctAnswers;
  const percentage = Math.round((correct / total) * 100);
  const badge = getBadge(percentage);
  const previousBest = Number(localStorage.getItem(bestScoreKey) || 0);
  if (quizState.score > previousBest) localStorage.setItem(bestScoreKey, String(quizState.score));
  document.querySelector(".quiz-progress").setAttribute("aria-valuenow", String(total));
  document.getElementById("progressBar").style.width = "100%";
  document.getElementById("questionCounter").textContent = "Cuestionario completado";
  document.getElementById("scoreDisplay").textContent = `${quizState.score} pts`;
  document.getElementById("quizContent").innerHTML = `<div class="quiz-results"><span class="result-medal"><i class="bi ${badge.icon}" aria-hidden="true"></i></span><h3>${badge.title}</h3><p class="result-subtitle">${badge.message}</p><div class="result-stats"><div class="result-stat"><strong>${quizState.score}</strong><span>PUNTOS</span></div><div class="result-stat"><strong>${percentage}%</strong><span>ACIERTOS</span></div><div class="result-stat"><strong>${quizState.bestStreak}</strong><span>MEJOR RACHA</span></div></div><p class="result-message">${correct} de ${total} respuestas correctas. ${percentage >= 70 ? "¡Buen trabajo!" : "El conocimiento mejora con cada intento."}</p><button type="button" class="btn btn-accent" id="restartQuiz">Intentarlo de nuevo <i class="bi bi-arrow-repeat" aria-hidden="true"></i></button></div>`;
  document.getElementById("restartQuiz").addEventListener("click", resetQuiz);
  updateBestScore();
}

function updateBestScore() {
  const best = localStorage.getItem(bestScoreKey);
  document.getElementById("bestScore").innerHTML = `<i class="bi bi-trophy" aria-hidden="true"></i> Tu mejor resultado: ${best ? `${best} puntos` : "aún sin intentos"}`;
}

function resetQuiz() {
  clearInterval(quizState.timer);
  quizState.current = 0;
  quizState.score = 0;
  quizState.correctAnswers = 0;
  quizState.streak = 0;
  quizState.bestStreak = 0;
  renderQuestion();
}

function initQuiz() {
  initSharedUI();
  updateBestScore();
  document.getElementById("startQuiz").addEventListener("click", renderQuestion);
  const timerCheckbox = document.getElementById("timerEnabled");
  timerCheckbox.addEventListener("change", () => {
    document.getElementById("timerDuration").disabled = !timerCheckbox.checked;
    if (quizState.current < quizState.questions.length && !quizState.answered && document.getElementById("activeQuestion")) startQuestionTimer();
  });
  document.getElementById("timerDuration").addEventListener("change", () => {
    if (timerCheckbox.checked && !quizState.answered && document.getElementById("activeQuestion")) startQuestionTimer();
  });
}

document.addEventListener("DOMContentLoaded", initQuiz);
