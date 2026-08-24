export interface CopyTypeConfigEntry {
  guidance: string
  targetCharacters: number | null
  minimumCharacters?: number
}

export const COPY_TYPE_CONFIG = {
  'Meta Ads': {
    targetCharacters: 1500,
    guidance: 'Escreva para Meta Ads com gancho imediato, benefício concreto, leitura escaneável e CTA claro.',
  },
  'Google Ads': {
    targetCharacters: 1500,
    guidance: 'Estruture para intenção de busca, relevância rápida, benefício específico e ação objetiva.',
  },
  'TikTok Ads': {
    targetCharacters: 1500,
    guidance: 'Crie um roteiro dinâmico para TikTok, com abertura forte, ritmo ágil e linguagem falada natural.',
  },
  'Landing Page': {
    targetCharacters: 2000,
    guidance: 'Produza uma seção persuasiva de landing page com headline, argumento progressivo e CTA.',
  },
  'X1 WhatsApp': {
    targetCharacters: 1500,
    guidance: 'Escreva como conversa comercial individual no WhatsApp, humana, direta e apropriada ao canal.',
  },
  'E-mail Marketing': {
    targetCharacters: 1000,
    guidance: 'Use a headline como assunto e crie um e-mail conciso com abertura, argumento e CTA.',
  },
  'Título / Headline': {
    targetCharacters: null,
    guidance: 'Priorize headlines fortes e naturais; use o body apenas para uma linha curta de apoio.',
  },
  'Descrição de Produto': {
    targetCharacters: 500,
    guidance: 'Explique valor, aplicação e diferenciais do produto de forma concreta e informativa.',
  },
  CTA: {
    targetCharacters: 300,
    guidance: 'Priorize chamadas para ação claras e específicas; use headline e body apenas como contexto mínimo.',
  },
  VSL: {
    targetCharacters: null,
    minimumCharacters: 10000,
    guidance: 'Crie um roteiro longo de VSL com progressão persuasiva, transições naturais e argumentação sustentada.',
  },
  Lead: {
    targetCharacters: 5000,
    guidance: 'Desenvolva uma copy de lead aprofundada, com abertura forte, construção de valor e progressão clara.',
  },
  MicroLead: {
    targetCharacters: 3000,
    guidance: 'Crie uma copy de microlead enxuta, mas desenvolvida, com argumento progressivo e CTA coerente.',
  },
  'Copy Curta': {
    targetCharacters: 1000,
    guidance: 'Mantenha a mensagem compacta, rápida e persuasiva, sem sacrificar especificidade.',
  },
  'Copy Longa': {
    targetCharacters: 4000,
    guidance: 'Desenvolva o argumento com profundidade, ritmo e clareza, evitando repetição e preenchimento artificial.',
  },
} as const satisfies Record<string, CopyTypeConfigEntry>

export type CopyType = keyof typeof COPY_TYPE_CONFIG

export const COPY_TYPES = Object.keys(COPY_TYPE_CONFIG) as [CopyType, ...CopyType[]]
