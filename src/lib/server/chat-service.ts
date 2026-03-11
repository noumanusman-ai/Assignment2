import { db } from './db';
import { conversations, messages as messagesTable } from './db/schema';
import { eq, desc } from 'drizzle-orm';

export interface Message {
	id: string;
	conversationId: string;
	role: 'user' | 'assistant';
	content: string;
	createdAt: Date;
}

export interface Conversation {
	id: string;
	userId: string;
	title: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Create a new conversation
 */
export async function createConversation(
	userId: string,
	title: string = 'New Chat'
): Promise<Conversation> {
	const result = await db
		.insert(conversations)
		.values({
			userId,
			title
		})
		.returning();

	return result[0];
}

/**
 * Get conversation by ID
 */
export async function getConversation(conversationId: string): Promise<Conversation | null> {
	const result = await db
		.select()
		.from(conversations)
		.where(eq(conversations.id, conversationId))
		.limit(1);

	return result[0] || null;
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(userId: string): Promise<Conversation[]> {
	return await db
		.select()
		.from(conversations)
		.where(eq(conversations.userId, userId))
		.orderBy(desc(conversations.updatedAt));
}

/**
 * Get conversation messages
 */
export async function getConversationMessages(conversationId: string): Promise<Message[]> {
	return await db
		.select()
		.from(messagesTable)
		.where(eq(messagesTable.conversationId, conversationId))
		.orderBy(messagesTable.createdAt);
}

/**
 * Add a message to conversation
 */
export async function addMessage(
	conversationId: string,
	role: 'user' | 'assistant',
	content: string
): Promise<Message> {
	const result = await db
		.insert(messagesTable)
		.values({
			conversationId,
			role,
			content
		})
		.returning();

	return result[0];
}

/**
 * Update conversation title and timestamp
 */
export async function updateConversation(
	conversationId: string,
	title?: string
): Promise<Conversation | null> {
	const result = await db
		.update(conversations)
		.set({
			...(title && { title }),
			updatedAt: new Date()
		})
		.where(eq(conversations.id, conversationId))
		.returning();

	return result[0] || null;
}

/**
 * Delete conversation and all its messages
 */
export async function deleteConversation(conversationId: string): Promise<void> {
	// Delete messages first
	await db
		.delete(messagesTable)
		.where(eq(messagesTable.conversationId, conversationId));

	// Delete conversation
	await db.delete(conversations).where(eq(conversations.id, conversationId));
}
