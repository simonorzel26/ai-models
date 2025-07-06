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
      const model = ALL_MODELS[0];

      expectTypeOf(model).toEqualTypeOf<AISDKModel>();
      expectTypeOf(model.provider).toEqualTypeOf<string>();
      expectTypeOf(model.model).toEqualTypeOf<string>();
      expectTypeOf(model.category).toEqualTypeOf<string>();
      expectTypeOf(model.value).toEqualTypeOf<string>();
    });

    it('should have correct AISDKProvider type', () => {
      const provider = getProviders()[0];

      expectTypeOf(provider).toEqualTypeOf<AISDKProvider>();
      expectTypeOf(provider).toEqualTypeOf<string>();
    });

    it('should have correct AISDKModelCategory type', () => {
      const category = getCategories()[0];

      expectTypeOf(category).toEqualTypeOf<AISDKModelCategory>();
      expectTypeOf(category).toEqualTypeOf<string>();
    });

    it('should have correct AISDKModelValue type', () => {
      const modelValue = ALL_MODELS[0].value;

      expectTypeOf(modelValue).toEqualTypeOf<AISDKModelValue>();
      expectTypeOf(modelValue).toEqualTypeOf<string>();
    });
  });

  describe('Provider-Specific Model Types', () => {
    it('should have OpenAI chat model types', () => {
      // Test that the type exists and accepts valid OpenAI models
      const validOpenaiModel: OpenaiOpenAIChatModelId = 'gpt-4';
      expectTypeOf(validOpenaiModel).toEqualTypeOf<OpenaiOpenAIChatModelId>();
      expectTypeOf(validOpenaiModel).toEqualTypeOf<string>();

      // Test string extension (allows custom models)
      const customModel: OpenaiOpenAIChatModelId = 'custom-model-name';
      expectTypeOf(customModel).toEqualTypeOf<string>();
    });

    it('should have Anthropic message model types', () => {
      const validAnthropicModel: AnthropicAnthropicMessagesModelId = 'claude-3-opus';
      expectTypeOf(validAnthropicModel).toEqualTypeOf<AnthropicAnthropicMessagesModelId>();
      expectTypeOf(validAnthropicModel).toEqualTypeOf<string>();
    });

    it('should have Google generative AI model types', () => {
      // This might not exist if Google models aren't present, so we test conditionally
      type GoogleModel = GoogleGoogleGenerativeAIModelId;
      expectTypeOf<GoogleModel>().toEqualTypeOf<string>();
    });

    it('should have Mistral chat model types', () => {
      // Test that Mistral types exist
      type MistralModel = MistralMistralChatModelId;
      expectTypeOf<MistralModel>().toEqualTypeOf<string>();
    });
  });

  describe('Function Return Types', () => {
    it('should have correct getProviders return type', () => {
      const providers = getProviders();

      expectTypeOf(providers).toEqualTypeOf<AISDKProvider[]>();
      expectTypeOf(providers).toEqualTypeOf<string[]>();
    });

    it('should have correct getCategories return type', () => {
      const categories = getCategories();

      expectTypeOf(categories).toEqualTypeOf<AISDKModelCategory[]>();
      expectTypeOf(categories).toEqualTypeOf<string[]>();
    });

    it('should have correct getModelsByProvider return type', () => {
      const models = getModelsByProvider('openai');

      expectTypeOf(models).toEqualTypeOf<AISDKModel[]>();
      expectTypeOf(models[0]).toEqualTypeOf<AISDKModel>();
    });

    it('should have correct getModelsByCategory return type', () => {
      const models = getModelsByCategory('chat');

      expectTypeOf(models).toEqualTypeOf<AISDKModel[]>();
      expectTypeOf(models[0]).toEqualTypeOf<AISDKModel>();
    });
  });

  describe('Constant Types', () => {
    it('should have correct ALL_MODELS type', () => {
      expectTypeOf(ALL_MODELS).toEqualTypeOf<readonly AISDKModel[]>();
      expectTypeOf(ALL_MODELS[0]).toEqualTypeOf<AISDKModel>();
    });

    it('should have correct AI_SDK_MODELS type', () => {
      expectTypeOf(AI_SDK_MODELS).toMatchTypeOf<Record<string, Record<string, Record<string, readonly string[]>>>>();

      // Test specific provider access
      if (AI_SDK_MODELS.openai) {
        expectTypeOf(AI_SDK_MODELS.openai).toMatchTypeOf<Record<string, Record<string, readonly string[]>>>();

        if (AI_SDK_MODELS.openai.chat) {
          expectTypeOf(AI_SDK_MODELS.openai.chat).toMatchTypeOf<Record<string, readonly string[]>>();
        }
      }
    });
  });

  describe('Type Safety in Usage', () => {
    it('should maintain type safety when filtering models', () => {
      const openaiModels = getModelsByProvider('openai');
      const chatModels = openaiModels.filter(m => m.category === 'chat');

      expectTypeOf(chatModels).toEqualTypeOf<AISDKModel[]>();
      expectTypeOf(chatModels[0]).toEqualTypeOf<AISDKModel>();
    });

    it('should maintain type safety when mapping models', () => {
      const modelNames = ALL_MODELS.map(m => m.model);

      expectTypeOf(modelNames).toEqualTypeOf<string[]>();
      expectTypeOf(modelNames[0]).toEqualTypeOf<string>();
    });

    it('should maintain type safety with provider registry access', () => {
      const openaiRegistry = AI_SDK_MODELS.openai;

      if (openaiRegistry) {
        expectTypeOf(openaiRegistry).toMatchTypeOf<Record<string, Record<string, readonly string[]>>>();

        const chatModels = openaiRegistry.chat;
        if (chatModels) {
          expectTypeOf(chatModels).toMatchTypeOf<Record<string, readonly string[]>>();

          Object.values(chatModels).forEach(models => {
            expectTypeOf(models).toEqualTypeOf<readonly string[]>();
          });
        }
      }
    });
  });

  describe('Union Type Behavior', () => {
    it('should accept literal model names in union types', () => {
      // These should compile without errors
      const openaiModel1: OpenaiOpenAIChatModelId = 'gpt-4';
      const openaiModel2: OpenaiOpenAIChatModelId = 'gpt-4-turbo';
      const openaiModel3: OpenaiOpenAIChatModelId = 'gpt-3.5-turbo';

      expectTypeOf(openaiModel1).toEqualTypeOf<string>();
      expectTypeOf(openaiModel2).toEqualTypeOf<string>();
      expectTypeOf(openaiModel3).toEqualTypeOf<string>();
    });

    it('should accept custom strings due to string intersection', () => {
      // The & (string & {}) pattern should allow any string
      const customModel: OpenaiOpenAIChatModelId = 'my-custom-openai-model';

      expectTypeOf(customModel).toEqualTypeOf<string>();
    });
  });

  describe('Runtime vs Type Consistency', () => {
    it('should have runtime data matching type definitions', () => {
      // Test that runtime providers match what types expect
      const providers = getProviders();
      const categories = getCategories();

      expect(providers.includes('openai')).toBe(true);
      expect(providers.includes('anthropic')).toBe(true);
      expect(categories.includes('chat')).toBe(true);
      expect(categories.includes('embedding')).toBe(true);

      // Type check: these should be assignable
      const provider: AISDKProvider = providers[0];
      const category: AISDKModelCategory = categories[0];

      expectTypeOf(provider).toEqualTypeOf<string>();
      expectTypeOf(category).toEqualTypeOf<string>();
    });

    it('should have consistent model structure between types and runtime', () => {
      const model = ALL_MODELS[0];

      // Runtime checks
      expect(typeof model.provider).toBe('string');
      expect(typeof model.model).toBe('string');
      expect(typeof model.category).toBe('string');
      expect(typeof model.value).toBe('string');

      // Type checks
      expectTypeOf(model).toEqualTypeOf<AISDKModel>();
      expectTypeOf(model.provider).toEqualTypeOf<string>();
      expectTypeOf(model.model).toEqualTypeOf<string>();
      expectTypeOf(model.category).toEqualTypeOf<string>();
      expectTypeOf(model.value).toEqualTypeOf<string>();
    });
  });

  describe('Exported Type Coverage', () => {
    it('should export all necessary types', () => {
      // Test that key types are exported and usable
      type TestAISDKModel = AISDKModel;
      type TestAISDKProvider = AISDKProvider;
      type TestAISDKModelValue = AISDKModelValue;
      type TestAISDKModelCategory = AISDKModelCategory;
      type TestOpenaiModel = OpenaiOpenAIChatModelId;
      type TestAnthropicModel = AnthropicAnthropicMessagesModelId;

      expectTypeOf<TestAISDKModel>().toEqualTypeOf<AISDKModel>();
      expectTypeOf<TestAISDKProvider>().toEqualTypeOf<string>();
      expectTypeOf<TestAISDKModelValue>().toEqualTypeOf<string>();
      expectTypeOf<TestAISDKModelCategory>().toEqualTypeOf<string>();
      expectTypeOf<TestOpenaiModel>().toEqualTypeOf<string>();
      expectTypeOf<TestAnthropicModel>().toEqualTypeOf<string>();
    });
  });
});