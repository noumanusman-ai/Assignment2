import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserConversations, createConversation } from '$lib/server/chat-service';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const userId = locals.user.id;

	// Get all conversations for the user
	const conversations = await getUserConversations(userId);

	// Get conversation ID from URL or create a new one
	const conversationId = url.searchParams.get('id');

	// If no conversation ID in URL and no existing conversations, create a new one
	let activeConversation = null;
	if (conversationId) {
		// Find the conversation by ID
		activeConversation = conversations.find((c) => c.id === conversationId);
	} else if (conversations.length === 0) {
		// Create a new conversation if none exists
		activeConversation = await createConversation(userId, 'New Chat');
	} else {
		// Use the most recent conversation
		activeConversation = conversations[0];
	}

	return {
		user: locals.user,
		conversations,
		activeConversation
	};
};
