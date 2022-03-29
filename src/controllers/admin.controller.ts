import { NextFunction, Request, Response } from "express";
import { CreateUserDto } from "@dtos/users.dto";
import { User } from "@interfaces/users.interface";
import userService from "@services/users.service";
import HttpException from "@exceptions/HttpException";
import { RequestWithUser } from "@/interfaces/auth.interface";
import Helper from "@/utils/helper";
import Mongoose from "mongoose";
import moment from "moment";
import config from "config";
import MSG from "@utils/locale.en.json";
import helper from "@/utils/helper";

class Admincontroller {
  public UserService = new userService();
  // to create Profile of User
  public createUser = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
     req.body.role=[{slug:req.body.role}]
      const userDetails: CreateUserDto = req.body;
      const findUser: User = await this.UserService.findUserByEmail(
        req.body.email
      );
      if (findUser )
        throw new HttpException(409, MSG.USER_EXIST);

      const employeeData = await this.UserService.createUser(userDetails);
      // res.status(201).json({
      //   data: {
      //     user:employeeData,
      //   },
      //   message: MSG.SIGNUP_SUCCESS,
      // });
      
      if (req.body.email && req.body.email.length > 0) {
				let usrObj = {
					email: employeeData.email,
				};
        Helper.mailStaticTemplates("send-activationLink",usrObj)
      }
      res.status(201).json({
				data: { _id: employeeData._id },
				message: MSG.SIGNUP_SUCCESS,
			});
      
  
    } catch(error){
        next(error)
    }
  };
//  To find User 
  public findEmployee= async (req:Request,res:Response,next:NextFunction)=>{
      try{
        let cond = {"role.slug":"employee"}
        const userDetails= this.UserService.findAllUser(cond)
        res.status(200).json({

          message: MSG.SUCCESS,
          data: {
              userDetails,
          },
      });
          
      }catch(error){next(error)}

  }
  // for account activation
  public accountActivation = async (req:Request,res:Response,next:NextFunction)=>{
    try{
      let token = req.params.token
      const findToken = await this.UserService.findUserByResetToken(token)
      if(!findToken)
      throw new HttpException(409, MSG.ACTIVATION_FAILED);
      const _id= (await findToken)._id
      this.UserService.resetToken(_id)
      
    }catch(error){next(error)}
  }
  // controller for push role in User Profile by Admin
  public updateRole = async (req:Request,res:Response,next:NextFunction)=>{
    try{
      const email = req.body.email
      const findEmployee= await this.UserService.findUserByEmail(email)
      if(!findEmployee)
      throw new HttpException(409,MSG.EMAIL_NOT_FOUND)
      let _id = findEmployee._id
      
      console.log(req.body.role)
      // for(let i =0;i<findEmployee.role.length;i++){
      //   let role:String= req.body.role
      //   console.log(role)
      //   console.log(findEmployee.role[i].slug)
      //   if(role===findEmployee.role[i].slug){
      //     return true
      //   }
      
      // }
      
      
      const roleCheck=findEmployee.role.forEach((roleItem)=>{if(req.body.role===roleItem.slug)throw new HttpException(409,MSG.ALREADY_EXIST)})
      req.body.role=[{slug:req.body.role}]
      const updateRole = await this.UserService.pushRole(_id,{role:req.body.role})
      res.send(updateRole)
    }catch(error){next(error)}
  }


  // controller for pull role in User Profile by Admin
  public deleteRole = async (req:Request,res:Response,next:NextFunction)=>{
    try{
      req.body.role=[{slug:req.body.role}]
      const email = req.body.email
      const findEmployee= await this.UserService.findUserByEmail(email)
      if(!findEmployee)
      throw new HttpException(409,MSG.EMAIL_NOT_FOUND)
      let _id = findEmployee._id
      const updateRole= await this.UserService.pullRole(_id,{"role":req.body.role})
      res.send(updateRole)

    }catch(error){next(error)}
  }

}

export default Admincontroller
