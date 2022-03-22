import { NextFunction, Request, Response } from "express";
import HttpException from "@exceptions/HttpException";
import { CreateOtpDto } from "@dtos/otps.dto";
import { Otp } from "@interfaces/otps.interface";
import { User } from "@interfaces/users.interface";
import otpService from "@services/otps.service";
import userService from "@services/users.service";
import MSG from "@utils/locale.en.json";
import Helper from "@/utils/helper";
import config from "config";

class OtpsController {
	public otpService = new otpService();
	public userService = new userService();

	public verifyOtp = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const otpData: Otp = req.body;
			const findOneOtpData: Otp = await this.otpService.verifyOtp(
				otpData
			);
			if (!findOneOtpData) throw new HttpException(409, MSG.OTP_EXPIRED);

			const findOneUserData: User =
				await this.userService.findUserByMobile(findOneOtpData.mobile);

			res.status(200).json({
				data: {
					_id: findOneOtpData._id,
					registered: findOneUserData ? true : false,
				},
				message: MSG.OTP_VERIFY_SUCCESS,
			});
		} catch (error) {
			next(error);
		}
	};

	public createOtp = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
            
            if (req.body.signup == true || req.body.signup == "true") {
                if (!req.body.email || !req.body.mobile)
					throw new HttpException(400, MSG.FIELDS_MISSING);

                const emailCount: number =
                    await this.userService.getUserCount(
                        "email",
                        req.body.email,
                        null
                    );
				if (emailCount > 0)
					throw new HttpException(
						409,
						MSG.EMAIL_IN_USE.replace("%email%", req.body.email)
					);

				const mobileCount: number = await this.userService.getUserCount(
					"mobile",
					req.body.mobile,
					null
				);
				if (mobileCount > 0)
					throw new HttpException(
						409,
						MSG.MOBILE_IN_USE.replace("%mobile%", req.body.mobile)
					);
			}
            
            if (!req.body.mobile)
				throw new HttpException(400, MSG.FIELDS_MISSING);

            const otp: number = await Helper.generateOTP();
			req.body.otp = otp;
            const otpData: CreateOtpDto = req.body;
			const createOtpData: Otp = await this.otpService.createOtp(otpData);
            if (req.body.mobile && req.body.mobile.length > 8) {
				let msg = `${otpData.otp} is your ${config.get(
					"siteTitle"
				)} account verification code. You can use this code only once and it will auto expire after 5 minutes if not used.`;
				Helper.sendSMS(otpData.mobile, msg);
			} 
            if (req.body.email && req.body.email.length > 0) {
				let usrObj = {
					email: req.body.email,
					otp: otp,
				};
				Helper.mailStaticTemplates("send-otp", usrObj);
			}
			res.status(201).json({
				data: { _id: createOtpData._id },
				message: MSG.OTP_SENT_SUCCESS,
			});
		} catch (error) {
			next(error);
		}
	};
}

export default OtpsController;
