import { TORMENTA_SKILLS_DEF } from '../../data/templates.js';

export function renderTormentaSheet(sheet, onUpdate) {
  const atributos = sheet.atributos || { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 };
  sheet.pericias = sheet.pericias || {};
  sheet.ataques = sheet.ataques || [];
  sheet.inventario = sheet.inventario || [];
  sheet.habilidades = sheet.habilidades || [];
  const defesa = 10 + (Number(atributos.DES) || 0) + (Number(sheet.bonusArmadura) || 0) + (Number(sheet.bonusEscudo) || 0) + (Number(sheet.defesaOutros) || 0);

  return `
    <div class="tormenta-theme space-y-5 pb-20 animate-fade-in">
      <section class="panel rounded-xl p-5">
        <div class="panel-title text-red-400"><span class="text-2xl">⚔️</span><h2>Tormenta20</h2></div>
        <div class="grid gap-3 md:grid-cols-4">
          ${[
            ['nomePersonagem','Personagem'], ['classe','Classe'], ['origem','Origem'], ['nivel','Nivel']
          ].map(([field,label]) => `
            <label class="text-xs text-slate-400">${label}
              <input data-t20-field="${field}" type="${field === 'nivel' ? 'number' : 'text'}" value="${sheet[field] || ''}" class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white">
            </label>`).join('')}
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <div class="panel rounded-xl p-5">
          <h3 class="panel-title text-red-400">Atributos</h3>
          <div class="grid grid-cols-3 gap-3 sm:grid-cols-6">
            ${Object.entries(atributos).map(([name,value]) => `
              <label class="rounded-lg border border-slate-700 bg-slate-950 p-2 text-center text-xs font-bold text-slate-400">${name}
                <input data-t20-attribute="${name}" type="number" value="${value}" class="mt-1 w-full bg-transparent text-center text-xl font-bold text-white outline-none">
              </label>`).join('')}
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          ${[
            ['pvAtual','pvMax','PV','red'], ['pmAtual','pmMax','PM','blue'], ['defesa','defesa','Defesa','amber']
          ].map(([current,max,label,color]) => `
            <div class="vital-card rounded-xl p-3 text-center">
              <strong class="text-xs text-${color}-400">${label}</strong>
              ${current === 'defesa'
                ? `<div class="mt-2 text-2xl font-bold">${defesa}</div>`
                : `<div class="mt-2 flex items-center justify-center gap-1">
                    <input data-t20-field="${current}" type="number" value="${sheet[current] || 0}" class="w-14 rounded border border-slate-700 bg-slate-950 text-center">
                    <span>/</span>
                    <input data-t20-field="${max}" type="number" value="${sheet[max] || 0}" class="w-14 rounded border border-slate-700 bg-slate-950 text-center">
                   </div>`}
            </div>`).join('')}
        </div>
      </section>

      <section class="panel rounded-xl p-5">
        <h3 class="panel-title text-red-400">Defesa e armadura</h3>
        <div class="grid gap-3 sm:grid-cols-4">
          ${[
            ['bonusArmadura','Armadura'], ['bonusEscudo','Escudo'], ['defesaOutros','Outros'], ['penalidadeArmadura','Penalidade']
          ].map(([field,label]) => `
            <label class="text-xs text-slate-400">${label}<input data-t20-field="${field}" type="number" value="${sheet[field] || 0}" class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"></label>`).join('')}
        </div>
      </section>

      <section class="panel rounded-xl p-5">
        <h3 class="panel-title text-red-400">Pericias</h3>
        <div class="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          ${TORMENTA_SKILLS_DEF.map(skill => {
            const pericia = sheet.pericias[skill.id] || { treino: 0, outros: 0 };
            const atributo = Number(atributos[skill.attr]) || 0;
            const nivel = Number(sheet.nivel) || 1;
            const treino = [0,0,2,4,8,12,16,20].includes(Number(pericia.treino)) ? Number(pericia.treino) : 0;
            const total = atributo + treino + (Number(pericia.outros) || 0) + (nivel >= 20 ? 5 : Math.floor(nivel / 5) * 2);
            return `
              <div class="grid grid-cols-[1fr_55px_55px_50px] items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-sm">
                <span><strong>${skill.name}</strong><small class="ml-1 text-slate-500">${skill.attr}</small></span>
                <input data-t20-skill="${skill.id}-outros" type="number" value="${pericia.outros || 0}" title="Outros" class="rounded border border-slate-700 bg-slate-950 px-1 py-1 text-center">
                <input data-t20-skill="${skill.id}-treino" type="number" min="0" max="20" value="${pericia.treino || 0}" title="Treino" class="rounded border border-slate-700 bg-slate-950 px-1 py-1 text-center">
                <button type="button" data-roll-t20="${skill.id}" class="rounded bg-red-800 px-2 py-1 font-bold hover:bg-red-700" title="Rolar 1d20 + bonus">${total >= 0 ? '+' : ''}${total}</button>
              </div>`;
          }).join('')}
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-2">
        ${renderListSection('Ataques', 'ataques', sheet.ataques, ['Nome','Teste','Dano','Critico'])}
        ${renderListSection('Inventario', 'inventario', sheet.inventario, ['Item','Quantidade','Peso'])}
      </section>
    </div>
  `;
}

function renderListSection(title, field, items, columns) {
  return `
    <div class="panel rounded-xl p-5">
      <div class="mb-3 flex items-center justify-between"><h3 class="font-bold text-red-400">${title}</h3><button type="button" data-add-row="${field}" class="rounded bg-slate-700 px-2 py-1 text-xs hover:bg-slate-600">Adicionar</button></div>
      <div class="space-y-2">${items.length ? items.map((item,index) => `
        <div class="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2">
          ${columns.map((column,columnIndex) => `<input data-${field}-row="${index}-${columnIndex}" value="${item[columnIndex] || ''}" placeholder="${column}" class="min-w-0 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm">`).join('')}
          <button type="button" data-remove-row="${field}-${index}" class="text-slate-500 hover:text-red-400">x</button>
        </div>`).join('') : '<p class="text-sm text-slate-500">Nenhum registro.</p>'}</div>
    </div>`;
}

export function attachTormentaListeners(container, sheet, onUpdate) {
  sheet.pericias = sheet.pericias || {};
  sheet.ataques = sheet.ataques || [];
  sheet.inventario = sheet.inventario || [];

  container.querySelectorAll('[data-t20-field]').forEach(input => input.addEventListener('input', () => {
    sheet[input.dataset.t20Field] = input.type === 'number' ? Number(input.value) : input.value;
    onUpdate(sheet);
  }));
  container.querySelectorAll('[data-t20-attribute]').forEach(input => input.addEventListener('input', () => {
    sheet.atributos[input.dataset.t20Attribute] = Number(input.value);
    onUpdate(sheet);
  }));
  container.querySelectorAll('[data-t20-skill]').forEach(input => input.addEventListener('change', () => {
    const [id,type] = input.dataset.t20Skill.split('-');
    sheet.pericias[id] = sheet.pericias[id] || { treino: 0, outros: 0 };
    sheet.pericias[id][type] = Number(input.value);
    onUpdate(sheet);
  }));
  container.querySelectorAll('[data-add-row]').forEach(button => button.addEventListener('click', () => {
    const field = button.dataset.addRow;
    sheet[field].push(['','','',''].slice(0, field === 'ataques' ? 4 : 3));
    onUpdate(sheet);
    window.dispatchEvent(new CustomEvent('rpg-sheet-change'));
  }));
  container.querySelectorAll('[data-remove-row]').forEach(button => button.addEventListener('click', () => {
    const [field,index] = button.dataset.removeRow.split('-');
    sheet[field].splice(Number(index),1);
    onUpdate(sheet);
    window.dispatchEvent(new CustomEvent('rpg-sheet-change'));
  }));
  ['ataques','inventario'].forEach(field => container.querySelectorAll(`[data-${field}-row]`).forEach(input => input.addEventListener('change', () => {
    const [row,column] = input.dataset[`${field}Row`].split('-').map(Number);
    sheet[field][row][column] = input.value;
    onUpdate(sheet);
  })));
  container.querySelectorAll('[data-roll-t20]').forEach(button => button.addEventListener('click', () => {
    const skill = TORMENTA_SKILLS_DEF.find(item => item.id === button.dataset.rollT20);
    const attr = Number(sheet.atributos[skill.attr]) || 0;
    const pericia = sheet.pericias[skill.id] || { treino: 0, outros: 0 };
    const bonus = attr + Number(pericia.treino) + Number(pericia.outros) + 0;
    const roll = Math.floor(Math.random()*20)+1;
    window.dispatchEvent(new CustomEvent('rpg-roll',{detail:{formula:`1d20 + ${bonus}`,total:roll+bonus,dice:[roll],label:skill.name}}));
  }));
}
