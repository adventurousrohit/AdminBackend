import { Router } from "express";
import Route from "@interfaces/routes.interface";
import authMiddleware from "@middlewares/auth.middleware";
import validationMiddleware from "@middlewares/validation.middleware";
import AuthController from "@controllers/auth.controller";
import { CreateUserDto } from "@dtos/users.dto";
import OtpController from "@controllers/otps.controller"; 

class AuthRoute implements Route {
	public path = "/api/admin";
	public router = Router();
	public authController = new AuthController();
	public otpController = new OtpController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(
			`${this.path}/signup`,
			// validationMiddleware(CreateUserDto, "body"),
			this.authController.signUp
		);
		this.router.post(`${this.path}/login`, this.authController.logIn);
		// this.router.post(
		// 	`${this.path}/login`,
		// 	this.authController.socialLogin
		// );
		this.router.post(
			`${this.path}/employees`,
			authMiddleware,
			this.authController.addUser
		);
		this.router.get(
			`${this.path}/users`

		)
	}
}

export default AuthRoute;
