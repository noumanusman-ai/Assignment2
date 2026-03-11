import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import {
	createConversation,
	getConversationMessages,
	addMessage,
	updateConversation
} from '$lib/server/chat-service';

const google = createGoogleGenerativeAI({
	apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY
});

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response('Unauthorized', { status: 401 });
	}

	const { messages, conversationId } = await request.json();
	const userId = locals.user.id;

	console.log('=== Chat API Request ===');
	console.log('Chat request received:', { 
		messagesCount: messages.length, 
		conversationId,
		userId,
		hasMessages: messages.length > 0,
		lastMessage: messages[messages.length - 1]
	});

	try {
		let chatConversationId = conversationId;

		// Create conversation if it doesn't exist
		if (!chatConversationId) {
			const newConversation = await createConversation(userId, 'New Chat');
			chatConversationId = newConversation.id;
		}

		// Extract and store user message
		const userMessage = messages[messages.length - 1];
		let userMessageContent = '';

		if (userMessage?.role === 'user') {
			// Handle different message formats
			if (userMessage.content) {
				userMessageContent = userMessage.content;
			} else if (userMessage.text) {
				userMessageContent = userMessage.text;
			} else if (userMessage.parts && Array.isArray(userMessage.parts) && userMessage.parts.length > 0) {
				// Extract text from parts array (format from @ai-sdk/svelte)
				userMessageContent = userMessage.parts
					.map((part: any) => part.text || JSON.stringify(part))
					.join('');
			}

			console.log('Extracted user message:', { userMessageContent });

			if (userMessageContent) {
				await addMessage(chatConversationId, 'user', userMessageContent);
			}
		}

		// Retrieve full conversation history from database
		const dbMessages = await getConversationMessages(chatConversationId);

		console.log('Database messages retrieved:', {
			conversationId: chatConversationId,
			messageCount: dbMessages.length,
			messages: dbMessages.map((m) => ({
				role: m.role,
				contentLength: m.content.length,
				preview: m.content.substring(0, 50)
			}))
		});

		// Convert database messages to the format expected by streamText
		const messageHistory = dbMessages.map((msg) => ({
			role: msg.role as 'user' | 'assistant',
			content: msg.content
		}));

		console.log('Message history prepared for LLM:', {
			count: messageHistory.length,
			messages: messageHistory.map((m) => ({
				role: m.role,
				contentPreview: m.content.substring(0, 60)
			}))
		});

		// Build system prompt
		const systemPrompt = `You are Nexus AI Agent — the intelligent assistant built into NexusID, an enterprise identity and access management platform.

Your role:
- Help users with identity management, security best practices, account administration, and general productivity tasks.
- Provide clear, structured, and actionable answers.
- Use markdown formatting liberally: headings, bold, bullet lists, numbered lists, code blocks, and tables when they improve clarity.
- Be concise but thorough. Prefer bullet points over walls of text.
- When giving code examples, always specify the language in fenced code blocks.
- If the user asks something outside your knowledge, say so honestly.

Tone: Professional, helpful, and slightly technical. You are an enterprise-grade assistant.`;

		// Stream the response
		const result = streamText({
			model: google('gemini-2.5-flash'),
			system: systemPrompt,
			messages: messageHistory
		});

		// Get the streaming response
		const response = result.toUIMessageStreamResponse();

		// Add conversationId to the response headers so client can track it
		const responseWithConversationId = new Response(response.body, {
			...response,
			headers: {
				...response.headers,
				'X-Conversation-Id': chatConversationId
			}
		});

		// Store the assistant response asynchronously using the text promise
		result.text
			.then(async (fullAssistantContent) => {
				console.log('Full assistant response collected:', { length: fullAssistantContent.length });

				if (fullAssistantContent) {
					await addMessage(chatConversationId, 'assistant', fullAssistantContent);

					// Update conversation title on first exchange
					if (dbMessages.length === 0 && userMessageContent) {
						const title = userMessageContent.substring(0, 50);
						await updateConversation(chatConversationId, title);
					}
				}
			})
			.catch((error) => {
				console.error('Error storing assistant response:', error);
			});

		return responseWithConversationId;
	} catch (error) {
		console.error('Chat error:', error);
		return new Response(JSON.stringify({ error: 'Chat processing failed' }), { status: 500 });
	}
};
