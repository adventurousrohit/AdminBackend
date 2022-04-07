import { Request } from "express";
import { User } from "@interfaces/users.interface";
// import {RequestHandler} from "express"

export interface DataStoredInToken {
	_id: string;
}

export interface TokenData {
	token: string;
	expiresIn: number;
}

export interface RequestWithUser extends Request {
	user: User;
	flash: any;
	fileName: string;}

// export interface querytostring extends RequestHandler{
// 	type Params = {};
// type ResBody = {};
// type ReqBody = {};
// type ReqQuery = {
//     query: string;
// }

// }