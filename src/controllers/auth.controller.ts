import { NextFunction, Request, Response } from "express";
import { CreateUserDto } from "@dtos/users.dto";
import HttpException from "@exceptions/HttpException";
import { RequestWithUser } from "@interfaces/auth.interface";
import { User } from "@interfaces/users.interface";
import AuthService from "@services/auth.service";
import OtpService from "@services/otps.service";
import UserService from "@services/users.service";
import { isEmpty } from "@utils/util";
import Helper from "@/utils/helper";
import MSG from "@utils/locale.en.json";

class AuthController {
	public authService = new AuthService();
	public otpService = new OtpService();
	public userService = new UserService();

	public signUp = async (req: Request, res: Response, next: NextFunction) => {
		try {
			
			const userData: CreateUserDto = req.body;
			const userRole  = userData.role[0].slug

			if (userRole!=='admin')
				throw new HttpException(
					400,
					MSG.ROLE_INVALID.replace("%role%",userData.role[0].slug)
				);

			// if (!["admin"].includes(userData.role))
			// 	throw new HttpException(
			// 		400,
			// 		MSG.ROLE_INVALID.replace("%role%", userData.role)
			// 	);


			const emailCount: number = await this.userService.getUserCount(
				"email",
				userData.email,
				null
			);
			if (emailCount > 0)
				throw new HttpException(
					409,
					MSG.EMAIL_IN_USE.replace("%email%", userData.email)
				);

			const mobileCount: number = await this.userService.getUserCount(
				"mobile",
				userData.mobile,
				null
			);
			if (mobileCount > 0)
				throw new HttpException(
					409,
					MSG.MOBILE_IN_USE.replace("%mobile%", userData.mobile)
				);
				console.log('hlo')
			const { cookie, createUserData, tokenData } =
				await this.authService.signup(userData);

			// await Helper.mailStaticTemplates("signup-welcome", createUserData);

			res.setHeader("Set-Cookie", [cookie]);
			res.status(201).json({
				data: {
					user: await Helper.userObj(createUserData),
					token: tokenData,
				},
				message: MSG.SIGNUP_SUCCESS,
			});
		} catch (error) {
			next(error);
		}
	};

	public forgotPassword = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const findUser: User = await this.userService.findUserByEmail(
				req.params.email
			);
			if (!findUser)
				throw new HttpException(
					409,
					MSG.EMAIL_NOT_FOUND.replace("%email%", req.params.email)
				);

			const updateUser: User = await this.userService.resetToken(
				findUser._id
			);
			await Helper.mailStaticTemplates("reset-password", updateUser);

			res.status(200).json({ data: {}, message: MSG.FORGOT_SUCCESS });
		} catch (error) {
			next(error);
		}
	};

 
	public addUser = async (req: RequestWithUser, res: Response, next: NextFunction)=>{
		try{
			const userRole = req.user.role[0].slug
			if(userRole!=='admin')
			throw new HttpException(
				409,
				MSG.NO_DATA)
				const userDetails:CreateUserDto = req.body
				const findUser:User = await this.userService.findUserByEmail(req.body.email)
				if(findUser||userDetails.role[0].slug!=='employee')
					throw new HttpException(
						409,
						MSG.AUTH_WRONG)
				
				const createUser = this.userService.createUser(userDetails)
				res.status(201).json({
					data: {
						user: await Helper.userObj(createUser),
					
					},
					message: MSG.SIGNUP_SUCCESS,
				});
			

			




		}catch{}
	}

	public logIn = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userData: CreateUserDto = req.body;

			const { cookie, findUser, tokenData } =
				await this.authService.login(userData);

			res.setHeader("Set-Cookie", [cookie]);
			res.status(200).json({
				data: {
					user: await Helper.userObj(findUser),
					token: tokenData,
				},
				message: MSG.LOGIN_SUCCESS,
			});
		} catch (error) {
			next(error);
		}
	};

	// public socialLogin = async (
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction
	// ) => {
	// 	try {
	// 		const userData: CreateUserDto = req.body;

	// 		if (!["trainer", "user"].includes(userData.role))
	// 			throw new HttpException(
	// 				400,
	// 				MSG.ROLE_INVALID.replace("%role%", userData.role)
	// 			);

	// 		if (!["apple", "google", "facebook"].includes(userData.social.type))
	// 			throw new HttpException(
	// 				400,
	// 				MSG.SOCIAL_INVALID.replace("%social%", userData.social.type)
	// 			);

	// 		let checkUser: User;
	// 		checkUser =
	// 			userData.email && !isEmpty(userData.email)
	// 				? await this.userService.findUserByEmail(userData.email)
	// 				: await this.userService.findUserBySocial(userData.social);

	// 		// if (checkUser && isEmpty(checkUser.social.type))
	// 		// 	throw new HttpException(409, MSG.SOCIAL_LOGIN_NOT_ALLOWED);

	// 		// if (
	// 		// 	checkUser &&
	// 		// 	!isEmpty(checkUser.social.type) &&
	// 		// 	checkUser.social.type !== userData.social.type
	// 		// )
	// 		// 	throw new HttpException(
	// 		// 		409,
	// 		// 		MSG.SOCIAL_LOGIN_TYPE_WRONG.replace(
	// 		// 			"%social%",
	// 		// 			checkUser.social.type
	// 		// 		)
	// 		// 	);

	// 		const { cookie, findUser, tokenData } =
	// 			await this.authService.socialogin(userData);

	// 		res.setHeader("Set-Cookie", [cookie]);
	// 		res.status(200).json({
	// 			data: {
	// 				user: await Helper.userObj(findUser),
	// 				token: tokenData,
	// 			},
	// 			message: MSG.LOGIN_SUCCESS,
	// 		});
	// 	} catch (error) {
	// 		next(error);
	// 	}
	// };

	public logOut = async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		try {
			const userData: User = req.user;
			const logOutUserData: User = await this.authService.logout(
				userData
			);

			res.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]);
			res.status(200).json({
				data: {
					user: await Helper.userObj(logOutUserData),
				},
				message: MSG.LOGOUT_SUCCESS,
			});
		} catch (error) {
			next(error);
		}
	};
}

export default AuthController;
