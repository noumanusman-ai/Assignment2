import type { RequestHandler } from './$types';
import { createConversation, getUserConversations } from '$lib/server/chat-service';

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		// Get existing conversations for user
		const conversations = await getUserConversations(locals.user.id);

		// If conversation exists, return the latest one
		if (conversations.length > 0) {
			const latest = conversations[0];
			return new Response(JSON.stringify({ id: latest.id, isNew: false }), {
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Otherwise create a new conversation
		const newConversation = await createConversation(locals.user.id, 'New Chat');

		return new Response(JSON.stringify({ id: newConversation.id, isNew: true }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error getting/creating conversation:', error);
		return new Response(JSON.stringify({ error: 'Failed to process conversation' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
