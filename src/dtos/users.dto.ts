import config from "config";
import {
	IsEmail,
	IsString,
	IsNotEmpty,
	IsObject,
	IsOptional,
	Contains,
	IsNumber,
	IsArray,
	IsMongoId,
} from "class-validator";

export class CreateUserDto {
	// @IsNotEmpty()
	// public firstName: string;

	@IsNotEmpty()
	public name: string;

	@IsNotEmpty()
	@IsArray()
	@IsString()
	public role:Array<{slug:String}>;
	
	// @IsOptional()
	// @IsObject()
	// public social: {
	// 	type: string;
	// 	token: string;
	// };

	// @IsNotEmpty()
	// @IsString()
	// public slug:string

	@IsEmail()
	public email: string;

	@IsNotEmpty()
	public mobile: string;

	@IsNotEmpty()
	public password: string;

	// @IsOptional()
	// @IsString()
	// public gender: string;

	// @IsOptional()
	// @IsNumber()
	// public dob: string;

	// @IsOptional()
	// @IsString()
	// @Contains(config.get("env"))
	// public profileImage: string;

   
    // @IsOptional()
	// @IsString()
	// public address: string;


	// @IsOptional()
	// @IsObject()
	// public device: {
	// 	id: string;
	// 	token: string;
	// };

	// @IsOptional()
	// @IsObject()
	// public social: {
	// 	type: string;
	// 	token: string;
	// };

	// @IsOptional()
	// public resetToken: string;
}
