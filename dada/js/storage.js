/**
 * Sistema de Gerenciamento de Armazenamento e Autenticação Local
 * Persistência completa no LocalStorage com isolamento por usuário
 */
import { getTormentaDemo, getOrdemDemo, createEmptyTormentaSheet, createEmptyOrdemSheet } from '../data/templates.js';
const USERS_KEY = 'rpg_manager_users_v1';
const SESSION_KEY = 'rpg_manager_session_v1';
const SHEETS_KEY = 'rpg_manager_sheets_v1';
export class StorageService {
  constructor() {
    this.initDefaults();
  }
  initDefaults() {
    // Inicializa lista de usuários se não existir
    if (!localStorage.getItem(USERS_KEY)) {
      const defaultUsers = [
        {
          id: 'user_default',
          nome: 'Jogador Convidado',
          email: 'jogador@rpg.com',
          senha: '123'
        }
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }
    // Inicializa fichas demo se não existirem
    if (!localStorage.getItem(SHEETS_KEY)) {
      const demoSheets = [
        getOrdemDemo('user_default'),
        getTormentaDemo('user_default')
      ];
      localStorage.setItem(SHEETS_KEY, JSON.stringify(demoSheets));
    }
  }
  // --- AUTENTICAÇÃO ---
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
      return [];
    }
  }
}