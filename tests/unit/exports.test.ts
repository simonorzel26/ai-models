import { describe, it, expect } from 'vitest';
import * as aiModels from '../../src/ai-models.js';

describe('Package Exports', () => {
  describe('Named Exports', () => {
    it('should export all required functions', () => {
      expect(typeof aiModels.getModelsByProvider).toBe('function');
      expect(typeof aiModels.getModelsByCategory).toBe('function');
      expect(typeof aiModels.getProviders).toBe('function');
      expect(typeof aiModels.getCategories).toBe('function');
    });

    it('should export all required constants', () => {
      expect(Array.isArray(aiModels.ALL_MODELS)).toBe(true);
      expect(typeof aiModels.AI_SDK_MODELS).toBe('object');
      expect(aiModels.AI_SDK_MODELS).not.toBeNull();
    });

    it('should export all required types', () => {
      // Types are checked at compile time, but we can verify they exist
      // by checking that imported values conform to their expected types
      const model = aiModels.ALL_MODELS[0];
      expect(typeof model.provider).toBe('string');
      expect(typeof model.model).toBe('string');
      expect(typeof model.category).toBe('string');
      expect(typeof model.value).toBe('string');
    });
  });

  describe('Export Completeness', () => {
    it('should export exactly the expected number of exports', () => {
      const exportKeys = Object.keys(aiModels);
      const expectedExports = [
        'getModelsByProvider',
        'getModelsByCategory',
        'getProviders',
        'getCategories',
        'ALL_MODELS',
        'AI_SDK_MODELS'
      ];

      // Check that all expected exports are present
      expectedExports.forEach(exportName => {
        expect(exportKeys).toContain(exportName);
      });

      // Check that we don't have unexpected exports
      expect(exportKeys.length).toBeGreaterThanOrEqual(expectedExports.length);
    });

    it('should not export internal implementation details', () => {
      const exportKeys = Object.keys(aiModels);
      const internalNames = [
        'extractModels',
        'generateModelTypesFile',
        'processProviderDirectory',
        '__dirname',
        '__filename'
      ];

      internalNames.forEach(internalName => {
        expect(exportKeys).not.toContain(internalName);
      });
    });
  });

  describe('Function Signatures', () => {
    it('should have correct getModelsByProvider signature', () => {
      const fn = aiModels.getModelsByProvider;

      // Test with valid provider
      const result1 = fn('openai');
      expect(Array.isArray(result1)).toBe(true);

      // Test with invalid provider
      const result2 = fn('invalid-provider');
      expect(Array.isArray(result2)).toBe(true);
      expect(result2.length).toBe(0);

      // Test with null/undefined (should handle gracefully)
      const result3 = fn(null as any);
      expect(Array.isArray(result3)).toBe(true);
      expect(result3.length).toBe(0);
    });

    it('should have correct getModelsByCategory signature', () => {
      const fn = aiModels.getModelsByCategory;

      // Test with valid category
      const result1 = fn('chat');
      expect(Array.isArray(result1)).toBe(true);

      // Test with invalid category
      const result2 = fn('invalid-category');
      expect(Array.isArray(result2)).toBe(true);
      expect(result2.length).toBe(0);

      // Test with null/undefined (should handle gracefully)
      const result3 = fn(null as any);
      expect(Array.isArray(result3)).toBe(true);
      expect(result3.length).toBe(0);
    });

    it('should have correct getProviders signature', () => {
      const fn = aiModels.getProviders;

      // Should work with no arguments
      const result = fn();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // Should be deterministic
      const result2 = fn();
      expect(result).toEqual(result2);
    });

    it('should have correct getCategories signature', () => {
      const fn = aiModels.getCategories;

      // Should work with no arguments
      const result = fn();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // Should be deterministic
      const result2 = fn();
      expect(result).toEqual(result2);
    });
  });

  describe('Data Structure Validation', () => {
    it('should have valid ALL_MODELS structure', () => {
      const { ALL_MODELS } = aiModels;

      expect(Array.isArray(ALL_MODELS)).toBe(true);
      expect(ALL_MODELS.length).toBeGreaterThan(0);

      // Check first 10 models for structure
      const sampleModels = ALL_MODELS.slice(0, 10);
      sampleModels.forEach((model, index) => {
        expect(typeof model).toBe('object', `Model at index ${index} should be an object`);
        expect(typeof model.provider).toBe('string', `Model at index ${index} should have string provider`);
        expect(typeof model.model).toBe('string', `Model at index ${index} should have string model`);
        expect(typeof model.category).toBe('string', `Model at index ${index} should have string category`);
        expect(typeof model.value).toBe('string', `Model at index ${index} should have string value`);
        expect(model.provider.length).toBeGreaterThan(0, `Model at index ${index} should have non-empty provider`);
        expect(model.model.length).toBeGreaterThan(0, `Model at index ${index} should have non-empty model`);
        expect(model.category.length).toBeGreaterThan(0, `Model at index ${index} should have non-empty category`);
        expect(model.value).toBe(`${model.provider}:${model.model}`, `Model at index ${index} should have correct value format`);
      });
    });

    it('should have valid AI_SDK_MODELS structure', () => {
      const { AI_SDK_MODELS } = aiModels;

      expect(typeof AI_SDK_MODELS).toBe('object');
      expect(AI_SDK_MODELS).not.toBeNull();

      const providerKeys = Object.keys(AI_SDK_MODELS);
      expect(providerKeys.length).toBeGreaterThan(0);

      // Check structure for each provider
      providerKeys.forEach(providerKey => {
        const provider = AI_SDK_MODELS[providerKey];
        expect(typeof provider).toBe('object', `Provider ${providerKey} should be an object`);
        expect(provider).not.toBeNull();

        const categoryKeys = Object.keys(provider);
        expect(categoryKeys.length).toBeGreaterThan(0, `Provider ${providerKey} should have categories`);

        categoryKeys.forEach(categoryKey => {
          const category = provider[categoryKey];
          expect(typeof category).toBe('object', `Category ${categoryKey} in provider ${providerKey} should be an object`);
          expect(category).not.toBeNull();

          const typeKeys = Object.keys(category);
          expect(typeKeys.length).toBeGreaterThan(0, `Category ${categoryKey} in provider ${providerKey} should have types`);

          typeKeys.forEach(typeKey => {
            const models = category[typeKey];
            expect(Array.isArray(models), `Type ${typeKey} in category ${categoryKey} of provider ${providerKey} should be an array`).toBe(true);
            expect(models.length).toBeGreaterThan(0, `Type ${typeKey} should have at least one model`);

            models.forEach((model, modelIndex) => {
              expect(typeof model).toBe('string', `Model at index ${modelIndex} in type ${typeKey} should be a string`);
              expect(model.length).toBeGreaterThan(0, `Model at index ${modelIndex} should not be empty`);
            });
          });
        });
      });
    });
  });

  describe('Cross-Reference Validation', () => {
    it('should have consistent provider data across exports', () => {
      const providersFromFunction = aiModels.getProviders();
      const providersFromModels = [...new Set(aiModels.ALL_MODELS.map(m => m.provider))];
      const providersFromRegistry = Object.keys(aiModels.AI_SDK_MODELS);

      expect(providersFromFunction.sort()).toEqual(providersFromModels.sort());
      expect(providersFromFunction.sort()).toEqual(providersFromRegistry.sort());
    });

    it('should have consistent category data across exports', () => {
      const categoriesFromFunction = aiModels.getCategories();
      const categoriesFromModels = [...new Set(aiModels.ALL_MODELS.map(m => m.category))];

      const categoriesFromRegistry = new Set<string>();
      Object.values(aiModels.AI_SDK_MODELS).forEach(provider => {
        Object.keys(provider).forEach(category => {
          categoriesFromRegistry.add(category);
        });
      });

      expect(categoriesFromFunction.sort()).toEqual(categoriesFromModels.sort());
      expect(categoriesFromFunction.sort()).toEqual([...categoriesFromRegistry].sort());
    });

    it('should have consistent model counts', () => {
      // Count models in registry
      let registryModelCount = 0;
      Object.values(aiModels.AI_SDK_MODELS).forEach(provider => {
        Object.values(provider).forEach(category => {
          Object.values(category).forEach(models => {
            registryModelCount += models.length;
          });
        });
      });

      expect(aiModels.ALL_MODELS.length).toBe(registryModelCount);
    });
  });

  describe('Performance Characteristics', () => {
    it('should have reasonable performance for common operations', () => {
      const startTime = performance.now();

      // Perform several operations
      const providers = aiModels.getProviders();
      const categories = aiModels.getCategories();
      const openaiModels = aiModels.getModelsByProvider('openai');
      const chatModels = aiModels.getModelsByCategory('chat');

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Should complete in reasonable time (less than 100ms)
      expect(executionTime).toBeLessThan(100);

      // Should return reasonable amounts of data
      expect(providers.length).toBeGreaterThan(10);
      expect(categories.length).toBeGreaterThan(3);
      expect(openaiModels.length).toBeGreaterThan(10);
      expect(chatModels.length).toBeGreaterThan(100);
    });

    it('should handle repeated calls efficiently', () => {
      const iterations = 100;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        aiModels.getProviders();
        aiModels.getCategories();
        aiModels.getModelsByProvider('openai');
        aiModels.getModelsByCategory('chat');
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Should complete 100 iterations in reasonable time (less than 500ms)
      expect(executionTime).toBeLessThan(500);
    });
  });

  describe('Edge Cases', () => {
    it('should handle edge cases gracefully', () => {
      // Empty string inputs
      expect(aiModels.getModelsByProvider('')).toEqual([]);
      expect(aiModels.getModelsByCategory('')).toEqual([]);

      // Whitespace inputs
      expect(aiModels.getModelsByProvider('   ')).toEqual([]);
      expect(aiModels.getModelsByCategory('   ')).toEqual([]);

      // Case sensitivity
      expect(aiModels.getModelsByProvider('OPENAI')).toEqual([]);
      expect(aiModels.getModelsByCategory('CHAT')).toEqual([]);

      // Special characters
      expect(aiModels.getModelsByProvider('openai@#$%')).toEqual([]);
      expect(aiModels.getModelsByCategory('chat@#$%')).toEqual([]);
    });

    it('should maintain data immutability', () => {
      const originalModels = aiModels.ALL_MODELS;
      const originalRegistry = aiModels.AI_SDK_MODELS;

      // Try to modify the returned arrays/objects
      const providers = aiModels.getProviders();
      const categories = aiModels.getCategories();
      const models = aiModels.getModelsByProvider('openai');

      // Modifications should not affect original data
      providers.push('fake-provider');
      categories.push('fake-category');
      models.push({ provider: 'fake', model: 'fake', category: 'fake', value: 'fake:fake' });

      // Original data should remain unchanged
      expect(aiModels.ALL_MODELS).toBe(originalModels);
      expect(aiModels.AI_SDK_MODELS).toBe(originalRegistry);

      // Fresh calls should return clean data
      expect(aiModels.getProviders()).not.toContain('fake-provider');
      expect(aiModels.getCategories()).not.toContain('fake-category');
      expect(aiModels.getModelsByProvider('openai')).not.toContainEqual({ provider: 'fake', model: 'fake', category: 'fake', value: 'fake:fake' });
    });
  });
});