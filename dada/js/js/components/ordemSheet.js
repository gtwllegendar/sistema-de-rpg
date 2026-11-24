export function renderOrdemSheet(sheet, onUpdate) {
  const atributos = sheet.atributos || { AGI: 1, FOR: 1, INT: 1, PRE: 1, VIG: 1 };
  const agi = parseInt(atributos.AGI, 10) || 0;
  const outrosDefesa = parseInt(sheet.defesaOutros, 10) || 0;
  const defesaTotal = 10 + agi + outrosDefesa; // Fórmula: 10 + AGI + outros bônus

  return `
    <div class="ordem-theme space-y-6 pb-20">
      <!-- Status Vitais: PV, PE e Sanidade com barras dinâmicas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- PV -->
        <div class="bg-zinc-900 border border-red-950 rounded-xl p-4">
          <div class="flex justify-between text-xs font-bold font-mono text-red-400 mb-2">
            <span>🩸 PONTOS DE VIDA (PV)</span>
            <span>${sheet.pvAtual || 0} / ${sheet.pvMax || 0}</span>
          </div>
          <input type="number" data-field="pvAtual" value="${sheet.pvAtual || 0}" class="w-full bg-zinc-950 border border-zinc-700 text-center font-bold text-red-400 text-xl rounded-lg py-1">
        </div>
        <!-- PE -->
        <div class="bg-zinc-900 border border-cyan-950 rounded-xl p-4">
          <div class="flex justify-between text-xs font-bold font-mono text-cyan-400 mb-2">
            <span>⚡ PONTOS DE ESFORÇO (PE)</span>
            <span>${sheet.peAtual || 0} / ${sheet.peMax || 0}</span>
          </div>
          <input type="number" data-field="peAtual" value="${sheet.peAtual || 0}" class="w-full bg-zinc-950 border border-zinc-700 text-center font-bold text-cyan-400 text-xl rounded-lg py-1">
        </div>
        <!-- SAN -->
        <div class="bg-zinc-900 border border-purple-950 rounded-xl p-4">
          <div class="flex justify-between text-xs font-bold font-mono text-purple-400 mb-2">
            <span>🌀 SANIDADE (SAN)</span>
            <span>${sheet.sanAtual || 0} / ${sheet.sanMax || 0}</span>
          </div>
          <input type="number" data-field="sanAtual" value="${sheet.sanAtual || 0}" class="w-full bg-zinc-950 border border-zinc-700 text-center font-bold text-purple-400 text-xl rounded-lg py-1">
        </div>
      </div>

      <!-- Tabela Completa de Perícias -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 class="font-mono text-emerald-400 font-bold text-sm mb-3">PERÍCIAS | ATRIBUTO | BÔNUS | TREINO | OUTROS</h3>
        <!-- Linhas com botões para rolar Xd20 onde X é o atributo da perícia -->
      </div>
    </div>
  `;
}