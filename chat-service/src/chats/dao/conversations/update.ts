import { db } from "@src/db";
import { Conversations } from "@db/schema";
import { sql } from "drizzle-orm";

interface UpdateConversationParams {
    id: number;
    name?: string;
}

export const updateConversation = async (params: UpdateConversationParams): Promise<Conversations> => {
    try {
        const setClause = [];
        if (params.name !== undefined) {
            setClause.push(`name = ${params.name}`);
        }

        const query = sql`
            UPDATE conversations
            SET ${sql.raw(setClause.join(', '))}
            WHERE id = ${params.id}
            AND is_deleted = false
            RETURNING id, name, is_group
        `;

        const result = await db.execute(query);
        return result.rows[0] as Conversations;
    } catch (error) {
        console.error("updateConversation error", error);
        throw error;
    }
}
