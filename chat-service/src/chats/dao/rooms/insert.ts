import { rooms, usersRooms } from '@db/schema';
import { Rooms, NewRooms } from '@db/schema';
import { db } from "@src/db";
import { eq } from "drizzle-orm";

export const createNewConversation = async (data: NewRooms, participantIds: string[]): Promise<Rooms> => {
    try {
        return await db.transaction(async (tx) => {
            // data.id = undefined;
            console.log("createNewConversation data", data);
            const [conversation] = await tx
                .insert(rooms)
                .values(data)
                .returning({
                    id: rooms.id,
                    name: rooms.name,
                    slug: rooms.slug,
                    is_deleted: rooms.is_deleted,
                    created_at: rooms.created_at
                });

            if (!conversation) {
                throw new Error('Failed to create conversation');
            }

            await tx
                .insert(usersRooms)
                .values(
                    participantIds.map(userId => ({
                        user_id: userId,
                        room_id: conversation.id,
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
                .select({ id: rooms.id })
                .from(rooms)
                .where(eq(rooms.slug, conversationSlug));

            if (!conversation) {
                throw new Error(`Conversation with slug ${conversationSlug} not found`);
            }

            await tx
                .insert(usersRooms)
                .values(
                    userIds.map(userId => ({
                        user_id: userId,
                        room_id: conversation.id,
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

