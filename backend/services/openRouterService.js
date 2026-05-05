import axios from "axios";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const FALLBACK_MODELS = (process.env.OPENROUTER_MODELS
  ? process.env.OPENROUTER_MODELS.split(",")
  : [
      "google/gemini-2.0-flash-exp:free",
      "meta-llama/llama-3.3-70b-instruct:free",
      "mistralai/mistral-7b-instruct:free",
      "qwen/qwen3-coder:free",
    ]
)
  .map((m) => m.trim())
  .filter(Boolean);
const MAX_RETRIES_PER_MODEL = Number(process.env.OPENROUTER_MAX_RETRIES ?? 1);
const REQUEST_TIMEOUT_MS = Number(process.env.OPENROUTER_TIMEOUT_MS ?? 15000);
const MAX_OUTPUT_TOKENS = Number(process.env.OPENROUTER_MAX_TOKENS ?? 1200);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseContent(choice) {
  if (!choice) return "";
  const content = choice.message?.content;
  if (typeof content === "string") return content;
  if (content && typeof content === "object" && !Array.isArray(content)) {
    return JSON.stringify(content);
  }
  if (Array.isArray(content)) {
    const joined = content
      .map((c) => {
        if (typeof c === "string") return c;
        if (typeof c?.text === "string") return c.text;
        if (c && typeof c === "object" && typeof c?.content === "string") return c.content;
        if (c && typeof c === "object") return JSON.stringify(c);
        return "";
      })
      .filter(Boolean)
      .join("\n");
    if (joined) return joined;
  }
  if (typeof choice.text === "string") return choice.text;
  if (choice.text && typeof choice.text === "object") return JSON.stringify(choice.text);
  return "";
}

function hasUsableOutput(response, text) {
  const choice = response?.data?.choices?.[0];
  const content = choice?.message?.content;
  if (typeof text === "string" && text.trim().length > 0) return true;
  if (content && typeof content === "object") return true;
  return false;
}

function buildErrorSummary(errors) {
  return errors.map((e) => ({
    model: e.model,
    status: e.status || null,
    message: e.message
  }));
}

export async function callOpenRouterWithFallback({
  messages,
  temperature = 0.6,
  stream = false,
  extraPayload = {}
}) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }

  const modelErrors = [];

  for (const model of FALLBACK_MODELS) {
    for (let attempt = 0; attempt <= MAX_RETRIES_PER_MODEL; attempt += 1) {
      try {
        const response = await axios.post(
          OPENROUTER_URL,
          {
            model,
            messages,
            temperature,
            stream,
            max_tokens: MAX_OUTPUT_TOKENS,
            ...extraPayload
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json"
            },
            timeout: REQUEST_TIMEOUT_MS
          }
        );

        const text = parseContent(response.data?.choices?.[0] || null);
        const finishReason = response?.data?.choices?.[0]?.finish_reason
          || response?.data?.choices?.[0]?.native_finish_reason
          || null;

        // If the model was cut off mid-output, treat it as a failure so we
        // can try the next fallback model instead of returning broken JSON.
        if (finishReason === 'length') {
          const err = new Error(`Model output truncated (finish_reason=length) — JSON will be incomplete`);
          err.status = 502;
          throw err;
        }

        if (!hasUsableOutput(response, text)) {
          const err = new Error(`Empty/invalid model output (finish_reason=${finishReason || 'unknown'})`);
          err.status = 502;
          throw err;
        }

        console.log(`[OpenRouter] success model=${model} attempt=${attempt + 1}`);
        return {
          model,
          response,
          text
        };
      } catch (err) {
        const status = err.response?.status;
        const message =
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          err.message ||
          "OpenRouter request failed";

        modelErrors.push({ model, status, message, attempt: attempt + 1 });

        const isRateLimit = status === 429;
        const isLastAttempt = attempt >= MAX_RETRIES_PER_MODEL;
        const isRetriable = !status || status >= 500;

        if (isRateLimit) {
          console.warn(`[OpenRouter] rate-limited model=${model}, trying next fallback model`);
          break;
        }

        if (!isLastAttempt && isRetriable) {
          const backoffMs = 600 * (attempt + 1);
          await sleep(backoffMs);
          continue;
        }

        break;
      }
    }
  }

  const error = new Error("All OpenRouter fallback models failed");
  error.statusCode = 502;
  error.details = buildErrorSummary(modelErrors);
  throw error;
}

