import { describe, it, expect, beforeAll } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

describe('Package Import Integration Tests', () => {
  beforeAll(async () => {
    // Ensure the package is built
    if (!fs.existsSync(path.join(process.cwd(), 'dist'))) {
      throw new Error('Package not built. Run "npm run build" first.');
    }
  });

  describe('CommonJS Import', () => {
    it('should import all exports via require()', async () => {
      const testCode = `
        const pkg = require('./dist/index.cjs');

        // Test that all exports are available
        console.log('CJS_TEST_RESULT:', JSON.stringify({
          hasGetProviders: typeof pkg.getProviders === 'function',
          hasGetCategories: typeof pkg.getCategories === 'function',
          hasGetModelsByProvider: typeof pkg.getModelsByProvider === 'function',
          hasGetModelsByCategory: typeof pkg.getModelsByCategory === 'function',
          hasAllModels: Array.isArray(pkg.ALL_MODELS),
          hasAiSdkModels: typeof pkg.AI_SDK_MODELS === 'object',
          providersCount: pkg.getProviders().length,
          modelsCount: pkg.ALL_MODELS.length,
          categoriesCount: pkg.getCategories().length,
          sampleProvider: pkg.getProviders()[0],
          sampleCategory: pkg.getCategories()[0]
        }));
      `;

      const { stdout } = await execAsync(`node -e "${testCode}"`);
      const result = JSON.parse(stdout.split('CJS_TEST_RESULT: ')[1]);

      expect(result.hasGetProviders).toBe(true);
      expect(result.hasGetCategories).toBe(true);
      expect(result.hasGetModelsByProvider).toBe(true);
      expect(result.hasGetModelsByCategory).toBe(true);
      expect(result.hasAllModels).toBe(true);
      expect(result.hasAiSdkModels).toBe(true);
      expect(result.providersCount).toBeGreaterThan(0);
      expect(result.modelsCount).toBeGreaterThan(900);
      expect(result.categoriesCount).toBeGreaterThan(0);
      expect(typeof result.sampleProvider).toBe('string');
      expect(typeof result.sampleCategory).toBe('string');
    });

    it('should work with destructuring import', async () => {
      const testCode = `
        const { getProviders, ALL_MODELS, AI_SDK_MODELS } = require('./dist/index.cjs');

        console.log('CJS_DESTRUCTURE_RESULT:', JSON.stringify({
          providersFunction: typeof getProviders,
          allModelsArray: Array.isArray(ALL_MODELS),
          aiSdkModelsObject: typeof AI_SDK_MODELS,
          providersLength: getProviders().length,
          modelsLength: ALL_MODELS.length
        }));
      `;

      const { stdout } = await execAsync(`node -e "${testCode}"`);
      const result = JSON.parse(stdout.split('CJS_DESTRUCTURE_RESULT: ')[1]);

      expect(result.providersFunction).toBe('function');
      expect(result.allModelsArray).toBe(true);
      expect(result.aiSdkModelsObject).toBe('object');
      expect(result.providersLength).toBeGreaterThan(0);
      expect(result.modelsLength).toBeGreaterThan(900);
    });
  });

  describe('ES Module Import', () => {
    it('should import all exports via import()', async () => {
      const testCode = `
        import('./dist/index.js').then(pkg => {
          console.log('ESM_TEST_RESULT:', JSON.stringify({
            hasGetProviders: typeof pkg.getProviders === 'function',
            hasGetCategories: typeof pkg.getCategories === 'function',
            hasGetModelsByProvider: typeof pkg.getModelsByProvider === 'function',
            hasGetModelsByCategory: typeof pkg.getModelsByCategory === 'function',
            hasAllModels: Array.isArray(pkg.ALL_MODELS),
            hasAiSdkModels: typeof pkg.AI_SDK_MODELS === 'object',
            providersCount: pkg.getProviders().length,
            modelsCount: pkg.ALL_MODELS.length,
            categoriesCount: pkg.getCategories().length,
            openaiModelsCount: pkg.getModelsByProvider('openai').length,
            chatModelsCount: pkg.getModelsByCategory('chat').length
          }));
        }).catch(err => {
          console.error('ESM_ERROR:', err.message);
          process.exit(1);
        });
      `;

      const { stdout } = await execAsync(`node -e "${testCode}"`);
      const result = JSON.parse(stdout.split('ESM_TEST_RESULT: ')[1]);

      expect(result.hasGetProviders).toBe(true);
      expect(result.hasGetCategories).toBe(true);
      expect(result.hasGetModelsByProvider).toBe(true);
      expect(result.hasGetModelsByCategory).toBe(true);
      expect(result.hasAllModels).toBe(true);
      expect(result.hasAiSdkModels).toBe(true);
      expect(result.providersCount).toBeGreaterThan(0);
      expect(result.modelsCount).toBeGreaterThan(900);
      expect(result.categoriesCount).toBeGreaterThan(0);
      expect(result.openaiModelsCount).toBeGreaterThan(0);
      expect(result.chatModelsCount).toBeGreaterThan(0);
    });
  });

  describe('Package Metadata', () => {
    it('should have correct package.json structure', async () => {
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

      expect(packageJson.name).toBe('@simonorzel26/ai-models');
      expect(packageJson.main).toBe('./dist/index.cjs');
      expect(packageJson.module).toBe('./dist/index.js');
      expect(packageJson.types).toBe('./dist/index.d.ts');
      expect(packageJson.exports).toBeDefined();
      expect(packageJson.exports['.']).toBeDefined();
      expect(packageJson.exports['.'].import).toBeDefined();
      expect(packageJson.exports['.'].require).toBeDefined();
    });

    it('should have all required build files', () => {
      const requiredFiles = [
        'dist/index.js',      // ESM
        'dist/index.cjs',     // CommonJS
        'dist/index.d.ts',    // TypeScript declarations (ESM)
        'dist/index.d.cts'    // TypeScript declarations (CJS)
      ];

      requiredFiles.forEach(file => {
        expect(fs.existsSync(file)).toBe(true);
      });
    });

    it('should have reasonable file sizes', () => {
      const files = [
        'dist/index.js',
        'dist/index.cjs',
        'dist/index.d.ts',
        'dist/index.d.cts'
      ];

      files.forEach(file => {
        const stats = fs.statSync(file);
        // Should be larger than 100KB (lots of model data) but smaller than 500KB
        expect(stats.size).toBeGreaterThan(100 * 1024);
        expect(stats.size).toBeLessThan(500 * 1024);
      });
    });
  });

  describe('Real-world Usage Scenarios', () => {
    it('should work with OpenAI provider filtering', async () => {
      const testCode = `
        const { getModelsByProvider, getModelsByCategory } = require('./dist/index.cjs');

        const openaiModels = getModelsByProvider('openai');
        const chatModels = getModelsByCategory('chat');
        const openaiChatModels = openaiModels.filter(m => m.category === 'chat');

        console.log('USAGE_TEST_RESULT:', JSON.stringify({
          openaiTotal: openaiModels.length,
          chatTotal: chatModels.length,
          openaiChatModels: openaiChatModels.length,
          hasGpt4: openaiChatModels.some(m => m.model.includes('gpt-4')),
          sampleOpenaiChatModel: openaiChatModels[0]?.model || null
        }));
      `;

      const { stdout } = await execAsync(`node -e "${testCode}"`);
      const result = JSON.parse(stdout.split('USAGE_TEST_RESULT: ')[1]);

      expect(result.openaiTotal).toBeGreaterThan(0);
      expect(result.chatTotal).toBeGreaterThan(0);
      expect(result.openaiChatModels).toBeGreaterThan(0);
      expect(result.hasGpt4).toBe(true);
      expect(typeof result.sampleOpenaiChatModel).toBe('string');
    });

    it('should work with provider registry access', async () => {
      const testCode = `
        const { AI_SDK_MODELS } = require('./dist/index.cjs');

        const openaiChatTypes = Object.keys(AI_SDK_MODELS.openai?.chat || {});
        const anthropicChatTypes = Object.keys(AI_SDK_MODELS.anthropic?.chat || {});

        console.log('REGISTRY_TEST_RESULT:', JSON.stringify({
          hasOpenaiChatTypes: openaiChatTypes.length > 0,
          hasAnthropicChatTypes: anthropicChatTypes.length > 0,
          openaiChatTypesCount: openaiChatTypes.length,
          firstOpenaiChatType: openaiChatTypes[0] || null,
          firstAnthropicChatType: anthropicChatTypes[0] || null
        }));
      `;

      const { stdout } = await execAsync(`node -e "${testCode}"`);
      const result = JSON.parse(stdout.split('REGISTRY_TEST_RESULT: ')[1]);

      expect(result.hasOpenaiChatTypes).toBe(true);
      expect(result.hasAnthropicChatTypes).toBe(true);
      expect(result.openaiChatTypesCount).toBeGreaterThan(0);
      expect(typeof result.firstOpenaiChatType).toBe('string');
      expect(typeof result.firstAnthropicChatType).toBe('string');
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent providers gracefully', async () => {
      const testCode = `
        const { getModelsByProvider } = require('./dist/index.cjs');

        const result = getModelsByProvider('non-existent-provider');

        console.log('ERROR_TEST_RESULT:', JSON.stringify({
          isArray: Array.isArray(result),
          length: result.length,
          isEmpty: result.length === 0
        }));
      `;

      const { stdout } = await execAsync(`node -e "${testCode}"`);
      const result = JSON.parse(stdout.split('ERROR_TEST_RESULT: ')[1]);

      expect(result.isArray).toBe(true);
      expect(result.length).toBe(0);
      expect(result.isEmpty).toBe(true);
    });

    it('should handle non-existent categories gracefully', async () => {
      const testCode = `
        const { getModelsByCategory } = require('./dist/index.cjs');

        const result = getModelsByCategory('non-existent-category');

        console.log('CATEGORY_ERROR_TEST_RESULT:', JSON.stringify({
          isArray: Array.isArray(result),
          length: result.length,
          isEmpty: result.length === 0
        }));
      `;

      const { stdout } = await execAsync(`node -e "${testCode}"`);
      const result = JSON.parse(stdout.split('CATEGORY_ERROR_TEST_RESULT: ')[1]);

      expect(result.isArray).toBe(true);
      expect(result.length).toBe(0);
      expect(result.isEmpty).toBe(true);
    });
  });
});