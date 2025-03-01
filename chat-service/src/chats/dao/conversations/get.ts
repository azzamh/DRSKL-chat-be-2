import { db } from "@src/db";
import { conversations, messages, users, usersConversations } from "@db/schema";
import { eq, desc, max, count, and } from "drizzle-orm";
import { Conversations } from "@db/schema/chat/conversations";

export const getConversationById = async (conversationId: string): Promise<Conversations> => {
    try {
        const result = await db
            .select({
                id: conversations.id,
                name: conversations.name,
                slug: conversations.slug,
                is_deleted: conversations.is_deleted,
                created_at: conversations.created_at
            })
            .from(conversations)
            .where(
                and(
                    eq(conversations.id, conversationId),
                    eq(conversations.is_deleted, false)
                )
            );

        return result[0];
    } catch (error) {
        console.error("getConversationById error", error);
        throw error;
    }
}

export const getConversationIdBySlug = async (slug: string): Promise<string> => {
    try {
        const result = await db
            .select({
                id: conversations.id
            })
            .from(conversations)
            .where(
                eq(conversations.slug, slug)
            )
            .limit(1);

        return result[0].id;
    } catch (error) {
        console.error("getConversationIdBySlug error", error);
        throw error;
    }
}

export const getConversationsByUsernameCount = async (username: string): Promise<number> => {
    try {
        const result = await db
            .select({
                id: conversations.id
            })
            .from(conversations)
            .innerJoin(
                usersConversations,
                eq(conversations.id, usersConversations.conversation_id)
            )
            .innerJoin(
                users,
                eq(usersConversations.user_id, users.id)
            )
            .where(
                and(
                    eq(users.username, username),
                    eq(conversations.is_deleted, false)
                )
            );

        return result.length;
    }
    catch (error) {
        console.error("getConversationsByUsernameCount error", error);
        throw error;
    }
}

export const getConversationsByUsername = async (username: string, limit: number = 20, offset: number = 0): Promise<Conversations[]> => {
    try {
        const result = await db
            .select({
                id: conversations.id,
                name: conversations.name,
                slug: conversations.slug,
                is_deleted: conversations.is_deleted,
                created_at: conversations.created_at,
                message_count: count(messages.id),
                latest_message_id: max(messages.id)
            })
            .from(conversations)
            .innerJoin(
                usersConversations,
                eq(conversations.id, usersConversations.conversation_id)
            )
            .innerJoin(
                users,
                eq(usersConversations.user_id, users.id)
            )
            .leftJoin(
                messages,
                eq(conversations.id, messages.conversation_id)
            )
            .where(
                and(
                    eq(users.username, username),
                    eq(conversations.is_deleted, false)
                )
            )
            .groupBy(conversations.id)
            .orderBy(desc(max(messages.id)), desc(conversations.created_at))
            .limit(limit)
            .offset(offset);

        return result;
    } catch (error) {
        console.error("getConversationsByUsername error", error);
        throw error;
    }
}
