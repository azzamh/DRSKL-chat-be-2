import { Request, Response } from "express";
import * as Service from "./services";



export const startPrivateConversation = async (req: Request, res: Response): Promise<void> => {
    const { peer_username } = req.body;
    const user_id = req.body.user.id;
    const response = await Service.startPrivateConversation(user_id, peer_username);
    res.status(response.status).json(response);
}

export const getConversationsList = async (req: Request, res: Response): Promise<void> => {
    const user_id = req.body.user.id;
    const response = await Service.getConversationsByUserId(user_id);
    res.status(response.status).json(response);
}

export const getMessagesByConversation = async (req: Request, res: Response): Promise<void> => {
    const { conversation_id } = req.params;
    const response = await Service.getMessagesByConversation(conversation_id);
    res.status(response.status).json(response);
}

export const sendPrivateMessage = async (req: Request, res: Response): Promise<void> => {
    const { conversation_id, message } = req.body;
    const user_id = req.body.user.id;
    const response = await Service.sendPrivateMessage(user_id, conversation_id, message);
    res.status(response.status).json(response);
}
