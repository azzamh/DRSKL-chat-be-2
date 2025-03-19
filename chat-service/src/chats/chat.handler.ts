import e, { Request, Response } from "express";
import * as Service from "./services";

export const getRoomList = async (req: Request, res: Response): Promise<void> => {
    const username = req.body.user.username;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const response = await Service.getRoomsByUserName(username, page, limit);
    res.status(response.status).json(response);
}

export const getMessagesByConversation = async (req: Request, res: Response): Promise<void> => {
    const { room_id } = req.params;
    const response = await Service.getMessagesByConversation(room_id);
    res.status(response.status).json(response);
}

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    const { room_id, message, test_id } = req.body;

    const user_id = req.body.user.id;
    const response = await Service.sendMessage(user_id, room_id, message, test_id);
    res.status(response.status).json(response);
}

export const getMessageById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const response = await Service.getMessageById(id);
    res.status(response.status).json(response);
}

export const createRoom = async (req: Request, res: Response): Promise<void> => {
    const { name, room_id } = req.body;
    const username = req.body.user.username as string;

    const response = await Service.createRoom(room_id, name, username);
    res.status(response.status).json(response);
}

export const joinRoom = async (req: Request, res: Response): Promise<void> => {
    const { room_id } = req.params;
    const username = req.body.user.username;
    const response = await Service.joinRoom(room_id, username);
    res.status(response.status).json(response);
}

export const getRoomMessages = async (req: Request, res: Response): Promise<void> => {
    const { room_id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const response = await Service.getMessagesByConversationSlug(room_id, page, limit);
    res.status(response.status).json(response);
}

export const addOrUpdateUser = async (req: Request, res: Response): Promise<void> => {
    const { id, username, fullname } = req.body;
    const response = await Service.addOrUpdateUser(id, username, fullname);
    res.status(response.status).json(response);
}

export const getRoomParticipants = async (req: Request, res: Response): Promise<void> => {
    const { room_id } = req.params;
    const response = await Service.getRoomParticipants(room_id);
    res.status(response.status).json(response);
}

export const getRoomDetails = async (req: Request, res: Response): Promise<void> => {
    const { room_id } = req.params;
    const response = await Service.getRoomDetailBySlug(room_id);
    res.status(response.status).json(response);
}

