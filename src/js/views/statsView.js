// statsView.js
import View from "./View.js";

class StatsView extends View {
  _parentElement = document.querySelector(".container");

  render(statsData) {
    if (!statsData) return;

    const markup = `
      <!-- Welcome Section -->
      <section class="welcome fade-in-up">
        <h1>Your <span class="gradient-text">Stats Dashboard</span></h1>
        <p>Track your progress and achievements 📊</p>
      </section>

      <!-- Stats Cards -->
      <section class="stats-cards fade-in-up">
        <div class="cards">
          <div class="card gradient-primary">
            <div class="card-icon">🏆</div>
            <div class="card-info">
              <h3>Total Quizzes</h3>
              <p>${statsData.totalQuizzes}</p>
            </div>
          </div>
          <div class="card gradient-success">
            <div class="card-icon">🎯</div>
            <div class="card-info">
              <h3>Average Accuracy</h3>
              <p>${statsData.averageAccuracy}%</p>
            </div>
          </div>
          <div class="card gradient-secondary">
            <div class="card-icon">🏅</div>
            <div class="card-info">
              <h3>Total Score</h3>
              <p>${statsData.totalScore}</p>
            </div>
          </div>
          <div class="card bg-accent">
            <div class="card-icon">🥇</div>
            <div class="card-info">
              <h3>High Score</h3>
              <p>${statsData.highScore || 0}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Quizzes -->
      <section class="recent-quizzes fade-in-up">
        <h2>Recent Quizzes</h2>
        <div class="cards">
          ${statsData.recentQuizzes
            .map(
              (quiz) => `
            <div class="card bg-primary">
              <div class="card-icon small">🏆</div>
              <div class="card-info">
                <h3>${quiz.category}</h3>
                <p>${quiz.score} points - ${Math.round(
                (quiz.correctAnswers / quiz.totalQuestions) * 100
              )}% accuracy</p>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new StatsView();
