import { describe, it, expect, beforeAll } from 'vitest';
import {
  getModelsByProvider,
  getModelsByCategory,
  getProviders,
  getCategories,
  ALL_MODELS,
  AI_SDK_MODELS
} from '../../src/ai-models.js';

describe('Utility Functions', () => {
  describe('getProviders', () => {
    it('should return an array of provider names', () => {
      const providers = getProviders();

      expect(Array.isArray(providers)).toBe(true);
      expect(providers.length).toBeGreaterThan(0);
      expect(providers).toContain('openai');
      expect(providers).toContain('anthropic');
    });

    it('should return unique provider names', () => {
      const providers = getProviders();
      const uniqueProviders = [...new Set(providers)];

      expect(providers.length).toBe(uniqueProviders.length);
    });

    it('should return providers in consistent order', () => {
      const providers1 = getProviders();
      const providers2 = getProviders();

      expect(providers1).toEqual(providers2);
    });
  });

  describe('getCategories', () => {
    it('should return an array of category names', () => {
      const categories = getCategories();

      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('chat');
    });

    it('should include expected categories', () => {
      const categories = getCategories();
      const expectedCategories = ['chat', 'embedding', 'image', 'transcription', 'speech', 'completion'];

      expectedCategories.forEach(category => {
        expect(categories).toContain(category);
      });
    });

    it('should return unique category names', () => {
      const categories = getCategories();
      const uniqueCategories = [...new Set(categories)];

      expect(categories.length).toBe(uniqueCategories.length);
    });
  });

  describe('getModelsByProvider', () => {
    it('should return models for OpenAI provider', () => {
      const openaiModels = getModelsByProvider('openai');

      expect(Array.isArray(openaiModels)).toBe(true);
      expect(openaiModels.length).toBeGreaterThan(0);

      openaiModels.forEach(model => {
        expect(model.provider).toBe('openai');
        expect(typeof model.model).toBe('string');
        expect(typeof model.category).toBe('string');
        expect(typeof model.value).toBe('string');
        expect(model.value).toBe(`openai:${model.model}`);
      });
    });

    it('should return models for Anthropic provider', () => {
      const anthropicModels = getModelsByProvider('anthropic');

      expect(Array.isArray(anthropicModels)).toBe(true);
      expect(anthropicModels.length).toBeGreaterThan(0);

      anthropicModels.forEach(model => {
        expect(model.provider).toBe('anthropic');
        expect(model.value).toBe(`anthropic:${model.model}`);
      });
    });

    it('should return empty array for non-existent provider', () => {
      const models = getModelsByProvider('non-existent-provider');

      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBe(0);
    });

    it('should handle provider names with special characters', () => {
      const providers = getProviders();
      const providersWithHyphens = providers.filter(p => p.includes('-'));

      if (providersWithHyphens.length > 0) {
        const models = getModelsByProvider(providersWithHyphens[0]);
        expect(Array.isArray(models)).toBe(true);
      }
    });
  });

  describe('getModelsByCategory', () => {
    it('should return models for chat category', () => {
      const chatModels = getModelsByCategory('chat');

      expect(Array.isArray(chatModels)).toBe(true);
      expect(chatModels.length).toBeGreaterThan(0);

      chatModels.forEach(model => {
        expect(model.category).toBe('chat');
        expect(typeof model.provider).toBe('string');
        expect(typeof model.model).toBe('string');
        expect(typeof model.value).toBe('string');
      });
    });

    it('should return models for embedding category', () => {
      const embeddingModels = getModelsByCategory('embedding');

      expect(Array.isArray(embeddingModels)).toBe(true);
      expect(embeddingModels.length).toBeGreaterThan(0);

      embeddingModels.forEach(model => {
        expect(model.category).toBe('embedding');
      });
    });

    it('should return empty array for non-existent category', () => {
      const models = getModelsByCategory('non-existent-category');

      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBe(0);
    });

    it('should include models from multiple providers in same category', () => {
      const chatModels = getModelsByCategory('chat');
      const providers = [...new Set(chatModels.map(m => m.provider))];

      expect(providers.length).toBeGreaterThan(1);
    });
  });

  describe('ALL_MODELS data structure', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(ALL_MODELS)).toBe(true);
      expect(ALL_MODELS.length).toBeGreaterThan(0);
    });

    it('should have consistent model object structure', () => {
      ALL_MODELS.forEach(model => {
        expect(typeof model.provider).toBe('string');
        expect(typeof model.model).toBe('string');
        expect(typeof model.category).toBe('string');
        expect(typeof model.value).toBe('string');
        expect(model.value).toBe(`${model.provider}:${model.model}`);
      });
    });

        it('should have reasonable number of unique model values', () => {
      const values = ALL_MODELS.map(m => m.value);
      const uniqueValues = [...new Set(values)];

      // Some models may be available from multiple providers or contexts,
      // so we expect some duplicates but not too many
      expect(uniqueValues.length).toBeGreaterThan(800); // Should have many unique models
      expect(uniqueValues.length).toBeLessThan(values.length); // But some duplicates are expected
      expect(values.length - uniqueValues.length).toBeLessThan(100); // Not too many duplicates
    });

    it('should contain expected model count', () => {
      // Based on our extraction results
      expect(ALL_MODELS.length).toBeGreaterThan(900);
    });

    it('should have models from expected providers', () => {
      const providers = [...new Set(ALL_MODELS.map(m => m.provider))];

      expect(providers).toContain('openai');
      expect(providers).toContain('anthropic');
      expect(providers).toContain('google');
      expect(providers).toContain('mistral');
    });
  });

  describe('AI_SDK_MODELS registry', () => {
    it('should be an object with provider keys', () => {
      expect(typeof AI_SDK_MODELS).toBe('object');
      expect(AI_SDK_MODELS).not.toBeNull();

      const providers = Object.keys(AI_SDK_MODELS);
      expect(providers.length).toBeGreaterThan(0);
    });

    it('should have consistent structure for each provider', () => {
      Object.entries(AI_SDK_MODELS).forEach(([provider, categories]) => {
        expect(typeof provider).toBe('string');
        expect(typeof categories).toBe('object');
        expect(categories).not.toBeNull();

        Object.entries(categories).forEach(([category, typeMap]) => {
          expect(typeof category).toBe('string');
          expect(typeof typeMap).toBe('object');
          expect(typeMap).not.toBeNull();

          Object.entries(typeMap).forEach(([typeName, models]) => {
            expect(typeof typeName).toBe('string');
            expect(Array.isArray(models)).toBe(true);
            expect(models.length).toBeGreaterThan(0);

            models.forEach(model => {
              expect(typeof model).toBe('string');
              expect(model.length).toBeGreaterThan(0);
            });
          });
        });
      });
    });

    it('should have OpenAI models organized correctly', () => {
      expect(AI_SDK_MODELS.openai).toBeDefined();
      expect(AI_SDK_MODELS.openai.chat).toBeDefined();
      expect(AI_SDK_MODELS.openai.embedding).toBeDefined();

      // Check that models are arrays of strings
      Object.values(AI_SDK_MODELS.openai.chat).forEach(models => {
        expect(Array.isArray(models)).toBe(true);
        expect(models.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Data consistency between structures', () => {
    it('should have matching provider counts', () => {
      const allModelsProviders = [...new Set(ALL_MODELS.map(m => m.provider))];
      const registryProviders = Object.keys(AI_SDK_MODELS);

      expect(allModelsProviders.sort()).toEqual(registryProviders.sort());
    });

    it('should have matching category counts', () => {
      const allModelsCategories = [...new Set(ALL_MODELS.map(m => m.category))];
      const registryCategories = new Set();

      Object.values(AI_SDK_MODELS).forEach(provider => {
        Object.keys(provider).forEach(category => {
          registryCategories.add(category);
        });
      });

      expect(allModelsCategories.sort()).toEqual([...registryCategories].sort());
    });

    it('should have consistent model counts', () => {
      let registryModelCount = 0;

      Object.values(AI_SDK_MODELS).forEach(provider => {
        Object.values(provider).forEach(category => {
          Object.values(category).forEach(models => {
            registryModelCount += (models as string[]).length;
          });
        });
      });

      expect(ALL_MODELS.length).toBe(registryModelCount);
    });
  });
});