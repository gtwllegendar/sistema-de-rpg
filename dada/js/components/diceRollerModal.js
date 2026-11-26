export function renderDiceRollerModal() {
  return `
    <button id="btn-open-dice" type="button" class="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full border border-emerald-400/30 bg-emerald-600 text-2xl shadow-2xl shadow-emerald-950/70 hover:-translate-y-1 hover:bg-emerald-500" title="Abrir mesa de dados">🎲</button>
    <div id="dice-drawer" class="fixed inset-y-0 right-0 z-50 flex w-full translate-x-full flex-col border-l border-zinc-800 bg-zinc-950/95 shadow-2xl backdrop-blur-md transition-transform duration-300 sm:w-96">
      <div class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 p-4">
        <div><h3 class="text-sm font-bold">MESA DE ROLAGEM</h3><p class="text-[10px] text-zinc-400">Tormenta20 & Ordem Paranormal</p></div>
        <button id="btn-close-dice" type="button" class="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white">✕</button>
      </div>
      <div class="space-y-4 border-b border-zinc-800 p-4">
        <div>
          <label class="mb-2 block text-[11px] font-bold text-zinc-400">ESCOLHA O DADO</label>
          <div class="grid grid-cols-4 gap-2">
            ${[4,6,8,10,12,20,100].map(sides => `
              <button type="button" data-die-sides="${sides}" class="die-select-btn rounded-lg border border-zinc-800 bg-zinc-900 py-2 font-mono text-xs font-bold text-zinc-300 hover:border-emerald-500">d${sides}</button>
            `).join('')}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <label class="text-[11px] font-bold text-zinc-400">QUANTIDADE<input id="dice-quantity" type="number" min="1" max="100" value="1" class="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white"></label>
          <label class="text-[11px] font-bold text-zinc-400">BONUS<input id="dice-bonus" type="number" value="0" class="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white"></label>
        </div>
        <label class="block text-[11px] font-bold text-zinc-400">FORMULA<input id="dice-custom-formula" type="text" placeholder="Ex: 2d6+3" class="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-white"></label>
        <button id="btn-roll-dice" type="button" class="w-full rounded-lg bg-emerald-700 py-2.5 font-bold text-white hover:bg-emerald-600">ROLAR DADOS</button>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <h4 class="mb-2 text-[11px] font-bold text-zinc-400">HISTORICO</h4>
        <div id="dice-history" class="space-y-2"></div>
      </div>
    </div>
  `;
}

export function initDiceRollerUI(root) {
  const drawer = root.querySelector('#dice-drawer');
  const openButton = root.querySelector('#btn-open-dice');
  const closeButton = root.querySelector('#btn-close-dice');
  const rollButton = root.querySelector('#btn-roll-dice');
  if (!drawer || !openButton || !rollButton) return;

  openButton.addEventListener('click', () => drawer.classList.remove('translate-x-full'));
  closeButton?.addEventListener('click', () => drawer.classList.add('translate-x-full'));
  root.querySelectorAll('.die-select-btn').forEach(button => button.addEventListener('click', () => {
    root.querySelectorAll('.die-select-btn').forEach(item => item.classList.remove('border-emerald-500','bg-emerald-950'));
    button.classList.add('border-emerald-500','bg-emerald-950');
  }));

  const roll = ({formula, dice, bonus, label, total} = {}) => {
    const history = root.querySelector('#dice-history');
    if (!history) return;
    const entry = document.createElement('div');
    entry.className = 'rounded-lg border border-zinc-800 bg-zinc-900 p-3';
    entry.innerHTML = `<div class="text-[10px] text-zinc-500">${label || 'Rolagem'}</div><div class="mt-1 flex items-end justify-between"><span class="font-mono text-xs text-zinc-400">${formula || `${dice?.length || 0}d20`}</span><strong class="text-xl ${total === 20 ? 'text-emerald-400' : 'text-white'}">${total}</strong></div>`;
    history.prepend(entry);
  };

  rollButton.addEventListener('click', () => {
    const formulaInput = root.querySelector('#dice-custom-formula')?.value.trim();
    if (formulaInput) {
      const match = formulaInput.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
      if (!match) {
        roll({formula:'Formula invalida',dice:[],total:'-'});
      } else {
        const quantity = Math.min(100, Math.max(1, Number(match[1] || 1)));
        const sides = Number(match[2]);
        const modifier = Number(match[3] || 0);
        const dice = Array.from({length:quantity}, () => Math.floor(Math.random()*sides)+1);
        roll({formula:formulaInput,label:'Formula personalizada',dice,total:dice.reduce((a,b)=>a+b,0)+modifier});
      }
      return;
    }

    const quantity = Math.min(100, Math.max(1, Number(root.querySelector('#dice-quantity')?.value || 1)));
    const bonus = Number(root.querySelector('#dice-bonus')?.value || 0);
    const selected = root.querySelector('.die-select-btn.border-emerald-500');
    const sides = Number(selected?.dataset.dieSides || 20);
    const dice = Array.from({length:quantity}, () => Math.floor(Math.random()*sides)+1);
    roll({formula:`${quantity}d${sides}${bonus >= 0 ? '+' : ''}${bonus}`,label:'Rolagem manual',dice,total:dice.reduce((a,b)=>a+b,0)+bonus});
  });

  window.removeEventListener('rpg-roll', window._rpgRollHandler);
  window._rpgRollHandler = event => {
    roll(event.detail);
    drawer.classList.remove('translate-x-full');
  };
  window.addEventListener('rpg-roll', window._rpgRollHandler);
}
