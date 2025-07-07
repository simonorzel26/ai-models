import { describe, it, expect, expectTypeOf } from 'vitest';
import type {
  AISDKModel,
  AISDKProvider,
  AISDKModelValue,
  AISDKModelCategory,
  OpenaiOpenAIChatModelId,
  AnthropicAnthropicMessagesModelId,
  GoogleGoogleGenerativeAIModelId,
  MistralMistralChatModelId
} from '../../src/ai-models.js';
import {
  getModelsByProvider,
  getModelsByCategory,
  getProviders,
  getCategories,
  ALL_MODELS,
  AI_SDK_MODELS
} from '../../src/ai-models.js';

describe('TypeScript Type Definitions', () => {
  describe('Basic Types', () => {
    it('should have correct AISDKModel type structure', () => {
      const model: AISDKModel = ALL_MODELS[0];
      expect(typeof model.provider).toBe('string');
      expect(typeof model.model).toBe('string');
      expect(typeof model.category).toBe('string');
      expect(typeof model.value).toBe('string');
    });

    it('should have correct AISDKProvider type', () => {
      const provider: AISDKProvider = getProviders()[0];
      expect(typeof provider).toBe('string');
    });

    it('should have correct AISDKModelCategory type', () => {
      const category: AISDKModelCategory = getCategories()[0];
      expect(typeof category).toBe('string');
    });

    it('should have correct AISDKModelValue type', () => {
      const modelValue: AISDKModelValue = ALL_MODELS[0].value;
      expect(typeof modelValue).toBe('string');
    });
  });

  describe('Provider-Specific Model Types', () => {
    it('should have OpenAI chat model types', () => {
      const validOpenaiModel: OpenaiOpenAIChatModelId = 'gpt-4o';
      expect(typeof validOpenaiModel).toBe('string');
    });

    it('should have Anthropic message model types', () => {
      const validAnthropicModel: AnthropicAnthropicMessagesModelId = 'claude-3-opus-20240229';
      expect(typeof validAnthropicModel).toBe('string');
    });

    it('should have Google generative AI model types', () => {
      const googleModel: GoogleGoogleGenerativeAIModelId = 'gemini-1.5-pro';
      expect(typeof googleModel).toBe('string');
    });

    it('should have Mistral chat model types', () => {
      const mistralModel: MistralMistralChatModelId = 'open-mistral-7b';
      expect(typeof mistralModel).toBe('string');
    });
  });

  describe('Function Return Types', () => {
    it('should have correct getProviders return type', () => {
      const providers: AISDKProvider[] = getProviders();
      expect(Array.isArray(providers)).toBe(true);
      if (providers.length > 0) {
        expect(typeof providers[0]).toBe('string');
      }
    });

    it('should have correct getCategories return type', () => {
      const categories: AISDKModelCategory[] = getCategories();
      expect(Array.isArray(categories)).toBe(true);
      if (categories.length > 0) {
        expect(typeof categories[0]).toBe('string');
      }
    });

    it('should have correct getModelsByProvider return type', () => {
      const models: AISDKModel[] = getModelsByProvider('openai');
      expect(Array.isArray(models)).toBe(true);
      if (models.length > 0) {
        const model = models[0];
        expect(typeof model.provider).toBe('string');
        expect(typeof model.model).toBe('string');
      }
    });

    it('should have correct getModelsByCategory return type', () => {
      const models: AISDKModel[] = getModelsByCategory('chat');
      expect(Array.isArray(models)).toBe(true);
      if (models.length > 0) {
        const model = models[0];
        expect(typeof model.provider).toBe('string');
        expect(typeof model.model).toBe('string');
      }
    });
  });

  describe('Constant Types', () => {
    it('should have correct ALL_MODELS type', () => {
      const models: readonly AISDKModel[] = ALL_MODELS;
      expect(Array.isArray(models)).toBe(true);
      expect(Object.isFrozen(models)).toBe(true);
    });

    it('should have correct AI_SDK_MODELS type', () => {
      const registry = AI_SDK_MODELS;
      expect(typeof registry).toBe('object');
      expect(Object.isFrozen(registry)).toBe(true);
    });
  });

  describe('Type Safety in Usage', () => {
    it('should maintain type safety when filtering models', () => {
      const openaiModels: AISDKModel[] = getModelsByProvider('openai');
      const chatModels: AISDKModel[] = openaiModels.filter(m => m.category === 'chat');
      expect(Array.isArray(chatModels)).toBe(true);
    });

    it('should maintain type safety when mapping models', () => {
      const modelNames: string[] = ALL_MODELS.map(m => m.model);
      expect(Array.isArray(modelNames)).toBe(true);
      if (modelNames.length > 0) {
        expect(typeof modelNames[0]).toBe('string');
      }
    });

    it('should maintain type safety with provider registry access', () => {
      const openaiRegistry = AI_SDK_MODELS.openai;
      expect(typeof openaiRegistry).toBe('object');
      if (openaiRegistry) {
        const chatModels = openaiRegistry.chat;
        expect(typeof chatModels).toBe('object');
      }
    });
  });

  describe('Union Type Behavior', () => {
    it('should accept literal model names in union types', () => {
      const openaiModel1: OpenaiOpenAIChatModelId = 'gpt-4o';
      const openaiModel2: OpenaiOpenAIChatModelId = 'gpt-4-turbo';
      const openaiModel3: OpenaiOpenAIChatModelId = 'gpt-3.5-turbo';
      expect(typeof openaiModel1).toBe('string');
      expect(typeof openaiModel2).toBe('string');
      expect(typeof openaiModel3).toBe('string');
    });

    it('should accept custom strings due to string intersection', () => {
      const customModel: OpenaiOpenAIChatModelId = 'my-custom-openai-model';
      expect(typeof customModel).toBe('string');
    });
  });

  describe('Runtime vs Type Consistency', () => {
    it('should have runtime data matching type definitions', () => {
      const providers = getProviders();
      const categories = getCategories();
      const provider: AISDKProvider = providers[0];
      const category: AISDKModelCategory = categories[0];
      expect(typeof provider).toBe('string');
      expect(typeof category).toBe('string');
    });

    it('should have consistent model structure between types and runtime', () => {
      const model = ALL_MODELS[0];
      const modelTyped: AISDKModel = model;
      expect(modelTyped.provider).toEqual(model.provider);
      expect(modelTyped.model).toEqual(model.model);
    });
  });

  describe('Exported Type Coverage', () => {
    it('should export all necessary types', () => {
      type TestAISDKModel = AISDKModel;
      type TestAISDKProvider = AISDKProvider;
      type TestAISDKModelValue = AISDKModelValue;
      type TestAISDKModelCategory = AISDKModelCategory;
      type TestOpenaiModel = OpenaiOpenAIChatModelId;
      type TestAnthropicModel = AnthropicAnthropicMessagesModelId;

      // Dummy assignments to satisfy TypeScript compiler that types are used
      let dummy;
      dummy as TestAISDKModel;
      dummy as TestAISDKProvider;
      dummy as TestAISDKModelValue;
      dummy as TestAISDKModelCategory;
      dummy as TestOpenaiModel;
      dummy as TestAnthropicModel;

      expect(true).toBe(true);
    });
  });
});