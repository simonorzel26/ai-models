# @simonorzel26/ai-models

[![npm version](https://badge.fury.io/js/@simonorzel26%2Fai-models.svg)](https://badge.fury.io/js/@simonorzel26%2Fai-models)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Lightweight TypeScript types and metadata for all Vercel AI SDK models**

This package provides comprehensive TypeScript types and structured metadata for 1,000+ AI models from 28+ providers in the Vercel AI SDK ecosystem, with **zero runtime dependencies**.

## 🎯 What This Package Is

`@simonorzel26/ai-models` is a **types-only** package that extracts model information from @ai-sdk providers and presents it in three structured formats:

1. **TypeScript Types** - Individual type definitions for each provider's models
2. **Structured Registry** - Organized hierarchical data (provider → category → models)
3. **Flat Array** - All models in a searchable array format with metadata

## 🏗️ Architecture: Lightweight & Dependency-Free

### No @ai-sdk Packages Bundled

**Important**: This package does NOT bundle any @ai-sdk packages. Instead:

- **@ai-sdk packages are marked as external** - Not included in the bundle
- **Listed as peer dependencies** - Optional, only needed if you want to use specific providers
- **Final bundle size: ~177KB** - Just the extracted types and metadata
- **Zero runtime dependencies** - No additional packages required

### How It Works

1. **Build-time extraction**: During CI/CD, the package temporarily installs all @ai-sdk providers
2. **Type extraction**: Extracts model types and metadata from each provider
3. **Bundle generation**: Creates a lightweight bundle with only the extracted information
4. **Clean output**: Published package contains no @ai-sdk dependencies

### Consumer Benefits

- **Lightweight**: Get model types without installing heavy provider packages
- **Flexible**: Choose which providers to install separately
- **Always current**: Types stay up-to-date with latest provider versions
- **Type-safe**: Full TypeScript support for all model IDs

## 📦 Installation

```bash
npm install @simonorzel26/ai-models
```

**That's it!** No need to install @ai-sdk packages unless you want to use them.

## 🔧 Usage

### Basic Type Safety

```typescript
import {
  OpenaiOpenAIChatModelId,
  AnthropicAnthropicMessagesModelId,
  GoogleGoogleGenerativeAIModelId
} from '@simonorzel26/ai-models';

// Type-safe model selection
const openaiModel: OpenaiOpenAIChatModelId = 'gpt-4o';
const anthropicModel: AnthropicAnthropicMessagesModelId = 'claude-3-5-sonnet-latest';
const googleModel: GoogleGoogleGenerativeAIModelId = 'gemini-2.0-flash';
```

### With Vercel AI SDK

```typescript
import { openai } from '@ai-sdk/openai';  // Install separately if needed
import { generateText } from 'ai';
import { OpenaiOpenAIChatModelId } from '@simonorzel26/ai-models';

const model: OpenaiOpenAIChatModelId = 'gpt-4o';

const result = await generateText({
  model: openai(model),
  prompt: 'Hello world',
});
```

## 📊 The Three Data Structures

### 1. TypeScript Types

Individual type definitions for each provider's models:

```typescript
// OpenAI Models
export type OpenaiOpenAIChatModelId = 'o1' | 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4' | 'gpt-3.5-turbo' | ...;
export type OpenaiOpenAIEmbeddingModelId = 'text-embedding-3-large' | 'text-embedding-3-small' | ...;
export type OpenaiOpenAIImageModelId = 'dall-e-3' | 'dall-e-2' | ...;

// Anthropic Models
export type AnthropicAnthropicMessagesModelId = 'claude-3-5-sonnet-latest' | 'claude-3-opus-latest' | ...;

// Google Models
export type GoogleGoogleGenerativeAIModelId = 'gemini-2.0-flash' | 'gemini-1.5-pro' | ...;

// And 50+ more provider-specific types...
```

**Use case**: Type-safe model selection in your application code.

### 2. Structured Registry (AI_SDK_MODELS)

Hierarchical organization by provider → category → models:

```typescript
import { AI_SDK_MODELS } from '@simonorzel26/ai-models';

// Structure: AI_SDK_MODELS[provider][category][typeId]
const openaiChatModels = AI_SDK_MODELS.openai.chat.OpenaiOpenAIChatModelId;
// Returns: ['o1', 'gpt-4o', 'gpt-4o-mini', 'gpt-4', ...]

const anthropicChatModels = AI_SDK_MODELS.anthropic.chat.AnthropicAnthropicMessagesModelId;
// Returns: ['claude-3-5-sonnet-latest', 'claude-3-opus-latest', ...]

// Browse all providers
Object.keys(AI_SDK_MODELS);
// Returns: ['openai', 'anthropic', 'google', 'mistral', ...]

// Browse categories for a provider
Object.keys(AI_SDK_MODELS.openai);
// Returns: ['chat', 'completion', 'embedding', 'image', 'transcription', 'speech', 'responses']
```

**Use case**: Building UI components, configuration systems, or exploring available models.

### 3. Flat Array (ALL_MODELS)

All models in a searchable array with metadata:

```typescript
import { ALL_MODELS } from '@simonorzel26/ai-models';

// Structure: Array of { provider, model, category, value }
console.log(ALL_MODELS[0]);
// Returns: {
//   provider: 'openai',
//   model: 'gpt-4o',
//   category: 'chat',
//   value: 'openai:gpt-4o'
// }

// Search and filter
const chatModels = ALL_MODELS.filter(m => m.category === 'chat');
const openaiModels = ALL_MODELS.filter(m => m.provider === 'openai');
const gptModels = ALL_MODELS.filter(m => m.model.includes('gpt'));
```

**Use case**: Dynamic model discovery, search functionality, analytics, or building model catalogs.

## 🛠️ Utility Functions

```typescript
import {
  getModelsByProvider,
  getModelsByCategory,
  getProviders,
  getCategories,
  ALL_MODELS
} from '@simonorzel26/ai-models';

// Get all OpenAI models
const openaiModels = getModelsByProvider('openai');
// Returns: [{ provider: 'openai', model: 'gpt-4o', category: 'chat', value: 'openai:gpt-4o' }, ...]

// Get all chat models across providers
const chatModels = getModelsByCategory('chat');

// Get all available providers
const providers = getProviders();
// Returns: ['openai', 'anthropic', 'google', 'mistral', ...]

// Get all available categories
const categories = getCategories();
// Returns: ['chat', 'embedding', 'image', 'transcription', 'speech', 'completion', 'responses']

// Access raw data
console.log(ALL_MODELS.length); // 1,000+ models
```

## 🎯 Supported Providers

**28 providers** extracting models from **35+ @ai-sdk packages**:

### Official @ai-sdk Providers

| Provider | Models | Categories |
|----------|---------|------------|
| `@ai-sdk/openai` | 30+ | chat, completion, embedding, image, transcription, speech, responses |
| `@ai-sdk/anthropic` | 12+ | chat |
| `@ai-sdk/google` | 26+ | chat, embedding |
| `@ai-sdk/google-vertex` | 15+ | chat, image |
| `@ai-sdk/mistral` | 10+ | chat, embedding |
| `@ai-sdk/cohere` | 11+ | chat, embedding |
| `@ai-sdk/amazon-bedrock` | 32+ | chat, embedding, image |
| `@ai-sdk/groq` | 13+ | chat, transcription |
| `@ai-sdk/fireworks` | 20+ | chat, completion, embedding, image |
| `@ai-sdk/deepinfra` | 70+ | chat, embedding, image |
| `@ai-sdk/togetherai` | 45+ | chat, embedding, completion, image |
| `@ai-sdk/perplexity` | 5+ | chat |
| `@ai-sdk/xai` | 19+ | chat, image |
| `@ai-sdk/deepseek` | 2+ | chat |
| `@ai-sdk/cerebras` | 3+ | chat |
| Plus 13+ more official providers

### Community Providers

| Provider | Models | Categories |
|----------|---------|------------|
| `ollama-ai-provider` | 180+ | chat, embedding |
| `anthropic-vertex-ai` | 6+ | chat |
| `mixedbread-ai-provider` | 3+ | embedding |
| `voyage-ai-provider` | 17+ | embedding, multimodal |
| `spark-ai-provider` | 6+ | chat |
| `chrome-ai` | 1+ | chat |
| `sarvam-ai-provider` | 3+ | transcription |
| `@langdb/vercel-provider` | 400+ | chat, image, embedding |
| Plus 5+ more community providers

## 📋 Type Definitions

### Core Types

```typescript
// Model metadata type
type AISDKModel = {
  provider: string;
  model: string;
  category: string;
  value: string;
};

// Derived types
type AISDKProvider = AISDKModel["provider"];
type AISDKModelCategory = AISDKModel["category"];
type AISDKModelValue = AISDKModel["value"];
```

### Model Categories

```typescript
type AISDKModelCategory =
  | 'chat'           // Text generation models
  | 'completion'     // Text completion models
  | 'embedding'      // Vector embedding models
  | 'image'          // Image generation models
  | 'transcription'  // Audio-to-text models
  | 'speech'         // Text-to-speech models
  | 'responses';     // Structured response models
```

## 📈 Package Statistics

- **1,000+ models** catalogued across all providers
- **54 unique TypeScript types** generated
- **7 model categories** supported
- **35+ @ai-sdk packages** analyzed
- **28 providers** with extractable models
- **Auto-updated** via GitHub Actions
- **Zero runtime dependencies**

## 🚀 Advanced Usage

### Building a Model Selector

```typescript
import { getProviders, getModelsByProvider } from '@simonorzel26/ai-models';

function ModelSelector() {
  const providers = getProviders();

  return (
    <select>
      {providers.map(provider => (
        <optgroup key={provider} label={provider}>
          {getModelsByProvider(provider).map(model => (
            <option key={model.value} value={model.value}>
              {model.model}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
```

### Model Analytics

```typescript
import { ALL_MODELS, getCategories } from '@simonorzel26/ai-models';

// Count models by category
const modelStats = getCategories().reduce((stats, category) => {
  stats[category] = ALL_MODELS.filter(m => m.category === category).length;
  return stats;
}, {} as Record<string, number>);

console.log(modelStats);
// Output: { chat: 800+, embedding: 100+, image: 50+, ... }
```

### Provider Feature Detection

```typescript
import { AI_SDK_MODELS } from '@simonorzel26/ai-models';

// Check if a provider supports image generation
const hasImageSupport = (provider: string) => {
  return AI_SDK_MODELS[provider]?.image !== undefined;
};

console.log(hasImageSupport('openai'));    // true
console.log(hasImageSupport('anthropic')); // false
```

## 🔄 Updates

This package is automatically updated via GitHub Actions:

- **Daily checks** for new @ai-sdk package versions
- **Automatic extraction** of new models and types
- **Semantic versioning** based on changes detected
- **GitHub releases** with detailed changelogs

## 🤝 Contributing

This package is auto-generated from @ai-sdk providers. To add support for a new provider:

1. Ensure the provider follows @ai-sdk conventions
2. Add it to the `peerDependencies` in `package.json`
3. Update the extraction script to include the provider
4. The CI/CD pipeline will handle the rest

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

*Built with ❤️ for the Vercel AI SDK community. This package provides type safety and metadata without the bloat of bundling actual provider packages.*