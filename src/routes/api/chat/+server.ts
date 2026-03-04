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
		system: 'You are a helpful AI assistant for NexusID. Be concise and helpful.',
		messages: await convertToModelMessages(messages)
	});

	return result.toUIMessageStreamResponse();
};
