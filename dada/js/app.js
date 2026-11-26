import { storage } from './storage.js';
import { renderTormentaSheet, attachTormentaListeners } from './components/tormentaSheet.js';
import { renderOrdemSheet, attachOrdemListeners } from './components/ordemSheet.js';
import { renderDiceRollerModal, initDiceRollerUI } from './components/diceRollerModal.js';

class App {
  constructor() {
    this.currentUser = storage.getCurrentUser();
    this.activeSheet = null;
    window.addEventListener('rpg-sheet-change', () => {
      if (this.activeSheet) this.render();
    });
  }

  init() {
    this.render();
  }

  render() {
    const app = document.getElementById('app');
    if (!app) return;

    if (!this.currentUser) {
      app.innerHTML = `
        <main class="min-h-screen grid place-items-center p-6">
          <section class="panel w-full max-w-md rounded-2xl p-8 shadow-2xl">
            <div class="mb-6 flex items-center gap-3">
              <span class="grid h-12 w-12 place-items-center rounded-xl border border-red-900/70 bg-red-950/40 text-2xl">⚔️</span>
              <div>
                <h1 class="brand-title">Chronicles RPG</h1>
                <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Gerenciador de fichas</p>
              </div>
            </div>
            <p class="mb-6 text-sm leading-6 text-slate-400">Organize personagens de Tormenta20 e Ordem Paranormal em uma mesa de jogo integrada.</p>
            <button id="enter-app" class="action-button w-full rounded-lg border border-red-500/40 bg-red-700 px-4 py-3 font-bold text-white hover:bg-red-600">Entrar como jogador convidado</button>
          </section>
        </main>
      `;
      document.getElementById('enter-app').addEventListener('click', () => {
        this.currentUser = storage.login('jogador@rpg.com', '123');
        this.render();
      });
      return;
    }

    if (this.activeSheet) {
      this.renderSheet(app);
      return;
    }

    const sheets = storage.getSheets(this.currentUser.id);
    app.innerHTML = `
      <main class="dashboard-shell min-h-screen p-4 md:p-8">
        <header class="dashboard-header mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="mb-1 text-xs uppercase tracking-[0.28em] text-slate-500">Mesa pessoal</p>
            <h1 class="brand-title">Chronicles RPG</h1>
            <p class="mt-1 text-sm text-slate-400">${this.currentUser.nome}</p>
          </div>
          <div class="flex gap-2">
            <button id="new-tormenta" class="action-button rounded-lg border border-red-700/60 bg-red-950/70 px-3 py-2 text-sm font-bold text-red-200 hover:bg-red-900">+ Tormenta20</button>
            <button id="new-ordem" class="action-button rounded-lg border border-emerald-700/60 bg-emerald-950/70 px-3 py-2 text-sm font-bold text-emerald-200 hover:bg-emerald-900">+ Ordem</button>
            <button id="logout" class="action-button rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">Sair</button>
          </div>
        </header>
        <section class="grid gap-5 md:grid-cols-2">
          ${sheets.length ? sheets.map(sheet => `
            <article class="sheet-card rounded-xl p-5" data-system="${sheet.sistema}">
              <button type="button" data-sheet-id="${sheet.id}" class="block h-full w-full text-left">
                <div class="mb-6 flex items-center justify-between">
                  <span class="text-2xl">${sheet.sistema === 'ordem' ? '👁️' : '⚔️'}</span>
                  <span class="rounded-full border border-slate-700/70 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">${sheet.sistema === 'ordem' ? 'Ordem' : 'T20'}</span>
                </div>
                <h2 class="text-2xl font-bold">${sheet.nomePersonagem || sheet.nome}</h2>
                <p class="mt-1 text-sm ${sheet.sistema === 'ordem' ? 'text-emerald-400' : 'text-red-400'}">${sheet.sistema === 'ordem' ? 'Ordem Paranormal' : 'Tormenta20'}</p>
              </button>
              <button type="button" data-delete-id="${sheet.id}" class="absolute bottom-4 right-5 text-xs text-slate-600 hover:text-red-400">Excluir</button>
            </article>
          `).join('') : '<p class="text-slate-400">Nenhuma ficha criada.</p>'}
        </section>
      </main>
      ${renderDiceRollerModal()}
    `;

    document.getElementById('logout').addEventListener('click', () => this.logout());
    document.getElementById('new-tormenta').addEventListener('click', () => this.createSheet('tormenta'));
    document.getElementById('new-ordem').addEventListener('click', () => this.createSheet('ordem'));
    app.querySelectorAll('[data-sheet-id]').forEach(button => {
      button.addEventListener('click', () => {
        this.activeSheet = sheets.find(sheet => sheet.id === button.dataset.sheetId) || null;
        this.render();
      });
    });
    app.querySelectorAll('[data-delete-id]').forEach(button => {
      button.addEventListener('click', () => {
        if (confirm('Excluir esta ficha permanentemente?')) {
          storage.deleteSheet(button.dataset.deleteId);
          this.render();
        }
      });
    });
    initDiceRollerUI(document.body);
  }

  renderSheet(app) {
    const sheetContent = this.activeSheet.sistema === 'ordem'
      ? renderOrdemSheet(this.activeSheet, updated => this.updateSheet(updated))
      : renderTormentaSheet(this.activeSheet, updated => this.updateSheet(updated));

    app.innerHTML = `
      <main class="sheet-shell min-h-screen p-4 md:p-8">
        <header class="dashboard-header mb-6 flex items-center justify-between">
          <button id="back-dashboard" class="action-button rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">← Painel</button>
          <button id="save-sheet" class="action-button rounded-lg border border-emerald-700/70 bg-emerald-950/70 px-4 py-2 text-sm font-bold text-emerald-200 hover:bg-emerald-900">Salvar ficha</button>
        </header>
        ${sheetContent}
      </main>
      ${renderDiceRollerModal()}
    `;

    document.getElementById('back-dashboard').addEventListener('click', () => {
      this.activeSheet = null;
      this.render();
    });
    document.getElementById('save-sheet').addEventListener('click', () => {
      this.updateSheet(this.activeSheet);
      this.showStatus('Ficha salva');
    });

    if (this.activeSheet.sistema === 'ordem') {
      attachOrdemListeners(app, this.activeSheet, updated => this.updateSheet(updated));
    } else {
      attachTormentaListeners(app, this.activeSheet, updated => this.updateSheet(updated));
    }
    initDiceRollerUI(document.body);
  }

  createSheet(sistema) {
    this.activeSheet = storage.createSheet(this.currentUser.id, sistema);
    this.render();
  }

  updateSheet(sheet) {
    this.activeSheet = sheet;
    storage.updateSheet(sheet);
  }

  showStatus(message) {
    const status = document.createElement('div');
    status.className = 'fixed bottom-5 left-5 z-[70] rounded-lg border border-emerald-700 bg-emerald-950 px-4 py-2 text-sm text-emerald-200';
    status.textContent = message;
    document.body.appendChild(status);
    setTimeout(() => status.remove(), 1800);
  }

  logout() {
    storage.logout();
    this.currentUser = null;
    this.activeSheet = null;
    this.render();
  }
}

const appInstance = new App();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => appInstance.init(), { once: true });
} else {
  appInstance.init();
}
