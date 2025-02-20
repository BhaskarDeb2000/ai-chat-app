import { ModelConfig } from "./type";
// Available AI models
export const models: ModelConfig[] = [
	{ name: "Normal Mode", id: "Pro/deepseek-ai/DeepSeek-V3" },
	{ name: "Deep Thinking", id: "Pro/deepseek-ai/DeepSeek-R1" },
];

// Default API credentials
export const apiKey = import.meta.env.VITE_DEFAULT_API_KEY;
export const apiUrl = import.meta.env.VITE_DEFAULT_API_URL;

export const defaultModel = models[0];