# @simonorzel26/ai-models

[![npm version](https://badge.fury.io/js/@simonorzel26%2Fai-models.svg)](https://badge.fury.io/js/@simonorzel26%2Fai-models)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Converts Vercel AI SDK's TypeScript model types into usable JavaScript objects and arrays.

## Usage

This package exports three main things:

1.  **TypeScript Types** for individual model IDs:
    ```typescript
    import { OpenaiOpenAIChatModelId } from '@simonorzel26/ai-models';
    const model: OpenaiOpenAIChatModelId = 'gpt-4o';
    ```

2.  **A Flat Array** of all models (`ALL_MODELS`):
    ```typescript
    import { ALL_MODELS } from '@simonorzel26/ai-models';
    const firstModel = ALL_MODELS[0];
    // Result: { provider: 'openai', model: 'gpt-4o', category: 'chat', value: 'openai:gpt-4o' }
    ```

3.  **A Structured Object** of all models (`AI_SDK_MODELS`):
    ```typescript
    import { AI_SDK_MODELS } from '@simonorzel26/ai-models';
    const openaiChatModels = AI_SDK_MODELS.openai.chat.OpenaiOpenAIChatModelId;
    // Result: ['o1', 'gpt-4o', 'gpt-4o-mini', ...]
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

## Looking for a UI Component?

Check out [`@simonorzel26/shadcn-aisdk-model-select`](https://github.com/simonorzel/shadcn-aisdk-model-select) for a Next.js + shadcn/ui "Model Select" component that uses this package.

## License

MIT