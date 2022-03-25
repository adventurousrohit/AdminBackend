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

class Admincontroller {
  public UserService = new userService();

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
      res.status(201).json({
        data: {
          user:employeeData,
        },
        message: MSG.SIGNUP_SUCCESS,
      });
      // Helper.sendSMS
    } catch(error){
        next(error)
    }
  };

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
}

export default Admincontroller
