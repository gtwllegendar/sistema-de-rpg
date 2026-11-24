/**
 * Painel Flutuante e Interativo do Rolador de Dados
 * Permite selecionar dados (d4, d6, d8, d10, d12, d20, d100), quantidade, bônus,
 * digitar fórmulas customizadas e ver o histórico em tempo real com destaque para críticos.
 */
import { diceRoller } from '../diceRoller.js';
export function renderDiceRollerModal() {
  return `
    <div id="dice-drawer" class="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-zinc-950/95 border-l border-zinc-800 shadow-2xl backdrop-blur-md transform translate-x-full transition-transform duration-300 ease-in-out flex flex-col">
      
      <!-- Cabeçalho do Drawer -->
      <div class="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
        <div class="flex items-center space-x-2">
          <span class="text-xl">🎲</span>
          <div>
            <h3 class="text-sm font-bold text-white tracking-wide">MESA DE ROLAGEM</h3>
            <p class="text-[10px] text-zinc-400">Tormenta20 & Ordem Paranormal</p>
          </div>
        </div>
        <button id="btn-close-dice" class="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <!-- Área de Controle de Dados -->
      <div class="p-4 border-b border-zinc-800 space-y-4">
        
        <!-- Seleção do Tipo de Dado -->
        <div>
          <label class="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">ESCOLHA O DADO:</label>
          <div class="grid grid-cols-4 gap-2">
            ${[4, 6, 8, 10, 12, 20, 100].map((sides, idx) => `
              <button type="button" data-die-sides="${sides}"
                class="die-select-btn ${sides === 20 ? 'bg-red-950/80 border-red-700 text-red-200' : 'bg-zinc-900 border-zinc-800 text-zinc-300'} hover:border-emerald-500 py-2 px-1 rounded-lg border font-mono font-bold text-xs flex flex-col items-center justify-center transition hover:scale-105 active:scale-95 shadow-sm">
                <span class="text-xs">d${sides}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Quantidade e bônus -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">QUANTIDADE:</label>
            <input id="dice-quantity" type="number" min="1" value="1"
              class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500">
          </div>
          <div>
            <label class="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">BÔNUS:</label>
            <input id="dice-bonus" type="number" value="0"
              class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500">
          </div>
        </div>

        <!-- Fórmula customizada -->
        <div>
          <label class="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">FÓRMULA:</label>
          <input id="dice-custom-formula" type="text" placeholder="Ex: 2d6+3"
            class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 font-mono text-sm text-white outline-none focus:border-emerald-500">
        </div>

        <button id="btn-roll-dice" type="button"
          class="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-lg transition active:scale-[0.98]">
          ROLAR DADOS
        </button>
      </div>

      <!-- Histórico -->
      <div class="flex-1 overflow-y-auto p-4">
        <h4 class="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Histórico</h4>
        <div id="dice-history" class="space-y-2"></div>
      </div>
    </div>
  `;
}