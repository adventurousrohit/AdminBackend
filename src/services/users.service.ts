import bcrypt from "bcryptjs";
import { CreateUserDto } from "@dtos/users.dto";
import HttpException from "@exceptions/HttpException";
import { User } from "@interfaces/users.interface";
import userModel from "@models/users.model";
import { isEmpty } from "@utils/util";

import Helper from "@/utils/helper";
import MSG from "@utils/locale.en.json";
import Mongoose from "mongoose";

class UserService {

	public users = userModel;

	public async findAllUser(filter: any): Promise<User[]> {
		let cond: any = {
			status: true,
			isDeleted: false,
		};
		if (filter && !isEmpty(filter)) Object.assign(cond, filter);

		let project: any = {
			name: 1,
			role: 1,
			email: 1,
			gender: 1,
			mobile: 1,
			status: 1,
			dob: { $dateToString: { format: "%Y-%m-%d", date: "$dob" } },
			profileImage: 1,
			createdAt: 1,
		};
		const users: User[] = await this.users.aggregate([
			{
				$match: cond,
			},
			{
				$project: project,
			},
			{
				$sort: { createdAt: -1 },
			},
		]);
		return users;
	}

	public async getUserCount(
		type: string,
		value: string,
		filter: any
	): Promise<number> { 
		let cond: any = {
			isDeleted: false,
		};
		switch (type) {
			case "email":
				Object.assign(cond, { email: value });
				break;
			case "mobile":
				Object.assign(cond, { mobile: value });
				break;
			case "role":
				Object.assign(cond, { role: value });
				break;
			case "resetToken":
				Object.assign(cond, { resetToken: value });
				break;
			case "_id":
				Object.assign(cond, { _id: value });
				break;
			case "goals":
				Object.assign(cond, { goals: value });
				break;
			case "categories":
				Object.assign(cond, { categories: value });
				break;
			default:
				break;
		}
		if (filter && !isEmpty(filter)) Object.assign(cond, filter);
		const count: number = await this.users.countDocuments(cond);
		return count;
	}



	public async findUserByMobile(userMobile: string): Promise<User> {
		if (isEmpty(userMobile))
			throw new HttpException(400, MSG.FIELDS_MISSING);
		const findUser: User = await this.users.findOne({
			mobile: userMobile,
			isDeleted: false,
		});
		return findUser;
	}


	public async findUserByEmail(userEmail: string): Promise<User> {
		if (isEmpty(userEmail))
			throw new HttpException(400, MSG.FIELDS_MISSING);
		const findUser: User = await this.users.findOne({
			email: userEmail,
			isDeleted: false,
		});
		return findUser;
	}

	public async findUserByRole(userRole:Object): Promise<User> {
		
		if (isEmpty(userRole))
			throw new HttpException(400, MSG.FIELDS_MISSING);
			console.log('find')
		const findUser: User = await this.users.findOne({
			role: userRole,
			isDeleted: false,
		},(error,result)=>{
			if(error){console.log(error)}
		});
		
		return findUser;
	}

	public async findUserByResetToken(resetToken: string): Promise<User> {
		if (isEmpty(resetToken))
			throw new HttpException(400, MSG.FIELDS_MISSING);
		const findUser: User = await this.users.findOne({
			resetToken: resetToken,
			isDeleted: false,
		});
		return findUser;
	}

	public async findUserBySocial(social: any): Promise<User> {
		if (isEmpty(social.type) || isEmpty(social.token))
			throw new HttpException(400, MSG.FIELDS_MISSING);
		const findUser: User = await this.users.findOne({
			"social.type": social.type,
			"social.token": social.token,
			isDeleted: false,
		});
		return findUser;
	}

	public async createUser(userData: CreateUserDto): Promise<User> {
		if (isEmpty(userData)) throw new HttpException(400, MSG.FIELDS_MISSING);

		const findUser: User = await this.users.findOne({
			email: userData.email,
		});
		if (findUser)
			throw new HttpException(
				409,
				MSG.EMAIL_IN_USE.replace("%email%", userData.email)
			);
			

		const hashedPassword = await bcrypt.hash(userData.password, 10);
		console.log(hashedPassword)
		const createUserData: User = await this.users.create({
			...userData,
			password: hashedPassword,
		});

		console.log(createUserData)
		return createUserData;
	}

	public async updateUser(
		userId: any,
		userData: any
	): Promise<User> {
		if (isEmpty(userData)) throw new HttpException(400, MSG.FIELDS_MISSING);
		delete userData.role;
		//trainer category selection validation
		
		if (userData.email && userData.email.length > 0) {
			const findUser: User = await this.findUserByEmail(userData.email);
			if (findUser && findUser._id != userId)
				throw new HttpException(
					409,
					MSG.EMAIL_IN_USE.replace("%email%", userData.email)
				);
		}
		if (userData.mobile && userData.mobile.length > 0) {
			const findUser: User = await this.findUserByMobile(userData.mobile);
			if (findUser && findUser._id != userId)
				throw new HttpException(
					409,
					MSG.MOBILE_IN_USE.replace("%mobile%", userData.mobile)
				);
		}

		if (userData.password && userData.password.length > 0) {
			const hashedPassword = await bcrypt.hash(userData.password, 10);
			userData = { ...userData, password: hashedPassword };
		}
		const updateUserById: User = await this.users.findByIdAndUpdate(
			userId,
			{ ...userData },
			{ new: true }
		);
		if (!updateUserById) throw new HttpException(409, MSG.NO_DATA);
		return updateUserById;
	}

	public async resetToken(userId: string): Promise<User> {
		const resetToken: string = await Helper.generateHash();
		const updateUserById: User = await this.users.findByIdAndUpdate(
			userId,
			{ resetToken: resetToken },
			{ new: true }
		);
		if (!updateUserById) throw new HttpException(409, MSG.NO_DATA);
		return updateUserById;
	}

	public async deleteUser(userId: string): Promise<User> {
		const deleteUserById: User = await this.users.findByIdAndDelete(userId);
		if (!deleteUserById) throw new HttpException(409, MSG.NO_DATA);
		return deleteUserById;
	}

    public async favourite(loginId: string, userId: string, action: string): Promise<User>{
        let update: any = {
			$pull: { favourites: userId },
		};
        if(action == 'add'){
            update = {
                $push: {favourites: userId },
            };
        }
        const updateUserById: User = await this.users.findByIdAndUpdate(
			loginId,
			update,
			{ new: true }
		);
		if (!updateUserById) throw new HttpException(409, MSG.NO_DATA);
		return updateUserById;
    }

}

export default UserService;
