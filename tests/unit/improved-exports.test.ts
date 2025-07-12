import { describe, it, expect, expectTypeOf } from 'vitest';
import type {
  // Clean type names
  OpenAIChatModel,
  OpenAICompletionModel,
  OpenAIEmbeddingModel,
  AnthropicChatModel,
  GoogleChatModel,
  MistralChatModel,
  AnyModelId,
  AnyProviderModel,
  // Categories
  ChatModel,
  EmbeddingModel,
  ImageModel,
  SpeechModel,
  TranscriptionModel,
  // Collections
  PopularModels,
  OpenAIModels,
  AnthropicModels,
  GoogleModels,
  MistralModels,
  // Utilities
  ModelInfo,
  FilterOptions,
  ModelsByProvider,
  ModelsByCategory,
} from '../../src/ai-models.js';
import {
  // Constants
  POPULAR_MODELS,
  OPENAI_MODELS,
  ANTHROPIC_MODELS,
  GOOGLE_MODELS,
  MISTRAL_MODELS,
  // Utilities
  getModelInfo,
  findModels,
  isValidModel,
  getModelsByProviders,
  getModelsByCategories,
  getModelCount,
  getProviderModels,
  getCategoryModels,
  // Existing exports
  ALL_MODELS,
  getProviders,
  getCategories,
} from '../../src/improved-exports.js';

describe('Improved Type Exports & Utilities', () => {
  describe('Clean Type Names', () => {
    it('should have clean OpenAI type names', () => {
      const chatModel: OpenAIChatModel = 'gpt-4o';
      const completionModel: OpenAICompletionModel = 'gpt-3.5-turbo-instruct';
      const embeddingModel: OpenAIEmbeddingModel = 'text-embedding-3-large';

      expect(typeof chatModel).toBe('string');
      expect(typeof completionModel).toBe('string');
      expect(typeof embeddingModel).toBe('string');
    });

    it('should have clean Anthropic type names', () => {
      const model: AnthropicChatModel = 'claude-3-5-sonnet-20241022';
      expect(typeof model).toBe('string');
    });

    it('should have clean Google type names', () => {
      const model: GoogleChatModel = 'gemini-1.5-pro';
      expect(typeof model).toBe('string');
    });

    it('should have clean Mistral type names', () => {
      const model: MistralChatModel = 'open-mistral-7b';
      expect(typeof model).toBe('string');
    });
  });

  describe('Category-Based Types', () => {
    it('should have working ChatModel type', () => {
      const gptModel: ChatModel = 'gpt-4o';
      const claudeModel: ChatModel = 'claude-3-5-sonnet-20241022';
      const geminiModel: ChatModel = 'gemini-1.5-pro';

      expect(typeof gptModel).toBe('string');
      expect(typeof claudeModel).toBe('string');
      expect(typeof geminiModel).toBe('string');
    });

    it('should have working EmbeddingModel type', () => {
      const openaiEmbedding: EmbeddingModel = 'text-embedding-3-large';
      const googleEmbedding: EmbeddingModel = 'text-embedding-004';

      expect(typeof openaiEmbedding).toBe('string');
      expect(typeof googleEmbedding).toBe('string');
    });

    it('should have working ImageModel type', () => {
      const dalleModel: ImageModel = 'dall-e-3';
      expect(typeof dalleModel).toBe('string');
    });

    it('should have working SpeechModel type', () => {
      const ttsModel: SpeechModel = 'tts-1';
      expect(typeof ttsModel).toBe('string');
    });

    it('should have working TranscriptionModel type', () => {
      const whisperModel: TranscriptionModel = 'whisper-1';
      expect(typeof whisperModel).toBe('string');
    });
  });

  describe('Universal Types', () => {
    it('should have working AnyModelId type', () => {
      const gptModel: AnyModelId = 'gpt-4o';
      const claudeModel: AnyModelId = 'claude-3-5-sonnet-20241022';
      const geminiModel: AnyModelId = 'gemini-1.5-pro';

      expect(typeof gptModel).toBe('string');
      expect(typeof claudeModel).toBe('string');
      expect(typeof geminiModel).toBe('string');
    });

    it('should have working AnyProviderModel type', () => {
      const openaiModel: AnyProviderModel = 'openai:gpt-4o';
      const anthropicModel: AnyProviderModel = 'anthropic:claude-3-5-sonnet-20241022';

      expect(typeof openaiModel).toBe('string');
      expect(typeof anthropicModel).toBe('string');
    });
  });

  describe('Popular Models Constants', () => {
    it('should export POPULAR_MODELS with correct structure', () => {
      expect(typeof POPULAR_MODELS).toBe('object');
      expect(POPULAR_MODELS).not.toBeNull();

      // Check some popular models exist
      expect(typeof POPULAR_MODELS.GPT_4O).toBe('string');
      expect(typeof POPULAR_MODELS.CLAUDE_3_5_SONNET).toBe('string');
      expect(typeof POPULAR_MODELS.GEMINI_1_5_PRO).toBe('string');
      expect(typeof POPULAR_MODELS.CLAUDE_3_OPUS).toBe('string');
    });

    it('should have correct values for popular models', () => {
      expect(POPULAR_MODELS.GPT_4O).toBe('gpt-4o');
      expect(POPULAR_MODELS.CLAUDE_3_5_SONNET).toBe('claude-3-5-sonnet-20241022');
      expect(POPULAR_MODELS.GEMINI_1_5_PRO).toBe('gemini-1.5-pro');
    });
  });

  describe('Provider Collections', () => {
    it('should export OPENAI_MODELS with correct structure', () => {
      expect(typeof OPENAI_MODELS).toBe('object');
      expect(OPENAI_MODELS).not.toBeNull();

      expect(Array.isArray(OPENAI_MODELS.chat)).toBe(true);
      expect(Array.isArray(OPENAI_MODELS.completion)).toBe(true);
      expect(Array.isArray(OPENAI_MODELS.embedding)).toBe(true);
      expect(Array.isArray(OPENAI_MODELS.image)).toBe(true);

      expect(OPENAI_MODELS.chat.length).toBeGreaterThan(0);
      expect(OPENAI_MODELS.embedding.length).toBeGreaterThan(0);
    });

    it('should export ANTHROPIC_MODELS with correct structure', () => {
      expect(typeof ANTHROPIC_MODELS).toBe('object');
      expect(ANTHROPIC_MODELS).not.toBeNull();

      expect(Array.isArray(ANTHROPIC_MODELS.chat)).toBe(true);
      expect(ANTHROPIC_MODELS.chat.length).toBeGreaterThan(0);
    });

    it('should export GOOGLE_MODELS with correct structure', () => {
      expect(typeof GOOGLE_MODELS).toBe('object');
      expect(GOOGLE_MODELS).not.toBeNull();

      expect(Array.isArray(GOOGLE_MODELS.chat)).toBe(true);
      expect(Array.isArray(GOOGLE_MODELS.embedding)).toBe(true);
      expect(GOOGLE_MODELS.chat.length).toBeGreaterThan(0);
    });

    it('should export MISTRAL_MODELS with correct structure', () => {
      expect(typeof MISTRAL_MODELS).toBe('object');
      expect(MISTRAL_MODELS).not.toBeNull();

      expect(Array.isArray(MISTRAL_MODELS.chat)).toBe(true);
      expect(Array.isArray(MISTRAL_MODELS.embedding)).toBe(true);
      expect(MISTRAL_MODELS.chat.length).toBeGreaterThan(0);
    });
  });

  describe('Utility Functions', () => {
    it('should have working getModelInfo function', () => {
      const info = getModelInfo('gpt-4o');
      expect(typeof info).toBe('object');
      if (info) {
        expect(info.provider).toBe('openai');
        expect(info.model).toBe('gpt-4o');
        expect(info.category).toBe('chat');
        expect(info.value).toBe('openai:gpt-4o');
      }
    });

    it('should have working findModels function', () => {
      const results = findModels({ provider: 'openai', category: 'chat' });
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);

      results.forEach(model => {
        expect(model.provider).toBe('openai');
        expect(model.category).toBe('chat');
      });
    });

    it('should have working isValidModel function', () => {
      expect(isValidModel('gpt-4o')).toBe(true);
      expect(isValidModel('invalid-model-name')).toBe(false);
      expect(isValidModel('')).toBe(false);
    });

    it('should have working getModelsByProviders function', () => {
      const results = getModelsByProviders(['openai', 'anthropic']);
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);

      results.forEach(model => {
        expect(['openai', 'anthropic']).toContain(model.provider);
      });
    });

    it('should have working getModelsByCategories function', () => {
      const results = getModelsByCategories(['chat', 'embedding']);
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);

      results.forEach(model => {
        expect(['chat', 'embedding']).toContain(model.category);
      });
    });

    it('should have working getModelCount function', () => {
      const totalCount = getModelCount();
      const openaiCount = getModelCount({ provider: 'openai' });
      const chatCount = getModelCount({ category: 'chat' });

      expect(typeof totalCount).toBe('number');
      expect(typeof openaiCount).toBe('number');
      expect(typeof chatCount).toBe('number');

      expect(totalCount).toBeGreaterThan(0);
      expect(openaiCount).toBeGreaterThan(0);
      expect(chatCount).toBeGreaterThan(0);
      expect(totalCount).toBeGreaterThan(openaiCount);
    });

    it('should have working getProviderModels function', () => {
      const openaiModels = getProviderModels('openai');
      expect(typeof openaiModels).toBe('object');
      expect(openaiModels).not.toBeNull();

      expect(Array.isArray(openaiModels.chat)).toBe(true);
      expect(Array.isArray(openaiModels.embedding)).toBe(true);
      expect(openaiModels.chat.length).toBeGreaterThan(0);
    });

    it('should have working getCategoryModels function', () => {
      const chatModels = getCategoryModels('chat');
      expect(typeof chatModels).toBe('object');
      expect(chatModels).not.toBeNull();

      const providers = Object.keys(chatModels);
      expect(providers.length).toBeGreaterThan(0);
      expect(providers).toContain('openai');
      expect(providers).toContain('anthropic');
    });
  });

  describe('Data Consistency', () => {
    it('should have consistent data between collections and ALL_MODELS', () => {
      const openaiFromCollection = OPENAI_MODELS.chat;
      const openaiFromAll = ALL_MODELS.filter(m => m.provider === 'openai' && m.category === 'chat').map(m => m.model);

      expect(openaiFromCollection.sort()).toEqual(openaiFromAll.sort());
    });

    it('should have popular models exist in ALL_MODELS', () => {
      const popularModelsList = Object.values(POPULAR_MODELS);

      popularModelsList.forEach(modelName => {
        const exists = ALL_MODELS.some(m => m.model === modelName);
        expect(exists).toBe(true);
      });
    });
  });

  describe('Type Safety', () => {
    it('should maintain type safety with new utilities', () => {
      const info: ModelInfo | null = getModelInfo('gpt-4o');
      if (info) {
        expect(typeof info.provider).toBe('string');
        expect(typeof info.model).toBe('string');
        expect(typeof info.category).toBe('string');
        expect(typeof info.value).toBe('string');
      }
    });

    it('should maintain type safety with filter options', () => {
      const options: FilterOptions = {
        provider: 'openai',
        category: 'chat',
      };

      const results = findModels(options);
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should have efficient model lookups', () => {
      const start = performance.now();

      // Perform multiple lookups
      for (let i = 0; i < 100; i++) {
        getModelInfo('gpt-4o');
        isValidModel('claude-3-5-sonnet-20241022');
        findModels({ provider: 'openai' });
      }

      const end = performance.now();
      const duration = end - start;

      // Should complete 100 operations in reasonable time (< 100ms)
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined gracefully', () => {
      expect(getModelInfo(null as any)).toBeNull();
      expect(getModelInfo(undefined as any)).toBeNull();
      expect(isValidModel(null as any)).toBe(false);
      expect(isValidModel(undefined as any)).toBe(false);
    });

    it('should handle empty arrays in multi-provider/category functions', () => {
      const emptyProviders = getModelsByProviders([]);
      const emptyCategories = getModelsByCategories([]);

      expect(Array.isArray(emptyProviders)).toBe(true);
      expect(Array.isArray(emptyCategories)).toBe(true);
      expect(emptyProviders.length).toBe(0);
      expect(emptyCategories.length).toBe(0);
    });
  });
});