import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

const google = createGoogleGenerativeAI({
	apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY
});

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response('Unauthorized', { status: 401 });
	}

	const { messages } = await request.json();

	const result = streamText({
		model: google('gemini-2.5-flash'),
		system: `You are Nexus AI Agent — the intelligent assistant built into NexusID, an enterprise identity and access management platform.

Your role:
- Help users with identity management, security best practices, account administration, and general productivity tasks.
- Provide clear, structured, and actionable answers.
- Use markdown formatting liberally: headings, bold, bullet lists, numbered lists, code blocks, and tables when they improve clarity.
- Be concise but thorough. Prefer bullet points over walls of text.
- When giving code examples, always specify the language in fenced code blocks.
- If the user asks something outside your knowledge, say so honestly.

Tone: Professional, helpful, and slightly technical. You are an enterprise-grade assistant.`,
		messages: await convertToModelMessages(messages)
	});
	return result.toUIMessageStreamResponse();
};
