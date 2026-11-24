/**
 * Componente da Ficha de Ordem Paranormal RPG
 * Estilização Paranormal Dark Mode (Verde Oculto / Ciano / Violeta / Sangue)
 * Totalmente baseada no modelo de referência oficial fornecido
 */
import { ORDEM_SKILLS_DEF } from '../../data/templates.js';
import { diceRoller } from '../diceRoller.js';
export function renderOrdemSheet(sheet, onUpdate) {
  const atributos = sheet.atributos || { AGI: 1, FOR: 1, INT: 1, PRE: 1, VIG: 1 };
  
  // Defesa = 10 + AGI + outros bônus
  const agi = parseInt(atributos.AGI, 10) || 0;
  const outrosDefesa = parseInt(sheet.defesaOutros, 10) || 0;
  const defesaTotal = 10 + agi + outrosDefesa;
  // Porcentagens para barras de PV, PE e SAN
  const pvPct = Math.max(0, Math.min(100, Math.round(((sheet.pvAtual || 0) / (sheet.pvMax || 1)) * 100)));
  const pePct = Math.max(0, Math.min(100, Math.round(((sheet.peAtual || 0) / (sheet.peMax || 1)) * 100)));
  const sanPct = Math.max(0, Math.min(100, Math.round(((sheet.sanAtual || 0) / (sheet.sanMax || 1)) * 100)));
  return `
    <div class="ordem-theme space-y-6 pb-20 animate-fade-in" id="sheet-container">
      
      <!-- Top Action Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/90 border border-emerald-900/60 p-4 rounded-xl shadow-lg backdrop-blur sticky top-16 z-20">
        <div class="flex items-center space-x-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-950 text-emerald-400 border border-emerald-600/60 shadow-sm">
            👁️ ORDO REALITAS • Ordem Paranormal RPG
          </span>
          <span class="text-xs text-zinc-400 hidden sm:inline" id="autosave-status">
            Salvo automaticamente
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button id="btn-quick-roll-ordem" class="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs rounded-lg transition shadow-md shadow-emerald-900/40">
            <span>🎲</span>
            <span>Painel de Dados</span>
          </button>
          <button id="btn-save-sheet-manual" class="flex items-center space-x-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-lg border border-zinc-700 transition">
            <span>💾 Salvar</span>
          </button>
        </div>
      </div>
    </div>
  `;
}