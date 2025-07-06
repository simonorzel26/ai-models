# @shadcn/ai-models

[![npm version](https://badge.fury.io/js/@shadcn%2Fai-models.svg)](https://badge.fury.io/js/@shadcn%2Fai-models)
[![npm downloads](https://img.shields.io/npm/dm/@shadcn/ai-models.svg)](https://www.npmjs.com/package/@shadcn/ai-models)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**AI model types and utilities for the Vercel AI SDK ecosystem**

Automatically generated TypeScript types and utilities for all AI SDK providers. This package provides comprehensive type definitions for 1,000+ AI models across 28+ providers, with automatic updates when new models are released.

## 🚀 Features

- ✅ **Complete Type Coverage**: 1,000+ AI models across 28+ providers
- ✅ **Multi-Format Support**: ESM, CJS, and TypeScript declarations
- ✅ **Auto-Generated**: Automatically updated when providers release new models
- ✅ **Type Safety**: Full TypeScript support with intelligent autocomplete
- ✅ **Utility Functions**: Helper functions for filtering and querying models
- ✅ **Lightweight**: Tree-shakeable exports, only import what you need

## 📦 Installation

```bash
npm install @shadcn/ai-models
# or
pnpm add @shadcn/ai-models
# or
yarn add @shadcn/ai-models
# or
bun add @shadcn/ai-models
```

## 🔧 Usage

### Import Model Types

```typescript
import {
  OpenaiOpenAIChatModelId,
  AnthropicAnthropicMessagesModelId,
  AI_SDK_MODELS,
  getModelsByProvider,
  getModelsByCategory
} from '@shadcn/ai-models';

// Use specific provider model types
const openaiModel: OpenaiOpenAIChatModelId = 'gpt-4';
const anthropicModel: AnthropicAnthropicMessagesModelId = 'claude-3-opus';
```

### Query Models Dynamically

```typescript
import { getModelsByProvider, getModelsByCategory, getProviders } from '@shadcn/ai-models';

// Get all OpenAI models
const openaiModels = getModelsByProvider('openai');
console.log(openaiModels); // [{ provider: 'openai', model: 'gpt-4', category: 'chat', value: 'openai:gpt-4' }, ...]

// Get all chat models
const chatModels = getModelsByCategory('chat');
console.log(chatModels.length); // 500+

// Get all available providers
const providers = getProviders();
console.log(providers); // ['openai', 'anthropic', 'google', ...]
```

### Use with Vercel AI SDK

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { OpenaiOpenAIChatModelId } from '@shadcn/ai-models';

// Type-safe model selection
const model: OpenaiOpenAIChatModelId = 'gpt-4-turbo';

const result = await generateText({
  model: openai(model),
  prompt: 'Hello world',
});
```

### Browse Model Registry

```typescript
import { AI_SDK_MODELS } from '@shadcn/ai-models';

// Explore available models by provider and category
console.log(AI_SDK_MODELS.openai.chat); // OpenAI chat models
console.log(AI_SDK_MODELS.openai.embedding); // OpenAI embedding models
console.log(AI_SDK_MODELS.anthropic.chat); // Anthropic chat models
```

## 🏗️ Supported Providers

### Official @ai-sdk Providers (18)
- **OpenAI** - GPT-4, GPT-3.5, DALL-E, Whisper, TTS models
- **Anthropic** - Claude 3 Opus, Sonnet, Haiku models
- **Google** - Gemini, PaLM, Vertex AI models
- **Mistral** - Mistral 7B, Mixtral, Codestral models
- **Cohere** - Command, Embed models
- **Amazon Bedrock** - Multi-provider models via AWS
- **And 12+ more official providers**

### Community Providers (10)
- **Ollama** - Local model execution
- **OpenRouter** - Unified API for multiple providers
- **Together.ai** - Open-source model hosting
- **DeepInfra** - Serverless inference
- **Fireworks** - Fast inference platform
- **And 5+ more community providers**

## 📊 Statistics

- **28 providers** with extractable types
- **54 unique model types** generated
- **1,021 total models** cataloged
- **7 model categories** (chat, embedding, image, transcription, speech, completion, responses)

## 🔄 Automatic Updates

This package is automatically updated via GitHub Actions:

- **Weekly**: Checks for new AI SDK releases
- **Manual**: Can be triggered manually via GitHub Actions
- **CI/CD**: Automatically builds and publishes when models change

## 📖 API Reference

### Types

```typescript
// Provider-specific model types
type OpenaiOpenAIChatModelId = 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo' | ...;
type AnthropicAnthropicMessagesModelId = 'claude-3-opus' | 'claude-3-sonnet' | ...;

// Global types
type AISDKModel = {
  provider: string;
  model: string;
  category: string;
  value: string;
};
type AISDKProvider = string;
type AISDKModelCategory = 'chat' | 'embedding' | 'image' | 'transcription' | 'speech' | 'completion' | 'responses';
```

### Constants

```typescript
// Complete model registry organized by provider and category
const AI_SDK_MODELS: Record<string, Record<string, Record<string, string[]>>>;

// Flat array of all models with metadata
const ALL_MODELS: AISDKModel[];
```

### Utility Functions

```typescript
// Get models by provider
function getModelsByProvider(provider: AISDKProvider): AISDKModel[];

// Get models by category
function getModelsByCategory(category: AISDKModelCategory): AISDKModel[];

// Get all available providers
function getProviders(): AISDKProvider[];

// Get all available categories
function getCategories(): AISDKModelCategory[];
```

## 🛠️ Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/shadcn-ui/ai-models.git

# Install dependencies
bun install

# Extract model types from installed providers
bun run extract

# Build the package
bun run build

# Run type checking
bun run typecheck
```

### Project Structure

```
src/
├── extract-model-types.ts  # Model extraction script
├── ai-models.ts           # Generated model types (auto-generated)
└── index.ts              # Main entry point

dist/
├── index.js              # ESM build
├── index.cjs             # CommonJS build
├── index.d.ts            # TypeScript declarations (ESM)
└── index.d.cts           # TypeScript declarations (CJS)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add support for new providers in `COMMUNITY_PROVIDERS`
4. Update extraction patterns if needed
5. Submit a pull request

## 📝 License

MIT © [shadcn](https://github.com/shadcn)

---

**Note**: This package is automatically generated and maintained. Model types are extracted directly from the official AI SDK provider packages to ensure accuracy and completeness.