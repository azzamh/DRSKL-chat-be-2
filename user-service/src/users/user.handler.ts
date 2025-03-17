import { Request, Response } from "express";
import * as Service from "./services";

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    const response = await Service.loginService(username, password);
    res.status(response.status).json(response);
}

export const registerHandler = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password, full_name} = req.body;
    const response = await Service.registerService(username, password, full_name);
    res.status(response.status).json(response);
}

export const verifyTokenHandler = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;
    const response = await Service.verifyTokenService(token);
    res.status(response.status).json(response);
}

export const verifyAdminTokenHandler = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;
    const response = await Service.verifyAdminTokenService(token);
    res.status(response.status).json(response);
}

export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
    const userId = req.body.user.id;
    console.log(">>>>>getUserInfo req ",userId);
    const response = await Service.getUserInfoService(userId);
    console.log(">>>>>getUserInfo resp ",response);
    res.status(response.status).json(response);
}


export const getUserInfoByUserName = async (req: Request, res: Response): Promise<void> => {
    console.log(req.params.username);
    const username = req.params.username
    const response = await Service.getUserByUsername(username);
    res.status(response.status).json(response);
}