# @simonorzel26/ai-models

[![npm version](https://badge.fury.io/js/@simonorzel26%2Fai-models.svg)](https://badge.fury.io/js/@simonorzel26%2Fai-models)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Converts Vercel AI SDK's TypeScript model types into usable JavaScript objects and arrays.

## Usage

This package provides multiple ways to work with AI SDK models, from simple to advanced:

### 🎯 Simple & Clean Types
```typescript
import { OpenAIChatModel, AnthropicChatModel, GoogleChatModel } from '@simonorzel26/ai-models';

// Clean, readable type names
const gptModel: OpenAIChatModel = 'gpt-4o';
const claudeModel: AnthropicChatModel = 'claude-3-5-sonnet-20241022';
const geminiModel: GoogleChatModel = 'gemini-1.5-pro';
```

### 🚀 Popular Models (Quick Access)
```typescript
import { POPULAR_MODELS } from '@simonorzel26/ai-models';

// Easy access to commonly used models
const gpt4o = POPULAR_MODELS.GPT_4O;              // 'gpt-4o'
const claude = POPULAR_MODELS.CLAUDE_3_5_SONNET;  // 'claude-3-5-sonnet-20241022'
const gemini = POPULAR_MODELS.GEMINI_1_5_PRO;     // 'gemini-1.5-pro'
```

### 📦 Provider Collections
```typescript
import { OPENAI_MODELS, ANTHROPIC_MODELS } from '@simonorzel26/ai-models';

// Organized by provider and category
const openaiChatModels = OPENAI_MODELS.chat;         // ['gpt-4o', 'gpt-4-turbo', ...]
const openaiEmbeddings = OPENAI_MODELS.embedding;    // ['text-embedding-3-large', ...]
const claudeModels = ANTHROPIC_MODELS.chat;          // ['claude-3-5-sonnet-20241022', ...]
```

### 🔧 Advanced Utilities
```typescript
import {
  getModelInfo,
  findModels,
  isValidModel,
  getModelCount
} from '@simonorzel26/ai-models';

// Get detailed model information
const info = getModelInfo('gpt-4o');
// Returns: { provider: 'openai', model: 'gpt-4o', category: 'chat', value: 'openai:gpt-4o' }

// Find models with filters
const models = findModels({ provider: 'openai', category: 'chat' });

// Validate model names
if (isValidModel('gpt-4o')) {
  // Model exists
}

// Get statistics
const totalModels = getModelCount();
const openaiModels = getModelCount({ provider: 'openai' });
```

### 🎨 Category-Based Types
```typescript
import { ChatModel, EmbeddingModel, ImageModel } from '@simonorzel26/ai-models';

// Use any chat model from any provider
const chatModel: ChatModel = 'gpt-4o' || 'claude-3-5-sonnet-20241022' || 'gemini-1.5-pro';

// Use any embedding model
const embeddingModel: EmbeddingModel = 'text-embedding-3-large' || 'text-embedding-004';
```

### 🏗️ Real-World Examples

#### Building a Model Selector
```typescript
import {
  POPULAR_MODELS,
  OPENAI_MODELS,
  ANTHROPIC_MODELS,
  type OpenAIChatModel,
  type AnthropicChatModel
} from '@simonorzel26/ai-models';

// Quick popular models dropdown
const popularOptions = [
  { value: POPULAR_MODELS.GPT_4O, label: 'GPT-4o' },
  { value: POPULAR_MODELS.CLAUDE_3_5_SONNET, label: 'Claude 3.5 Sonnet' },
  { value: POPULAR_MODELS.GEMINI_1_5_PRO, label: 'Gemini 1.5 Pro' },
];

// Provider-specific sections
const openaiOptions = OPENAI_MODELS.chat.map(model => ({
  value: model,
  label: model.toUpperCase()
}));
```

#### Type-Safe Model Configuration
```typescript
import {
  getModelInfo,
  type ChatModel,
  type EmbeddingModel
} from '@simonorzel26/ai-models';

interface AIConfig {
  chatModel: ChatModel;
  embeddingModel: EmbeddingModel;
  temperature: number;
}

const config: AIConfig = {
  chatModel: 'gpt-4o',
  embeddingModel: 'text-embedding-3-large',
  temperature: 0.7
};

// Validate configuration
const chatInfo = getModelInfo(config.chatModel);
console.log(`Using ${chatInfo?.provider} for chat`);
```

#### Advanced Model Discovery
```typescript
import {
  findModels,
  getModelsByProviders,
  getModelCount,
  type FilterOptions
} from '@simonorzel26/ai-models';

// Find all multimodal models
const multimodalModels = findModels({
  provider: 'openai',
  category: 'chat'
}).filter(m => m.model.includes('vision') || m.model.includes('4o'));

// Get models from multiple providers
const aiProviders = ['openai', 'anthropic', 'google'];
const allChatModels = getModelsByProviders(aiProviders)
  .filter(m => m.category === 'chat');

// Statistics
console.log(`Total models: ${getModelCount()}`);
console.log(`OpenAI models: ${getModelCount({ provider: 'openai' })}`);
console.log(`Chat models: ${getModelCount({ category: 'chat' })}`);
```

### 🔄 Legacy Support (Still Works)
```typescript
import { ALL_MODELS, AI_SDK_MODELS } from '@simonorzel26/ai-models';

// Original flat array approach
const allModels = ALL_MODELS;

// Original structured approach
const openaiChatModels = AI_SDK_MODELS.openai.chat.OpenaiOpenAIChatModelId;
```

## The Problem

The Vercel AI SDK is fantastic, but its model types are only available as union types exported from their individual provider packages (e.g., `@ai-sdk/openai`, `@ai-sdk/anthropic`). If you want types for all models, you'd need to install dozens of packages, leading to bloat.

## The Solution

This package does the heavy lifting for you. It's a types-only library that:

- Extracts model information from all `@ai-sdk` providers.
- Exports them as TypeScript types, structured objects, and flat arrays.
- Automatically updates daily via a GitHub Action, so you always have the latest models.

With `@simonorzel26/ai-models`, you get comprehensive, up-to-date model types with zero runtime dependencies, removing explicit definition bloat from your app.

## Installation

```bash
npm install @simonorzel26/ai-models
```

## Statistics

For detailed statistics about models, providers, and categories, see [STATS.md](./STATS.md).

## Looking for a UI Component?

Check out [`@simonorzel26/shadcn-aisdk-model-select`](https://github.com/simonorzel/shadcn-aisdk-model-select) for a Next.js + shadcn/ui "Model Select" component that uses this package.

## License

MIT