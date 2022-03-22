import { NextFunction, Request, Response } from "express";
import { CreateUserDto } from "@dtos/users.dto";
import { User } from "@interfaces/users.interface";
import userService from "@services/users.service";
import HttpException from "@exceptions/HttpException";
import { RequestWithUser } from "@interfaces/auth.interface";

import Helper from "@/utils/helper";
import Mongoose from "mongoose";
import moment from "moment";
import config from "config";
import MSG from "@utils/locale.en.json";

class UsersController {
	public userService = new userService();


	public getUsers = async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		try {
			const findAllUsersData: User[] = await this.userService.findAllUser(
				{
					role: "user",
					_id: {
						$ne: req.user._id,
					},
				}
			);
            for (let user of findAllUsersData) {
				user.isFavourite = false;
				if (req.user.favourites.find((f) => f == user._id.toString()))
					user.isFavourite = true;
			}

			res.status(200).json({
				data: { users: findAllUsersData },
				message: MSG.FETCH_SUCCESS,
			});
		} catch (error) {
			next(error);
		}
	};

	

	public updateUser = async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		try {
			const userId: string = req.params._id;
			if (req.user._id.toString() !== userId)
				throw new HttpException(401, MSG.UNAUTHORIZED);

			const userData: CreateUserDto = req.body;
			const updateUserData: User = await this.userService.updateUser(
				userId,
				userData
			);
			res.status(200).json({
				data: { user: await Helper.userObj(updateUserData) },
				message: MSG.UPDATE_SUCCESS,
			});
		} catch (error) {
			next(error);
		}
	};


}

export default UsersController;
