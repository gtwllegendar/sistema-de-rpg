export class DiceRollerService {
  constructor() {
    this.history = [];
    this.audioCtx = null;
    this.listeners = [];
  }

  // Efeito sonoro procedural sem arquivos externos
  playDiceSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx && AudioContext) this.audioCtx = new AudioContext();
      if (this.audioCtx && this.audioCtx.state === 'suspended') this.audioCtx.resume();
      
      const now = this.audioCtx.currentTime;
      [0, 0.05, 0.12, 0.2].forEach((delay, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.frequency.setValueAtTime(140 + Math.random() * 260, now + delay);
        gain.gain.setValueAtTime(0.35 / (i + 1), now + delay);
        osc.connect(gain); gain.connect(this.audioCtx.destination);
        osc.start(now + delay); osc.stop(now + delay + 0.08);
      });
    } catch {}
  }

  rollSingle(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

  // Regra de Ordem Paranormal: Xd20 do Atributo pegando o maior (+ bônus de perícia)
  rollOrdemCheck(attributeValue, bonus = 0, label = 'Teste de Perícia (Ordem)') {
    this.playDiceSound();
    const diceResults = [];
    const attr = Math.max(0, parseInt(attributeValue, 10) || 0);
    let diceCount = attr === 0 ? 2 : attr;
    const isDisadvantage = attr === 0;

    for (let i = 0; i < diceCount; i++) {
      diceResults.push(this.rollSingle(20));
    }

    const selectedDie = isDisadvantage ? Math.min(...diceResults) : Math.max(...diceResults);
    const total = selectedDie + bonus;

    const rollData = {
      id: 'roll_' + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      label,
      system: 'ordem',
      formula: isDisadvantage ? `2d20 (Pior) +${bonus}` : `${diceCount}d20 (Maior) +${bonus}`,
      diceResults,
      selectedDie,
      bonus,
      total,
      isCrit: selectedDie === 20,
      isFumble: selectedDie === 1
    };

    this.addHistory(rollData);
    return rollData;
  }

  // Regra de Tormenta20: 1d20 + Bônus
  rollTormentaCheck(bonus = 0, label = 'Teste de Perícia (T20)') {
    this.playDiceSound();
    const d20 = this.rollSingle(20);
    const total = d20 + bonus;
    const rollData = {
      id: 'roll_' + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      label,
      system: 'tormenta',
      formula: `1d20 ${bonus >= 0 ? '+' + bonus : bonus}`,
      diceResults: [d20],
      bonus,
      total,
      isCrit: d20 === 20,
      isFumble: d20 === 1
    };
    this.addHistory(rollData);
    return rollData;
  }
}

export const diceRoller = new DiceRollerService();