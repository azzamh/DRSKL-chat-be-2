import * as daoMessages from "../dao/mesages";
import { InternalServerErrorResponse, OkResponse } from "@src/shared/commons/patterns";

export const getMessageById = async (conversationId: number) => {
    try{
        const res = await daoMessages.getMessageById(conversationId);
        return new OkResponse(res).generate()
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}