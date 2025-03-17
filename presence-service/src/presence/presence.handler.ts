import e, { Request, Response } from "express";
import * as Service from "./services";


export const setOnlineStatus = async (req: Request, res: Response): Promise<void> => {
    const { is_online } = req.body;
    const username = req.body.user.username as string;
    const userId = req.body.user.id as string;

    const response = await Service.setOnlineStatus(userId, username, is_online);
    res.status(response.status).json(response);
}


export const getOnlineStatus = async (req: Request, res: Response): Promise<void> => { 
    const { username } = req.params;
    const response = await Service.getOnlineStatus(username);
    res.status(response.status).json(response);
}

export const getTypingStatus = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    const response = await Service.getTypingStatus(username);
    res.status(response.status).json(response);
}

export const setTypingStatus = async (req: Request, res: Response): Promise<void> => {
    const { is_typing } = req.body;
    const username = req.body.user.username as string;
    const userId = req.body.user.id as string;
    const response = await Service.setTypingStatus(userId, username, is_typing);
    res.status(response.status).json(response);
}

export const getLastSeen = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    const response = await Service.getLastSeen(username);
    res.status(response.status).json(response);
}
