/**
 * Aplicação Principal: Gerenciador de Fichas e Campanhas de RPG
 * Orquestra Autenticação, Dashboard de Fichas, Alternância de Sistemas e Rolagens
 */
import { storage } from './storage.js';
import { renderTormentaSheet, attachTormentaListeners } from './components/tormentaSheet.js';
import { renderOrdemSheet, attachOrdemListeners } from './components/ordemSheet.js';
import { renderDiceRollerModal, initDiceRollerUI } from './components/diceRollerModal.js';
class App {
  constructor() {
    this.currentUser = storage.getCurrentUser();
    this.currentView = this.currentUser ? 'dashboard' : 'auth';
    this.activeSheetId = null;
    this.authTab = 'login'; // 'login' | 'register'
    this.systemFilter = 'all'; // 'all' | 'tormenta' | 'ordem'
  }
  init() {
    this.render();
    initDiceRollerUI(document.body);
  }
  setCurrentUser(user) {
    this.currentUser = user;
    this.currentView = user ? 'dashboard' : 'auth';
    this.activeSheetId = null;
    this.render();
  }
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const bgColors = {
      success: 'bg-emerald-950 border-emerald-600 text-emerald-200',
      error: 'bg-red-950 border-red-600 text-red-200',
      info: 'bg-slate-900 border-slate-700 text-slate-200'
    };
    toast.className = `fixed bottom-5 left-5 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl border shadow-xl text-xs font-semibold backdrop-blur-md transition-all duration-300 transform translate-y-4 opacity-0 ${bgColors[type] || bgColors.info}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    });
  }
}