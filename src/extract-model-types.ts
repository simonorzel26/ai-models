#!/usr/bin/env bun

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname); // Go up one level to find node_modules at project root

interface ModelType {
  typeName: string;
  models: string[];
  category: string;
}

interface ProviderModels {
  [key: string]: ModelType[];
}

// Extract model types from a type definition file
function extractModelTypes(content: string): ModelType[] {
  const modelTypes: ModelType[] = [];

  // Regular expression to match various model type patterns
  const typeRegexes = [
    /type\s+(\w*ModelId)\s*=\s*([^;]+);/g,           // Standard: xxxModelId
    /type\s+(\w*Model)\s*=\s*([^;]+);/g,              // Alternative: xxxModel
    /type\s+(\w*Models)\s*=\s*([^;]+);/g,             // Alternative: xxxModels
    /type\s+(\w*ChatModel)\s*=\s*([^;]+);/g,          // Alternative: xxxChatModel
    /type\s+(\w*EmbeddingModel)\s*=\s*([^;]+);/g,     // Alternative: xxxEmbeddingModel
    /type\s+(\w*ImageModel)\s*=\s*([^;]+);/g          // Alternative: xxxImageModel
  ];

  // Try each regex pattern
  for (const typeRegex of typeRegexes) {
    let match;
    while ((match = typeRegex.exec(content)) !== null) {
      const [, typeName, definition] = match;

      // Skip if typeName or definition is undefined
      if (!typeName || !definition) {
        continue;
      }

      if (typeName === 'OpenAIResponsesModelId') {
        continue;
      }

      // Extract the string literals from the union type
      const modelMatches = definition.match(/'([^']+)'/g);
      if (modelMatches) {
        const models = modelMatches.map(m => m.replace(/'/g, ''));

        // Determine the category based on the type name
        let category = 'chat';
        if (typeName.toLowerCase().includes('embedding')) {
          category = 'embedding';
        } else if (typeName.toLowerCase().includes('image')) {
          category = 'image';
        } else if (typeName.toLowerCase().includes('completion')) {
          category = 'completion';
        } else if (typeName.toLowerCase().includes('transcription')) {
          category = 'transcription';
        } else if (typeName.toLowerCase().includes('speech')) {
          category = 'speech';
        } else if (typeName.toLowerCase().includes('responses')) {
          category = 'responses';
        }

        // Check if we already have this type (avoid duplicates)
        const existingType = modelTypes.find(t => t.typeName === typeName);
        if (!existingType) {
          modelTypes.push({
            typeName,
            models,
            category
          });
        }
      }
    }
  }

  return modelTypes;
}

// Generate TypeScript file with all models
function generateModelTypesFile(providerModels: ProviderModels) {
  const lines: string[] = [];

  // Helper function to create unique type names
  const createProviderPrefix = (provider: string): string => {
    return provider
      .split(/[-@\/]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  };

  lines.push('/**');
  lines.push(' * Generated model types from @ai-sdk providers');
  lines.push(' * This file is auto-generated - do not edit manually');
  lines.push(' */');
  lines.push('');

  // Generate individual provider model types
  Object.entries(providerModels).forEach(([provider, modelTypes]) => {
    lines.push(`// ${provider.toUpperCase()} Models`);

    modelTypes.forEach(({ typeName, models }) => {
      // Create a unique type name by combining provider and original type name
      const providerPrefix = createProviderPrefix(provider);
      const uniqueTypeName = `${providerPrefix}${typeName}`;
      lines.push(`export type ${uniqueTypeName} = ${models.map(m => `'${m}'`).join(' | ')} | (string & {});`);
    });

    lines.push('');
  });

  // Generate organized model registry
  lines.push('// Model Registry by Provider');
  lines.push('export const AI_SDK_MODELS = {');

  Object.entries(providerModels).forEach(([provider, modelTypes]) => {
    // Quote provider names that contain hyphens
    const providerKey = provider.includes('-') ? `'${provider}'` : provider;
    lines.push(`  ${providerKey}: {`);

    // Group by category
    const categories = [...new Set(modelTypes.map(t => t.category))];
    categories.forEach(category => {
      const categoryModels = modelTypes.filter(t => t.category === category);
      if (categoryModels.length > 0) {
        lines.push(`    ${category}: {`);
        categoryModels.forEach(({ typeName, models }) => {
          // Create the same unique type name as above
          const providerPrefix = createProviderPrefix(provider);
          const uniqueTypeName = `${providerPrefix}${typeName}`;
          lines.push(`      ${uniqueTypeName}: [${models.map(m => `'${m}'`).join(', ')}],`);
        });
        lines.push(`    },`);
      }
    });

    lines.push(`  },`);
  });

  lines.push('} as const;');
  lines.push('');

  // Generate flat list of all models
  lines.push('// Flat list of all models with provider prefix');
  lines.push('export const ALL_MODELS = [');

  Object.entries(providerModels).forEach(([provider, modelTypes]) => {
    modelTypes.forEach(({ models, category }) => {
      models.forEach(model => {
        lines.push(`  { provider: '${provider}', model: '${model}', category: '${category}', value: '${provider}:${model}' },`);
      });
    });
  });

  lines.push('] as const;');
  lines.push('');

  // Generate types for the model registry
  lines.push('// Types');
  lines.push('export type AISDKModel = typeof ALL_MODELS[number];');
  lines.push('export type AISDKProvider = AISDKModel["provider"];');
  lines.push('export type AISDKModelValue = AISDKModel["value"];');
  lines.push('export type AISDKModelCategory = AISDKModel["category"];');
  lines.push('');

  // Generate utility functions
  lines.push('// Utility functions');
  lines.push('export function getModelsByProvider(provider: AISDKProvider): AISDKModel[] {');
  lines.push('  return ALL_MODELS.filter(m => m.provider === provider);');
  lines.push('}');
  lines.push('');
  lines.push('export function getModelsByCategory(category: AISDKModelCategory): AISDKModel[] {');
  lines.push('  return ALL_MODELS.filter(m => m.category === category);');
  lines.push('}');
  lines.push('');
  lines.push('export function getProviders(): AISDKProvider[] {');
  lines.push('  return Array.from(new Set(ALL_MODELS.map(m => m.provider)));');
  lines.push('}');
  lines.push('');
  lines.push('export function getCategories(): AISDKModelCategory[] {');
  lines.push('  return Array.from(new Set(ALL_MODELS.map(m => m.category)));');
  lines.push('}');

  return lines.join('\n');
}

// Community providers list
const COMMUNITY_PROVIDERS = [
  'ollama-ai-provider',
  'chrome-ai',
  '@friendliai/ai-provider',
  '@portkey-ai/vercel-provider',
  'workers-ai-provider',
  '@openrouter/ai-sdk-provider',
  '@requesty/ai-sdk',
  '@crosshatch/ai-provider',
  'mixedbread-ai-provider',
  'voyage-ai-provider',
  '@mem0/vercel-ai-provider',
  '@letta-ai/vercel-ai-sdk-provider',
  'spark-ai-provider',
  'anthropic-vertex-ai',
  '@langdb/vercel-provider',
  'dify-ai-provider',
  'sarvam-ai-provider'
];

// Dynamically discover all @ai-sdk providers
function findAiSdkProviders(): string[] {
  const providers: string[] = [];

  // Find official @ai-sdk providers
  const aiSdkDir = path.join(rootDir, 'node_modules', '@ai-sdk');
  if (fs.existsSync(aiSdkDir)) {
    const officialProviders = fs.readdirSync(aiSdkDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(name => {
        // Check if the provider has a dist/index.d.ts file
        const typeFilePath = path.join(aiSdkDir, name, 'dist', 'index.d.ts');
        return fs.existsSync(typeFilePath);
      });

    providers.push(...officialProviders);
  }

  // Find community providers
  const nodeModulesDir = path.join(rootDir, 'node_modules');
  if (fs.existsSync(nodeModulesDir)) {
    const communityProviders = COMMUNITY_PROVIDERS.filter(provider => {
      // Handle scoped packages (e.g., @friendliai/ai-provider)
      const providerPath = provider.startsWith('@')
        ? path.join(nodeModulesDir, provider)
        : path.join(nodeModulesDir, provider);

      // Check for various possible type definition files
      const possibleTypeFiles = [
        path.join(providerPath, 'dist', 'index.d.ts'),
        path.join(providerPath, 'lib', 'index.d.ts'),
        path.join(providerPath, 'index.d.ts'),
        path.join(providerPath, 'dist', 'types.d.ts'),
        path.join(providerPath, 'types.d.ts')
      ];

      return fs.existsSync(providerPath) &&
             possibleTypeFiles.some(typeFile => fs.existsSync(typeFile));
    });

    providers.push(...communityProviders);
  }

  return providers;
}

async function main() {
  console.log('🚀 Extracting model types from @ai-sdk providers...');

  // Dynamically find all available providers
  const providers = findAiSdkProviders();
  console.log(`📦 Found ${providers.length} @ai-sdk providers: ${providers.join(', ')}`);

  const providerModels: ProviderModels = {};

  for (const provider of providers) {
    console.log(`📁 Processing ${provider}...`);

    try {
      let typeFilePath: string;
      let content: string;

      // Determine the correct path based on provider type
      if (COMMUNITY_PROVIDERS.includes(provider)) {
        // Community provider - check multiple possible locations
        const nodeModulesDir = path.join(rootDir, 'node_modules');
        const providerPath = provider.startsWith('@')
          ? path.join(nodeModulesDir, provider)
          : path.join(nodeModulesDir, provider);

        const possibleTypeFiles = [
          path.join(providerPath, 'dist', 'index.d.ts'),
          path.join(providerPath, 'lib', 'index.d.ts'),
          path.join(providerPath, 'index.d.ts'),
          path.join(providerPath, 'dist', 'types.d.ts'),
          path.join(providerPath, 'types.d.ts')
        ];

        const foundTypeFile = possibleTypeFiles.find(file => fs.existsSync(file));
        if (!foundTypeFile) {
          console.log(`  ⚠️  No type definition file found`);
          continue;
        }

        typeFilePath = foundTypeFile;
        content = fs.readFileSync(typeFilePath, 'utf8');
      } else {
        // Official @ai-sdk provider
        typeFilePath = path.join(rootDir, 'node_modules', '@ai-sdk', provider, 'dist', 'index.d.ts');
        content = fs.readFileSync(typeFilePath, 'utf8');
      }

      const modelTypes = extractModelTypes(content);

      if (modelTypes.length > 0) {
        providerModels[provider] = modelTypes;
        console.log(`  ✅ Found ${modelTypes.length} model types`);
      } else {
        console.log(`  ⚠️  No model types found`);
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${provider}:`, error);
    }
  }

  // Generate the output file in the src directory
  const outputContent = generateModelTypesFile(providerModels);
  const outputPath = path.join(__dirname, 'ai-models.ts');

  fs.writeFileSync(outputPath, outputContent);

  console.log(`\n🎉 Generated model types file: ${outputPath}`);
  console.log(`📊 Summary:`);
  console.log(`  - Providers processed: ${Object.keys(providerModels).length}`);
  console.log(`  - Total model types: ${Object.values(providerModels).flat().length}`);
  console.log(`  - Total models: ${Object.values(providerModels).flat().map(t => t.models.length).reduce((a, b) => a + b, 0)}`);
}

main().catch(console.error);