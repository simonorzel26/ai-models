import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  target: 'es2022',
  outDir: 'dist',
  external: [
    // All @ai-sdk packages
    '@ai-sdk/amazon-bedrock',
    '@ai-sdk/anthropic',
    '@ai-sdk/assemblyai',
    '@ai-sdk/azure',
    '@ai-sdk/cerebras',
    '@ai-sdk/cohere',
    '@ai-sdk/deepgram',
    '@ai-sdk/deepinfra',
    '@ai-sdk/deepseek',
    '@ai-sdk/elevenlabs',
    '@ai-sdk/fireworks',
    '@ai-sdk/gladia',
    '@ai-sdk/google',
    '@ai-sdk/google-vertex',
    '@ai-sdk/groq',
    '@ai-sdk/hume',
    '@ai-sdk/lmnt',
    '@ai-sdk/mistral',
    '@ai-sdk/openai',
    '@ai-sdk/perplexity',
    '@ai-sdk/revai',
    '@ai-sdk/togetherai',
    '@ai-sdk/xai',
    // Community providers
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
  ],
  banner: {
    js: `/**
 * @simonorzel/ai-models
 * Generated AI model types from @ai-sdk providers
 *
 * This file is auto-generated - do not edit manually
 */`
  }
});