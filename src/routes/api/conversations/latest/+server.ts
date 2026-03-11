import type { RequestHandler } from './$types';
import { getUserConversations } from '$lib/server/chat-service';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	try {
		const conversations = await getUserConversations(locals.user.id);
		const latest = conversations[0]; // Most recent conversation (sorted by updatedAt desc)

		if (latest) {
			return new Response(JSON.stringify({ id: latest.id, ...latest }), {
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return new Response(JSON.stringify({ error: 'No conversations found' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error fetching latest conversation:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch conversation' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
