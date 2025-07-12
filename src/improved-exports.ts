/**
 * Improved exports for AI models
 * This file re-exports functions and constants from ai-models.ts
 */

import {
  ALL_MODELS,
  getProviders,
  getCategories,
} from './ai-models.js';

// Popular Models Constants
export const POPULAR_MODELS = {
  GPT_4O: 'gpt-4o',
  GPT_4_TURBO: 'gpt-4-turbo',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  CLAUDE_3_5_SONNET: 'claude-3-5-sonnet-20241022',
  CLAUDE_3_OPUS: 'claude-3-opus-20240229',
  CLAUDE_3_HAIKU: 'claude-3-haiku-20240307',
  GEMINI_1_5_PRO: 'gemini-1.5-pro',
  GEMINI_1_5_FLASH: 'gemini-1.5-flash',
  MISTRAL_LARGE: 'mistral-large-latest',
  MIXTRAL_8X7B: 'mixtral-8x7b-32768',
  LLAMA_3_70B: 'llama3-70b-8192',
  LLAMA_3_8B: 'llama3-8b-8192',
  COMMAND_R: 'command-r',
  COMMAND_R_PLUS: 'command-r-plus',
};

// Provider Collections
export const OPENAI_MODELS = {
  chat: ALL_MODELS.filter(m => m.provider === 'openai' && m.category === 'chat').map(m => m.model),
  completion: ALL_MODELS.filter(m => m.provider === 'openai' && m.category === 'completion').map(m => m.model),
  embedding: ALL_MODELS.filter(m => m.provider === 'openai' && m.category === 'embedding').map(m => m.model),
  image: ALL_MODELS.filter(m => m.provider === 'openai' && m.category === 'image').map(m => m.model),
  transcription: ALL_MODELS.filter(m => m.provider === 'openai' && m.category === 'transcription').map(m => m.model),
  speech: ALL_MODELS.filter(m => m.provider === 'openai' && m.category === 'speech').map(m => m.model),
};

export const ANTHROPIC_MODELS = {
  chat: ALL_MODELS.filter(m => m.provider === 'anthropic' && m.category === 'chat').map(m => m.model),
};

export const GOOGLE_MODELS = {
  chat: ALL_MODELS.filter(m => m.provider === 'google' && m.category === 'chat').map(m => m.model),
  embedding: ALL_MODELS.filter(m => m.provider === 'google' && m.category === 'embedding').map(m => m.model),
  image: ALL_MODELS.filter(m => m.provider === 'google-vertex' && m.category === 'image').map(m => m.model),
};

export const MISTRAL_MODELS = {
  chat: ALL_MODELS.filter(m => m.provider === 'mistral' && m.category === 'chat').map(m => m.model),
  embedding: ALL_MODELS.filter(m => m.provider === 'mistral' && m.category === 'embedding').map(m => m.model),
};

// Utility Functions
export function getModelInfo(model: string) {
  if (!model) return null;
  const foundModel = ALL_MODELS.find(m => m.model === model);
  return foundModel || null;
}

export interface FilterOptions {
  provider?: string;
  category?: string;
}

export function findModels(options: FilterOptions) {
  const { provider, category } = options;
  return ALL_MODELS.filter(m =>
    (provider ? m.provider === provider : true) &&
    (category ? m.category === category : true)
  );
}

export function isValidModel(model: string) {
  if (!model) return false;
  return ALL_MODELS.some(m => m.model === model);
}

export function getModelsByProviders(providers: string[]) {
  if (providers.length === 0) return [];
  return ALL_MODELS.filter(m => providers.includes(m.provider));
}

export function getModelsByCategories(categories: string[]) {
  if (categories.length === 0) return [];
  return ALL_MODELS.filter(m => categories.includes(m.category));
}

export function getModelCount(options?: FilterOptions) {
  if (!options) return ALL_MODELS.length;
  return findModels(options).length;
}

export function getProviderModels(provider: string) {
  const models = ALL_MODELS.filter(m => m.provider === provider);
  const categories = [...new Set(models.map(m => m.category))];

  return categories.reduce((acc, category) => {
    acc[category] = models
      .filter(m => m.category === category)
      .map(m => m.model);
    return acc;
  }, {} as Record<string, string[]>);
}

export function getCategoryModels(category: string) {
  const models = ALL_MODELS.filter(m => m.category === category);
  const providers = [...new Set(models.map(m => m.provider))];

  return providers.reduce((acc, provider) => {
    acc[provider] = models
      .filter(m => m.provider === provider)
      .map(m => m.model);
    return acc;
  }, {} as Record<string, string[]>);
}

// Re-export ALL_MODELS
export { ALL_MODELS };