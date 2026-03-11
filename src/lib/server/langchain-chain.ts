import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import {
	ConversationBufferMemory,
	ConversationSummaryMemory,
	BufferWindowMemory
} from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';
import type { BaseChatMemory } from 'langchain/memory';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { env } from '$env/dynamic/private';

// Initialize the Google Generative AI model
const model = new ChatGoogleGenerativeAI({
	apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
	modelName: 'gemini-2.5-flash',
	temperature: 0.7,
	maxOutputTokens: 2048,
	streaming: true
});

// System prompt for the AI agent
const systemPrompt = `You are Nexus AI Agent — the intelligent assistant built into NexusID, an enterprise identity and access management platform.

Your role:
- Help users with identity management, security best practices, account administration, and general productivity tasks.
- Provide clear, structured, and actionable answers.
- Use markdown formatting liberally: headings, bold, bullet lists, numbered lists, code blocks, and tables when they improve clarity.
- Be concise but thorough. Prefer bullet points over walls of text.
- When giving code examples, always specify the language in fenced code blocks.
- If the user asks something outside your knowledge, say so honestly.

Tone: Professional, helpful, and slightly technical. You are an enterprise-grade assistant.`;

/**
 * Create a conversation chain with memory management
 * @param conversationHistory Array of previous messages
 * @param memoryType Type of memory to use: 'buffer', 'window', or 'summary'
 * @returns ConversationChain instance with configured memory
 */
export function createConversationChain(
	conversationHistory: Array<{ role: string; content: string }> = [],
	memoryType: 'buffer' | 'window' | 'summary' = 'buffer'
): ConversationChain {
	let memory: BaseChatMemory;

	// Convert history to Langchain message format
	const messageHistory = conversationHistory.flatMap((msg) => {
		if (msg.role === 'user') {
			return [new HumanMessage(msg.content)];
		} else {
			return [new AIMessage(msg.content)];
		}
	});

	switch (memoryType) {
		case 'window':
			// Keep only the last N interactions (more efficient for long conversations)
			memory = new BufferWindowMemory({
				k: 10, // Keep last 10 messages
				aiPrefix: 'AI',
				humanPrefix: 'Human',
				returnMessages: true,
				inputKey: 'input',
				outputKey: 'output'
			});
			break;

		case 'summary':
			// Summarize conversation over time (useful for very long conversations)
			memory = new ConversationSummaryMemory({
				llm: model,
				aiPrefix: 'AI',
				humanPrefix: 'Human',
				inputKey: 'input',
				outputKey: 'output'
			});
			break;

		case 'buffer':
		default:
			// Keep full conversation history in memory
			memory = new ConversationBufferMemory({
				aiPrefix: 'AI',
				humanPrefix: 'Human',
				returnMessages: true,
				inputKey: 'input',
				outputKey: 'output'
			});
	}

	// Load messages into memory
	for (const msg of messageHistory) {
		if (msg._getType() === 'human') {
			memory.chatHistory.push(msg);
		} else {
			memory.chatHistory.push(msg);
		}
	}

	// Create and return the conversation chain
	const chain = new ConversationChain({
		llm: model,
		memory,
		inputKey: 'input',
		outputKey: 'output'
	});

	// Update the system message
	chain.prompt.template = `${systemPrompt}

{history}
Human: {input}
AI:`;

	return chain;
}

/**
 * Process a user message with Langchain and streaming
 */
export async function processMessageWithMemory(
	userMessage: string,
	conversationHistory: Array<{ role: string; content: string }> = []
): Promise<{ chain: ConversationChain; history: any }> {
	const chain = createConversationChain(conversationHistory, 'buffer');

	// Get the formatted chat history from memory for debugging/logging
	const history = await chain.memory.loadMemoryVariables({});

	return {
		chain,
		history
	};
}

Current conversation:
{history}