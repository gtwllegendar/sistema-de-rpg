import { ORDEM_SKILLS_DEF } from '../../data/templates.js';

export function renderOrdemSheet(sheet) {
  const atributos = sheet.atributos || { AGI: 1, FOR: 1, INT: 1, PRE: 1, VIG: 1 };
  sheet.pericias = sheet.pericias || {};
  sheet.ataques = sheet.ataques || [];
  sheet.inventario = sheet.inventario || [];
  sheet.habilidades = sheet.habilidades || [];
  const defesa = 10 + (Number(atributos.AGI) || 0) + (Number(sheet.defesaOutros) || 0);
  const nex = Number(sheet.nex) || 0;

  return `
    <div class="ordem-theme space-y-5 pb-20 animate-fade-in">
      <section class="panel rounded-xl p-5">
        <div class="panel-title text-emerald-400"><span class="text-2xl">👁️</span><h2>Ordem Paranormal</h2></div>
        <div class="grid gap-3 md:grid-cols-5">
          ${[
            ['nomePersonagem','Personagem'], ['classe','Classe'], ['origem','Origem'], ['trilha','Trilha'], ['nex','NEX']
          ].map(([field,label]) => `
            <label class="text-xs text-zinc-400">${label}
              <input data-ordem-field="${field}" type="${field === 'nex' ? 'number' : 'text'}" value="${sheet[field] || ''}" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white">
            </label>`).join('')}
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <div class="panel rounded-xl p-5">
          <h3 class="panel-title text-emerald-400">Atributos</h3>
          <div class="grid grid-cols-5 gap-3">
            ${Object.entries(atributos).map(([name,value]) => `
              <label class="rounded-lg border border-zinc-700 bg-zinc-950 p-2 text-center text-xs font-bold text-zinc-400">${name}
                <input data-ordem-attribute="${name}" type="number" value="${value}" class="mt-1 w-full bg-transparent text-center text-xl font-bold text-white outline-none">
              </label>`).join('')}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          ${[
            ['pvAtual','pvMax','PV','red'], ['peAtual','peMax','PE','cyan'], ['sanAtual','sanMax','SAN','purple'], ['defesa','defesa','Defesa','emerald']
          ].map(([current,max,label,color]) => `
            <div class="vital-card rounded-xl p-3 text-center">
              <strong class="text-xs text-${color}-400">${label}</strong>
              ${current === 'defesa'
                ? `<div class="mt-2 text-2xl font-bold">${defesa}</div>`
                : `<div class="mt-2 flex items-center justify-center gap-1">
                    <input data-ordem-field="${current}" type="number" value="${sheet[current] || 0}" class="w-12 rounded border border-zinc-700 bg-zinc-950 text-center">
                    <span>/</span>
                    <input data-ordem-field="${max}" type="number" value="${sheet[max] || 0}" class="w-12 rounded border border-zinc-700 bg-zinc-950 text-center">
                   </div>`}
            </div>`).join('')}
        </div>
      </section>

      <section class="panel rounded-xl p-5">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-emerald-400">Pericias</h3>
          <span class="text-xs text-zinc-500">NEX ${nex}%</span>
        </div>
        <div class="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          ${ORDEM_SKILLS_DEF.map(skill => {
            const pericia = sheet.pericias[skill.id] || { treino: 0, outros: 0 };
            const atributo = Number(atributos[skill.attr]) || 0;
            const diceCount = atributo === 0 ? 2 : atributo;
            const total = pericia.treino + pericia.outros;
            return `
              <div class="grid grid-cols-[1fr_55px_55px_50px] items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm">
                <span><strong>${skill.name}</strong><small class="ml-1 text-zinc-500">${skill.attr}</small></span>
                <input data-ordem-skill="${skill.id}-outros" type="number" value="${pericia.outros || 0}" title="Outros" class="rounded border border-zinc-700 bg-zinc-950 px-1 py-1 text-center">
                <select data-ordem-skill="${skill.id}-treino" title="Treino" class="rounded border border-zinc-700 bg-zinc-950 px-1 py-1 text-xs">
                  ${[0,5,10,15,20].map(value => `<option value="${value}" ${Number(pericia.treino) === value ? 'selected' : ''}>${value}</option>`).join('')}
                </select>
                <button type="button" data-roll-ordem="${skill.id}" class="rounded bg-emerald-800 px-2 py-1 font-bold hover:bg-emerald-700" title="${diceCount}d20 maior">${total >= 0 ? '+' : ''}${total}</button>
              </div>`;
          }).join('')}
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-2">
        ${renderOrdemList('Ataques', 'ataques', sheet.ataques, ['Nome','Teste','Dano','Critico'])}
        ${renderOrdemList('Inventario', 'inventario', sheet.inventario, ['Item','Categoria','Peso'])}
      </section>
    </div>
  `;
}

function renderOrdemList(title, field, items, columns) {
  return `
    <div class="panel rounded-xl p-5">
      <div class="mb-3 flex items-center justify-between"><h3 class="font-bold text-emerald-400">${title}</h3><button type="button" data-add-ordem-row="${field}" class="rounded bg-zinc-700 px-2 py-1 text-xs hover:bg-zinc-600">Adicionar</button></div>
      <div class="space-y-2">${items.length ? items.map((item,index) => `
        <div class="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2">
          ${columns.map((column,columnIndex) => `<input data-${field}-row="${index}-${columnIndex}" value="${item[columnIndex] || ''}" placeholder="${column}" class="min-w-0 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm">`).join('')}
          <button type="button" data-remove-ordem-row="${field}-${index}" class="text-zinc-500 hover:text-red-400">x</button>
        </div>`).join('') : '<p class="text-sm text-zinc-500">Nenhum registro.</p>'}</div>
    </div>`;
}

export function attachOrdemListeners(container, sheet, onUpdate) {
  sheet.pericias = sheet.pericias || {};
  sheet.ataques = sheet.ataques || [];
  sheet.inventario = sheet.inventario || [];

  container.querySelectorAll('[data-ordem-field]').forEach(input => input.addEventListener('input', () => {
    sheet[input.dataset.ordemField] = input.type === 'number' ? Number(input.value) : input.value;
    onUpdate(sheet);
  }));
  container.querySelectorAll('[data-ordem-attribute]').forEach(input => input.addEventListener('input', () => {
    sheet.atributos[input.dataset.ordemAttribute] = Number(input.value);
    onUpdate(sheet);
  }));
  container.querySelectorAll('[data-ordem-skill]').forEach(input => input.addEventListener('change', () => {
    const [id,type] = input.dataset.ordemSkill.split('-');
    sheet.pericias[id] = sheet.pericias[id] || { treino: 0, outros: 0 };
    sheet.pericias[id][type] = Number(input.value);
    onUpdate(sheet);
  }));
  container.querySelectorAll('[data-add-ordem-row]').forEach(button => button.addEventListener('click', () => {
    const field = button.dataset.addOrdemRow;
    sheet[field].push(['','','','']);
    onUpdate(sheet);
    window.dispatchEvent(new CustomEvent('rpg-sheet-change'));
  }));
  container.querySelectorAll('[data-remove-ordem-row]').forEach(button => button.addEventListener('click', () => {
    const [field,index] = button.dataset.removeOrdemRow.split('-');
    sheet[field].splice(Number(index),1);
    onUpdate(sheet);
    window.dispatchEvent(new CustomEvent('rpg-sheet-change'));
  }));
  ['ataques','inventario'].forEach(field => container.querySelectorAll(`[data-${field}-row]`).forEach(input => input.addEventListener('change', () => {
    const [row,column] = input.dataset[`${field}Row`].split('-').map(Number);
    sheet[field][row][column] = input.value;
    onUpdate(sheet);
  })));
  container.querySelectorAll('[data-roll-ordem]').forEach(button => button.addEventListener('click', () => {
    const skill = ORDEM_SKILLS_DEF.find(item => item.id === button.dataset.rollOrdem);
    const attr = Number(sheet.atributos[skill.attr]) || 0;
    const pericia = sheet.pericias[skill.id] || { treino: 0, outros: 0 };
    const diceCount = attr === 0 ? 2 : attr;
    const rolls = Array.from({length:diceCount}, () => Math.floor(Math.random()*20)+1);
    const selected = attr === 0 ? Math.min(...rolls) : Math.max(...rolls);
    const bonus = Number(pericia.treino) + Number(pericia.outros);
    window.dispatchEvent(new CustomEvent('rpg-roll',{detail:{formula:`${diceCount}d20 ${attr === 0 ? 'pior' : 'maior'} + ${bonus}`,total:selected+bonus,dice:rolls,label:skill.name}}));
  }));
}
