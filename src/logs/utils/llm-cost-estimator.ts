type ModelPricing = {
  [model: string]: {
    input: number; // $ per 1K input tokens
    output: number | null; // $ per 1K output tokens | Output can be null for embedding models
  };
};

const MODEL_PRICING: ModelPricing = {
  'gpt-4': { input: 0.0015, output: 0.002 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'gpt-3.5-turbo-0125': { input: 0.0005, output: 0.0015 },
  'text-embedding-3-small': { input: 0.0001, output: null },
  // add other models here…
};

export function estimateLLMCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
): void {
  const pricing = MODEL_PRICING[model];
  if (!pricing) {
    console.error(`Model ${model} not found in pricing data`);
    return;
  }

  const inputCost = (inputTokens / 1000) * pricing.input;
  const outputCost = pricing.output
    ? (outputTokens / 1000) * pricing.output
    : 0;

  console.info(
    `[✅ INFO]:Estimated cost for this request: $${inputCost + outputCost}`,
  );
}
