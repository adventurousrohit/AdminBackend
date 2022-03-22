import config from "config";
import { NextFunction,Request, Response } from "express";
import jwt from "jsonwebtoken";
import HttpException from "@exceptions/HttpException";
import { DataStoredInToken, RequestWithUser } from "@interfaces/auth.interface";
import adminModel from "@models/admins.model";

import MSG from "@utils/web.locale.en.json";
 
const authMiddleware = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const Authorization =
			req.cookies["Authorization"] ||
			req.header("Authorization").split("Bearer ")[1] ||
			null;
        if (Authorization) {
			const secretKey: string = config.get("secretKey");
			const verificationResponse = (await jwt.verify(
				Authorization,
				secretKey
			)) as DataStoredInToken;
			const userId = verificationResponse._id;
            const findUser = await adminModel.findById(userId);
            
            if (findUser) {
                req.user = findUser;
				next();
			} else {
                req.flash("error", MSG.UNAUTHORIZED);
				res.redirect('/login')
			}
		} else {
            req.flash("error", MSG.AUTH_MISSING);
            res.redirect("/login");
		}
	} catch (error) {
        req.flash("error", MSG.AUTH_WRONG);
        res.redirect("/login");
	}
};

export default authMiddleware;
