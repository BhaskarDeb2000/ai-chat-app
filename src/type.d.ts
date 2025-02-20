// Define the message structure
export interface Message {
	role: "user" | "assistant" | "error" | "thinking";
	content: string;
	thinking?: string[];
	isStreaming?: boolean;
	showThinking?: boolean;
}

// Define model configurations
export interface ModelConfig {
	name: string;
	id: string;
}

// Define possible API error responses
export interface APIErrorResponse {
	error?: {
		message?: string;
		type?: string;
	};
	message?: string;
}

