import type { RequestHandler } from './$types';
import { getConversationMessages } from '$lib/server/chat-service';

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.user) {
		return new Response('Unauthorized', { status: 401 });
	}

	const conversationId = url.searchParams.get('conversationId');

	if (!conversationId) {
		return new Response(JSON.stringify({ messages: [] }), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const messages = await getConversationMessages(conversationId);

		return new Response(
			JSON.stringify({
				messages: messages.map((msg) => ({
					role: msg.role,
					content: msg.content
				}))
			}),
			{
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (error) {
		console.error('Error fetching messages:', error);
		return new Response(JSON.stringify({ messages: [] }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
