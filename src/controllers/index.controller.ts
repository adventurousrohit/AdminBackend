import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "@interfaces/auth.interface";
import config from "config";

import MSG from "@utils/locale.en.json";

class IndexController {

	public index = async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.status(200).json({
				message: `${config.get("siteTitle")} ${config.get(
					"env"
				)} REST API End Point is UP`,
			});
		} catch (error) {
			next(error);
		}
	};

	public getConfigs = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			let data = {};
			switch (req.params.type) {
				case "s3":
					Object.assign(data, { s3: await config.get("awsS3") });
					break;
				case "perPageRecord":
					Object.assign(data, {
						perPageRecord: await config.get("recordLimit"),
					});
					break;
				case "stripe":
					Object.assign(data, { stripe: await config.get("stripe") });
					break;
				default:
					break;
			}
			res.status(200).json({
				data: data,
				message: MSG.FETCH_SUCCESS,
			});
		} catch (error) {
			next(error);
		}
	};




}

export default IndexController;
