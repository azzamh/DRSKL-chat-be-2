import { conversations, usersConversations } from '@db/schema';
import { Conversations, NewConversations } from '@db/schema';
import { db } from "@src/db";
import { eq } from "drizzle-orm";

export const createNewConversation = async (data: NewConversations, participantIds: string[]): Promise<Conversations> => {
    try {
        return await db.transaction(async (tx) => {
            // data.id = undefined;
            console.log("createNewConversation data", data);
            const [conversation] = await tx
                .insert(conversations)
                .values(data)
                .returning({
                    id: conversations.id,
                    name: conversations.name,
                    slug: conversations.slug,
                    is_deleted: conversations.is_deleted,
                    created_at: conversations.created_at
                });

            if (!conversation) {
                throw new Error('Failed to create conversation');
            }

            await tx
                .insert(usersConversations)
                .values(
                    participantIds.map(userId => ({
                        user_id: userId,
                        conversation_id: conversation.id,
                        created_at: new Date(),
                        updated_at: new Date()
                    }))
                );

            return conversation;
        });
    } catch (error: any) {
        console.error("createNewConversation error:", error?.message);
        throw error;
    }
}

export const addUsersToConversation = async (conversationSlug: string, userIds: string[]): Promise<string[]> => {
    try {
        return await db.transaction(async (tx) => {
            const [conversation] = await tx
                .select({ id: conversations.id })
                .from(conversations)
                .where(eq(conversations.slug, conversationSlug));

            if (!conversation) {
                throw new Error(`Conversation with slug ${conversationSlug} not found`);
            }

            await tx
                .insert(usersConversations)
                .values(
                    userIds.map(userId => ({
                        user_id: userId,
                        conversation_id: conversation.id,
                        created_at: new Date(),
                        updated_at: new Date()
                    }))
                )
                .onConflictDoNothing();

            return userIds;
        });
    } catch (error: any) {
        console.error("addUsersToConversation error:", error?.message);
        throw error;
    }
}

