import { db } from "@src/db";
import { conversations } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const deleteConversation = async (slug: string): Promise<boolean> => {
  try {
    const [result] = await db
      .update(conversations)
      .set({ is_deleted: true })
      .where(
        and(
          eq(conversations.slug, slug),
          eq(conversations.is_deleted, false)
        )
      )
      .returning();

    if (!result) {
      throw new Error(`Conversation with id ${slug} not found or already deleted`);
    }

    return true;
  } catch (error) {
    console.error("deleteConversation error", error);
    throw error;
  }
}
