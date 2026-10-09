import type { Language } from '@/contexts/I18nContext';

export type ExplainKind = 'word' | 'phrase';

const PERPLEXITY_BASE = 'https://www.perplexity.ai/search/new?q=';

export const explainLabels: Record<Language, Record<ExplainKind, string>> = {
  en: { word: 'Explain word', phrase: 'Explain phrase' },
  es: { word: 'Explicar palabra', phrase: 'Explicar frase' },
  fr: { word: 'Expliquer le mot', phrase: 'Expliquer la phrase' },
};

// Human-readable name of a language code, written in the UI language.
// e.g. getLanguageName('fr', 'es') -> "francés"
export const getLanguageName = (code: string, uiLanguage: Language): string => {
  try {
    const name = new Intl.DisplayNames([uiLanguage], { type: 'language' }).of(code);
    return name || code;
  } catch {
    return code;
  }
};

const buildPrompt = (
  kind: ExplainKind,
  text: string,
  targetLanguageName: string,
  uiLanguage: Language
): string => {
  if (uiLanguage === 'es') {
    return kind === 'phrase'
      ? `La siguiente frase está en ${targetLanguageName}, el idioma que estoy aprendiendo:\n"${text}"\nExplica su significado general en español, su traducción literal y un desglose palabra por palabra. Para cada palabra, explica su significado, categoría gramatical, función gramatical y las formas gramaticales relevantes. Explica la estructura de la oración, el orden de las palabras y las expresiones o reglas gramaticales importantes para entender la frase. Responde completamente en español.`
      : `La palabra "${text}" está en ${targetLanguageName}, el idioma que estoy aprendiendo. Explica su significado en español, categoría gramatical, propiedades gramaticales, formas de la palabra, conjugación si aplica, uso gramatical, expresiones comunes y 3 frases de ejemplo naturales con su traducción al español. Si tiene varios significados o funciones gramaticales, explica cada uno por separado. Responde completamente en español.`;
  }

  if (uiLanguage === 'fr') {
    return kind === 'phrase'
      ? `La phrase suivante est en ${targetLanguageName}, la langue que j'apprends :\n"${text}"\nExplique son sens général en français, sa traduction littérale et une analyse mot à mot. Pour chaque mot, explique son sens, sa nature grammaticale, sa fonction grammaticale et les formes grammaticales pertinentes. Explique la structure de la phrase, l'ordre des mots et les expressions ou règles grammaticales importantes pour comprendre la phrase. Réponds entièrement en français.`
      : `Le mot "${text}" est en ${targetLanguageName}, la langue que j'apprends. Explique son sens en français, sa nature grammaticale, ses propriétés grammaticales, ses formes, sa conjugaison le cas échéant, son usage grammatical, ses expressions courantes et 3 exemples de phrases naturelles avec traduction en français. S'il a plusieurs sens ou fonctions grammaticales, explique chacun séparément. Réponds entièrement en français.`;
  }

  // English (default)
  return kind === 'phrase'
    ? `The following phrase is in ${targetLanguageName}, the language I am learning:\n"${text}"\nExplain its overall meaning in English, literal translation, and word-by-word breakdown. For each word, explain its meaning, part of speech, grammatical role, and relevant grammatical forms. Explain the sentence structure, word order, and any expressions or grammatical rules that are important to understand the phrase. Respond entirely in English.`
    : `The word "${text}" is in ${targetLanguageName}, the language I am learning. Explain its meaning in English, part of speech, grammatical properties, word forms, conjugation if applicable, grammatical usage, common expressions, and 3 natural example sentences with English translations. If it has multiple meanings or grammatical roles, explain each separately. Respond entirely in English.`;
};

export const buildExplainUrl = (params: {
  kind: ExplainKind;
  text: string;
  targetLanguageCode: string;
  uiLanguage: Language;
}): string => {
  const { kind, text, targetLanguageCode, uiLanguage } = params;
  const targetLanguageName = getLanguageName(targetLanguageCode, uiLanguage);
  const prompt = buildPrompt(kind, text, targetLanguageName, uiLanguage);
  return `${PERPLEXITY_BASE}${encodeURIComponent(prompt)}`;
};

export const openExplanation = (params: {
  kind: ExplainKind;
  text: string;
  targetLanguageCode: string;
  uiLanguage: Language;
}) => {
  window.open(buildExplainUrl(params), '_blank', 'noopener,noreferrer');
};