import View from "./View.js";

class SettingsView extends View {
  _parentElement = document.querySelector(".settings-cards");
  _clearBtn = document.querySelector(".btn-clear");
  _exportBtn = document.querySelector(".btn-export");

  addHandlerClear(handler) {
    this._clearBtn?.addEventListener("click", () => {
      const confirmed = confirm(
        "Are you sure you want to clear all quiz history and stats? This cannot be undone."
      );
      if (confirmed) handler();
    });
  }

  addHandlerExport(handler) {
    this._exportBtn?.addEventListener("click", handler);
  }
}

export default new SettingsView();
