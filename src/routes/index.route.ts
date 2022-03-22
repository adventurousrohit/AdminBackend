import { Router } from "express";
import Route from "@interfaces/routes.interface";
import authMiddleware from "@middlewares/auth.middleware";
import IndexController from "@controllers/index.controller";
class IndexRoute implements Route {
	public path = "/api";
	public router = Router();
	public indexController = new IndexController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, this.indexController.index);
		this.router.get(
			`${this.path}/get-configs/:type`,
			this.indexController.getConfigs
		);
	}
}

export default IndexRoute;
