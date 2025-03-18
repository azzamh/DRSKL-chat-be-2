import { db } from "@src/db";
import { Rooms } from "@db/schema";
import { sql } from "drizzle-orm";

interface UpdateConversationParams {
    id: number;
    name?: string;
}

export const updateConversation = async (params: UpdateConversationParams): Promise<Rooms> => {
    try {
        const setClause = [];
        if (params.name !== undefined) {
            setClause.push(`name = ${params.name}`);
        }

        const query = sql`
            UPDATE rooms
            SET ${sql.raw(setClause.join(', '))}
            WHERE id = ${params.id}
            AND is_deleted = false
            RETURNING id, name, is_group
        `;

        const result = await db.execute(query);
        return result.rows[0] as Rooms;
    } catch (error) {
        console.error("updateConversation error", error);
        throw error;
    }
}

export const incrementRoomSeqId = async (roomId: string) => {
    try {
        const result = await db.execute(sql`
            UPDATE rooms
            SET last_seq_id = last_seq_id + 1       
            WHERE id = ${roomId}
            RETURNING last_seq_id
        `);
        return result.rows[0].last_seq_id as number;
    } catch (error) {
        console.error("incrementRoomSeqId error", error);
        throw error;
    }
}
