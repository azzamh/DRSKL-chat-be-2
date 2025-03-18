import { db } from "@src/db";
import { rooms, messages, users, usersRooms } from "@db/schema";
import { eq, desc, max, count, and } from "drizzle-orm";
import { Rooms } from "@db/schema/chat/rooms";

export const getConversationById = async (conversationId: string): Promise<Rooms> => {
    try {
        const result = await db
            .select({
                id: rooms.id,
                name: rooms.name,
                slug: rooms.slug,
                is_deleted: rooms.is_deleted,
                created_at: rooms.created_at,
                last_seq_id: rooms.last_seq_id
            })
            .from(rooms)
            .where(
                and(
                    eq(rooms.id, conversationId),
                    eq(rooms.is_deleted, false)
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
                id: rooms.id
            })
            .from(rooms)
            .where(
                eq(rooms.slug, slug)
            )
            .limit(1);
        if (result.length === 0) {
            throw new Error("Conversation not found");
        }
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
                id: rooms.id
            })
            .from(rooms)
            .innerJoin(
                usersRooms,
                eq(rooms.id, usersRooms.room_id)
            )
            .innerJoin(
                users,
                eq(usersRooms.user_id, users.id)
            )
            .where(
                and(
                    eq(users.username, username),
                    eq(rooms.is_deleted, false)
                )
            );

        return result.length;
    }
    catch (error) {
        console.error("getConversationsByUsernameCount error", error);
        throw error;
    }
}

export const getConversationsByUsername = async (username: string, limit: number = 20, offset: number = 0): Promise<Rooms[]> => {
    try {
        const result = await db
            .select({
                id: rooms.id,
                name: rooms.name,
                slug: rooms.slug,
                is_deleted: rooms.is_deleted,
                created_at: rooms.created_at,
                message_count: count(messages.id),
                latest_message_id: max(messages.id),
                last_seq_id: rooms.last_seq_id
            })
            .from(rooms)
            .innerJoin(
                usersRooms,
                eq(rooms.id, usersRooms.room_id)
            )
            .innerJoin(
                users,
                eq(usersRooms.user_id, users.id)
            )
            .leftJoin(
                messages,
                eq(rooms.id, messages.room_id)
            )
            .where(
                and(
                    eq(users.username, username),
                    eq(rooms.is_deleted, false)
                )
            )
            .groupBy(rooms.id)
            .orderBy(desc(max(messages.id)), desc(rooms.created_at))
            .limit(limit)
            .offset(offset);

        return result;
    } catch (error) {
        console.error("getConversationsByUsername error", error);
        throw error;
    }
}

export const getRoomParticipants = async (conversationId: string) => {
    try {
        const result = await db
            .select({
                id: usersRooms.user_id,
                username: users.username,
                full_name: users.full_name
            })
            .from(usersRooms)
            .innerJoin(
                users,
                eq(usersRooms.user_id, users.id)
            )
            .where(eq(usersRooms.room_id, conversationId));
        return result;
    } catch (error) {
        console.error("getRoomParticipants error", error);
        throw error;
    }
}
