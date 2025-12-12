import View from "./View.js";

class PaginationView extends View {
  get _parentElement() {
    return document.querySelector(".pagination");
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".page-btn");
      if (!btn) return;
      const goTo = +btn.dataset.goto;
      handler(goTo);
    });
  }

  _generateMarkup() {
    if (!this._data || !this._data.results) return "";

    const curPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / this._data.perPage);

    if (numPages <= 1) return "";

    let pagesToShow = [];

    // Determinăm ce pagini afișăm
    if (curPage === 1) pagesToShow = [2];
    else if (curPage === numPages) pagesToShow = [numPages - 1];
    else pagesToShow = [curPage - 1, curPage + 1];

    // Creăm markup
    return pagesToShow
      .map(
        (page) => `
      <button class="page-btn" data-goto="${page}">${page}</button>
    `
      )
      .join("");
  }
}

export default new PaginationView();
