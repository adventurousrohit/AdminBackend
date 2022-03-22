import config from "config";
import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "@interfaces/auth.interface";
import MSG from "@utils/locale.en.json";
import Helper from "@/utils/helper";
import userService from "@services/users.service";
import path from "path";
import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
const serviceConfigOptions: ServiceConfigurationOptions = {
	region: config.get("awsS3.bucketRegion"),
	endpoint: new aws.Endpoint(config.get("awsS3.secretEntPoint")),
	accessKeyId: config.get("awsS3.accessKeyId"),
	secretAccessKey: config.get("awsS3.secretAccessKey"),
	signatureVersion: "v4",
};
const s3 = new aws.S3(serviceConfigOptions);

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: config.get("awsS3.bucketName"),
		contentType: multerS3.AUTO_CONTENT_TYPE,
		//acl: "public-read",
		cacheControl: "max-age=31536000",
		metadata: function (req, file, cb) {
			cb(null, Object.assign({}, req.body));
		},
		key: function (req, file, cb) {
			const prefix: string = config.get("awsS3.prefix");
			let fileName="";
			if(req.body.fileExists && req.body.fileExists.length > 0 ) {
				fileName =
					prefix +
					req.body.folder+"/"+
					req.body.fileExists;
				req.fileName = fileName;
			} else {
				fileName =
					prefix +
					req.body.folder+"/"+
					Date.now() +
					path.extname(file.originalname);
					req.fileName = fileName;
			}
            
            cb(null, fileName);
		},
	}),
}).single('file');

class AjaxController {
	public userService = new userService();
	public upload = async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		try {
			upload(req, res, function (error) {
				if (error) {
					next(error);
				} else {
					res.status(200).json({
						message: MSG.SUCCESS,
						data: {
							fileName: req.fileName,
						},
					});
				}
			});
		} catch (error) {
			next(error);
		}
	};

	public presigned = async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		try {
			const prefix: string = config.get("awsS3.prefix");
			
			const url = await Helper.getSignedUrlAWS(req.query.fileName);
			res.status(200).json({

                message: MSG.SUCCESS,
                data: {
                    url,
                },
            });
		} catch (error) {
			next(error);
		}
	};

	public deleteObject = async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		try{
			const prefix: string = config.get("awsS3.prefix");
			const file = prefix+req.query.fileName;
			console.log('this is file', file)
			const result = await Helper.deleteObjectAWS(file);
			const data = req.query.model;
			console.log('this is req. qury', req.query);
			// const subModel = req.query.subModel;
			switch(data) {
				case "user":
					const updateData = await this.userService.updateUser(
						req.query.id,
						{ profileImage: "" }
					);

				res.status(200).json({
					message: MSG.SUCCESS,
				});

			}
			// const updateData = await this[data][subModel](
			// 	req.query.id,
			// 	{ profileImage: "" }
			// );
			res.status(200).json({
                message: MSG.SUCCESS,
            });
		}catch(error) {
			next(error);
		}
	}
}

export default AjaxController;
