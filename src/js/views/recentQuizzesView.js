import View from "./View.js";

class RecentQuizzesView extends View {
  get _parentElement() {
    return document.querySelector(".recent-list");
  }

  render(data) {
    this._data = data;
    this._clear();
    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      this._generateMarkup()
    );
  }

  _generateMarkup() {
    if (!this._data || this._data.length === 0)
      return `<div class="no-history">No quiz history yet.</div>`;

    return this._data
      .map(
        (q) => `
      <div class="recent-item">
        <div class="left">
          <div class="recent-cat">${q.category}</div>
          <div class="recent-meta">${q.difficulty} • ${new Date(
          q.date
        ).toLocaleString()}</div>
        </div>
        <div class="right">
          <div class="recent-score">${q.score}</div>
          <div class="recent-acc">${Math.round(
            (q.correctAnswers / q.totalQuestions) * 100
          )}%</div>
        </div>
      </div>
    `
      )
      .join("");
  }
}

export default new RecentQuizzesView();
