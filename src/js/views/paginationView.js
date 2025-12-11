import View from "./View.js";

class PaginationView extends View {
  get _parentElement() {
    return document.querySelector(".pagination");
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      const goTo = +btn.dataset.goto;
      handler(goTo);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const maxPage = Math.ceil(this._data.results.length / this._data.perPage);

    // Page 1, others exist
    if (curPage === 1 && maxPage > 1)
      return `
        <button class="btn--inline pagination__btn--next" data-goto="${
          curPage + 1
        }">
          <span>Next</span>
        </button>
      `;

    // Last page
    if (curPage === maxPage && maxPage > 1)
      return `
        <button class="btn--inline pagination__btn--prev" data-goto="${
          curPage - 1
        }">
          <span>Prev</span>
        </button>
      `;

    // Middle pages
    if (curPage < maxPage)
      return `
        <button class="btn--inline pagination__btn--prev" data-goto="${
          curPage - 1
        }">
          <span>Prev</span>
        </button>
        <button class="btn--inline pagination__btn--next" data-goto="${
          curPage + 1
        }">
          <span>Next</span>
        </button>
      `;

    return "";
  }
}

export default new PaginationView();
