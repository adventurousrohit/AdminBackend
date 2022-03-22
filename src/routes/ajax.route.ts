import config from "config";
import { Router } from "express";
import Route from "@interfaces/routes.interface";
import AjaxController from "@controllers/ajax.controller";


class AjaxRoute implements Route {
	public path = "/ajax";
	public router = Router();
	public ajaxController = new AjaxController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(
			`${this.path}/upload`,
			this.ajaxController.upload
		);

        this.router.get(
			`${this.path}/presigned-url`,
			this.ajaxController.presigned
		);

		this.router.get(
			`${this.path}/delete-object`,
			this.ajaxController.deleteObject
		)
	}

    
}

export default AjaxRoute;
