import { getTormentaDemo, getOrdemDemo } from '../data/templates.js';

const USERS_KEY = 'rpg_manager_users_v1';
const SESSION_KEY = 'rpg_manager_session_v1';
const SHEETS_KEY = 'rpg_manager_sheets_v1';

export class StorageService {
  constructor() {
    this.initDefaults();
  }

  initDefaults() {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify([
        { id: 'user_default', nome: 'Jogador Convidado', email: 'jogador@rpg.com', senha: '123' }
      ]));
    }
    if (!localStorage.getItem(SHEETS_KEY)) {
      localStorage.setItem(SHEETS_KEY, JSON.stringify([
        getOrdemDemo('user_default'),
        getTormentaDemo('user_default')
      ]));
    }
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch {
      return null;
    }
  }

  login(email, senha) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(item => item.email === email && item.senha === senha);
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user || null;
  }

  logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  getSheets(userId) {
    try {
      return (JSON.parse(localStorage.getItem(SHEETS_KEY) || '[]'))
        .filter(sheet => sheet.userId === userId);
    } catch {
      return [];
    }
  }

  updateSheet(sheet) {
    try {
      const sheets = JSON.parse(localStorage.getItem(SHEETS_KEY) || '[]');
      const index = sheets.findIndex(item => item.id === sheet.id);
      if (index >= 0) {
        sheets[index] = sheet;
      } else {
        sheets.push(sheet);
      }
      localStorage.setItem(SHEETS_KEY, JSON.stringify(sheets));
    } catch (error) {
      console.error('Nao foi possivel salvar a ficha.', error);
    }
  }

  createSheet(userId, sistema) {
    const sheet = sistema === 'ordem'
      ? getOrdemDemo(userId)
      : getTormentaDemo(userId);
    sheet.id = `${sistema}_${Date.now()}`;
    sheet.nome = sistema === 'ordem' ? 'Nova ficha de Ordem' : 'Nova ficha de Tormenta';
    sheet.nomePersonagem = sheet.nome;
    const sheets = JSON.parse(localStorage.getItem(SHEETS_KEY) || '[]');
    sheets.push(sheet);
    localStorage.setItem(SHEETS_KEY, JSON.stringify(sheets));
    return sheet;
  }

  deleteSheet(sheetId) {
    const sheets = JSON.parse(localStorage.getItem(SHEETS_KEY) || '[]');
    localStorage.setItem(SHEETS_KEY, JSON.stringify(sheets.filter(sheet => sheet.id !== sheetId)));
  }
}

export const storage = new StorageService();
