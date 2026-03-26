document.addEventListener("DOMContentLoaded", async function () {
  const exerciseSelect = document.getElementById("exerciseSelect");
  const trackedSessions = document.getElementById("trackedSessions");
  const bestWeight = document.getElementById("bestWeight");
  const bestVolume = document.getElementById("bestVolume");
  const latestEntry = document.getElementById("latestEntry");
  const progressHistory = document.getElementById("progressHistory");
  const params = new URLSearchParams(window.location.search);

  let weightChart = null;
  let volumeChart = null;

  function createChart(canvasId, label, color) {
    const context = document.getElementById(canvasId);
    return new Chart(context, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: label,
            data: [],
            borderColor: color,
            backgroundColor: color,
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.25
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#f4f1eb"
            }
          }
        },
        scales: {
          x: {
            ticks: { color: "#b9b2a9" },
            grid: { color: "rgba(255,255,255,0.08)" }
          },
          y: {
            ticks: { color: "#b9b2a9" },
            grid: { color: "rgba(255,255,255,0.08)" }
          }
        }
      }
    });
  }

  function setEmptyState() {
    trackedSessions.textContent = "0";
    bestWeight.textContent = "0";
    bestVolume.textContent = "0";
    latestEntry.textContent = "No data yet";
    progressHistory.textContent = "No progress data yet for this exercise.";

    weightChart.data.labels = [];
    weightChart.data.datasets[0].data = [];
    weightChart.update();

    volumeChart.data.labels = [];
    volumeChart.data.datasets[0].data = [];
    volumeChart.update();
  }

  async function loadProgress(exerciseId) {
    if (!exerciseId) {
      setEmptyState();
      return;
    }

    try {
      const data = await window.appUtils.getJSON(`/api/progress/exercise/${exerciseId}`);
      const summary = data.summary || [];

      if (summary.length === 0) {
        setEmptyState();
        return;
      }

      trackedSessions.textContent = summary.length;
      bestWeight.textContent = window.appUtils.formatNumber(Math.max.apply(null, summary.map(function (entry) {
        return Number(entry.topWeight || 0);
      })));
      bestVolume.textContent = window.appUtils.formatNumber(Math.max.apply(null, summary.map(function (entry) {
        return Number(entry.totalVolume || 0);
      })));
      latestEntry.textContent = window.appUtils.formatDate(summary[summary.length - 1].workoutDate);

      weightChart.data.labels = data.chartData.labels;
      weightChart.data.datasets[0].data = data.chartData.topWeight;
      weightChart.update();

      volumeChart.data.labels = data.chartData.labels;
      volumeChart.data.datasets[0].data = data.chartData.totalVolume;
      volumeChart.update();

      progressHistory.innerHTML = data.history.map(function (entry) {
        const bestSet = entry.sets.reduce(function (best, set) {
          return Number(set.weight) > Number(best.weight) ? set : best;
        }, entry.sets[0]);

        return `
          <article class="entry-card">
            <div class="entry-card-top">
              <div>
                <p class="mini-label">${window.appUtils.formatDate(entry.workoutDate)}</p>
                <h3>${entry.title}</h3>
              </div>
              <span class="metric-pill">Best set ${window.appUtils.formatNumber(bestSet.weight)} × ${bestSet.reps}</span>
            </div>
            ${entry.exerciseNotes ? `<p>${entry.exerciseNotes}</p>` : ""}
            <div class="detail-set-list">
              ${entry.sets.map(function (set) {
                return `
                  <div class="detail-set-item">
                    <strong>Set ${set.setNumber}</strong>
                    <span>${window.appUtils.formatNumber(set.weight)} × ${set.reps}</span>
                    <span>${set.notes || "No notes"}</span>
                  </div>
                `;
              }).join("")}
            </div>
          </article>
        `;
      }).join("");
    } catch (error) {
      progressHistory.textContent = error.message;
      setEmptyState();
    }
  }

  try {
    const exerciseData = await window.appUtils.getJSON("/api/exercises");
    const exercises = exerciseData.exercises || [];

    exerciseSelect.innerHTML = ['<option value="">Choose an exercise</option>']
      .concat(exercises.map(function (exercise) {
        return `<option value="${exercise.id}">${exercise.name}</option>`;
      }))
      .join("");

    weightChart = createChart("weightChart", "Top weight", "#ff7a1a");
    volumeChart = createChart("volumeChart", "Total volume", "#b7ff5a");

    const selectedExercise = params.get("exercise");
    if (selectedExercise) {
      exerciseSelect.value = selectedExercise;
      await loadProgress(selectedExercise);
    } else {
      setEmptyState();
    }

    exerciseSelect.addEventListener("change", function () {
      loadProgress(exerciseSelect.value);
    });
  } catch (error) {
    progressHistory.textContent = error.message;
  }
});
