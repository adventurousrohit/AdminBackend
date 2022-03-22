import { Router } from "express";
import Route from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import UsersController from "@controllers/users.controller";
import { CreateUserDto } from "@dtos/users.dto";
import authMiddleware from "@middlewares/auth.middleware";

class UsersRoute implements Route {
	public path = "/api/users";
	public router = Router();
	public usersController = new UsersController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
        
	}
}

export default UsersRoute;
