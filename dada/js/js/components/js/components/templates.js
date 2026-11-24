/**
 * Modelos de dados de referência e fichas pré-carregadas para Tormenta20 e Ordem Paranormal RPG
 */
export const TORMENTA_SKILLS_DEF = [
  { id: 'acrobacia', name: 'Acrobacia', attr: 'DES', penalty: false },
  { id: 'adestramento', name: 'Adestramento*', attr: 'CAR', trainedOnly: true },
  { id: 'atletismo', name: 'Atletismo', attr: 'FOR', penalty: false },
  { id: 'atuacao', name: 'Atuação', attr: 'CAR', penalty: false },
  { id: 'cavalgar', name: 'Cavalgar', attr: 'DES', penalty: false },
  { id: 'conhecimento', name: 'Conhecimento*', attr: 'INT', trainedOnly: true },
  { id: 'cura', name: 'Cura', attr: 'SAB', penalty: false },
  { id: 'diplomacia', name: 'Diplomacia', attr: 'CAR', penalty: false },
  { id: 'enganacao', name: 'Enganação', attr: 'CAR', penalty: false },
  { id: 'fortitude', name: 'Fortitude', attr: 'CON', penalty: false },
  { id: 'furtividade', name: 'Furtividade*', attr: 'DES', penalty: true },
  { id: 'guerra', name: 'Guerra*', attr: 'INT', trainedOnly: true },
  { id: 'iniciativa', name: 'Iniciativa', attr: 'DES', penalty: false },
  { id: 'intimidacao', name: 'Intimidação', attr: 'CAR', penalty: false },
  { id: 'intuicao', name: 'Intuição', attr: 'SAB', penalty: false },
  { id: 'investigacao', name: 'Investigação', attr: 'INT', penalty: false },
  { id: 'jogatina', name: 'Jogatina*', attr: 'CAR', trainedOnly: true },
  { id: 'ladinagem', name: 'Ladinagem**', attr: 'DES', trainedOnly: true, penalty: true },
  { id: 'luta', name: 'Luta', attr: 'FOR', penalty: false },
  { id: 'misticismo', name: 'Misticismo*', attr: 'INT', trainedOnly: true },
  { id: 'nobreza', name: 'Nobreza*', attr: 'INT', trainedOnly: true },
  { id: 'oficio1', name: 'Ofício (Artesanato)', attr: 'INT', isCustom: true },
  { id: 'oficio2', name: 'Ofício (Alquimia)', attr: 'INT', isCustom: true },
  { id: 'percepcao', name: 'Percepção', attr: 'SAB', penalty: false },
  { id: 'pilotagem', name: 'Pilotagem*', attr: 'DES', trainedOnly: true },
  { id: 'pontaria', name: 'Pontaria', attr: 'DES', penalty: false },
  { id: 'reflexos', name: 'Reflexos', attr: 'DES', penalty: false },
  { id: 'religiao', name: 'Religião*', attr: 'SAB', trainedOnly: true },
  { id: 'sobrevivencia', name: 'Sobrevivência', attr: 'SAB', penalty: false },
  { id: 'vontade', name: 'Vontade', attr: 'SAB', penalty: false }
];
export const ORDEM_SKILLS_DEF = [
  { id: 'acrobacia', name: 'Acrobacia', attr: 'AGI' },
  { id: 'adestramento', name: 'Adestramento', attr: 'PRE' },
  { id: 'artes', name: 'Artes', attr: 'PRE' },
  { id: 'atletismo', name: 'Atletismo', attr: 'FOR' }
];