# AI Cost Optimization Guide

## Current Configuration

The AI Invoice Generator is configured to use the most cost-effective model available:

- **Model**: `gpt-3.5-turbo-1106` (latest and most cost-effective)
- **Max Tokens**: 1500 (reduced for cost savings)
- **Temperature**: 0.3 (lower for more consistent responses)

## Cost Comparison

| Model                | Input Cost         | Output Cost       | Best For                |
| -------------------- | ------------------ | ----------------- | ----------------------- |
| `gpt-3.5-turbo-1106` | $0.001/1K tokens   | $0.002/1K tokens  | **Most cost-effective** |
| `gpt-3.5-turbo`      | $0.0015/1K tokens  | $0.002/1K tokens  | Standard option         |
| `gpt-4o-mini`        | $0.00015/1K tokens | $0.0006/1K tokens | **Cheapest GPT-4**      |
| `gpt-4o`             | $0.005/1K tokens   | $0.015/1K tokens  | Most capable            |

## Switching Models

You can easily switch models by setting an environment variable:

```bash
# Use the cheapest GPT-4 model
VITE_OPENAI_MODEL=gpt-4o-mini

# Use standard GPT-3.5 turbo
VITE_OPENAI_MODEL=gpt-3.5-turbo

# Use the most capable model
VITE_OPENAI_MODEL=gpt-4o
```

## Cost Optimization Tips

### 1. Current Optimizations

- ✅ Using `gpt-3.5-turbo-1106` (cheapest 3.5 model)
- ✅ Reduced max tokens to 1500
- ✅ Lower temperature (0.3) for consistency
- ✅ Concise prompts to minimize token usage

### 2. Additional Optimizations

- **Prompt Efficiency**: Prompts are designed to be concise but effective
- **Response Parsing**: JSON responses are parsed efficiently
- **Error Handling**: Minimal retry logic to avoid extra costs

### 3. Usage Monitoring

- Monitor your OpenAI usage dashboard
- Set up billing alerts
- Consider implementing usage limits

## Recommended Model Selection

### For Development/Testing

```bash
VITE_OPENAI_MODEL=gpt-3.5-turbo-1106  # Cheapest option
```

### For Production (if you need better quality)

```bash
VITE_OPENAI_MODEL=gpt-4o-mini  # Cheapest GPT-4 model
```

### For High-Quality Requirements

```bash
VITE_OPENAI_MODEL=gpt-4o  # Most capable but expensive
```

## Estimated Costs

For a typical invoice generation:

- **Input tokens**: ~500-800 tokens
- **Output tokens**: ~300-500 tokens
- **Total cost per generation**: ~$0.001-0.003

### Monthly Usage Estimates

- **100 invoices/month**: ~$0.10-0.30
- **1000 invoices/month**: ~$1.00-3.00
- **10000 invoices/month**: ~$10.00-30.00

## Implementation Notes

The model selection is implemented in `src/services/ai.service.ts`:

```typescript
private static readonly MODEL = import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo-1106";
```

This allows for easy model switching without code changes.
