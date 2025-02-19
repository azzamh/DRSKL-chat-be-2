import { NewMessage } from "@db/schema/chat/messages";
import * as schema from '@db/schema/chat/messages';
import { db } from "@src/db";
import { eq , sql} from "drizzle-orm";

export const getMessagesByConversationId = async (conversationId: number) => {
      const result = await db.execute(sql `
        select 
            m.id as id, 
            u.id as user_id, 
            u.username, 
            u.full_name, 
            m.delivered_at, 
            m.content,
            m.conversation_id
        from messages as m
        left join users as u on u.id = m.sender_id
        where m.conversation_id = ${conversationId}  
      ` );
      // console.log('getMessagesByConversationId', result.rows)
  return result.rows;
}

export const getMessageById = async (messageId: number) => {
  // const result = await db
  //     .select()
  //     .from(schema.messages)
  //     .where(
  //         eq(schema.messages.id, messageId)
  //     )


      const result = await db.execute(sql `
        select 
            m.id as id, 
            u.id as user_id, 
            u.username, 
            u.full_name, 
            m.delivered_at, 
            m.content,
            m.conversation_id
        from messages as m
        left join users as u on u.id = m.sender_id 
        where m.id = ${messageId}
      ` );
      // console.log('getMessageById', result.rows)
  return result.rows[0];
}

