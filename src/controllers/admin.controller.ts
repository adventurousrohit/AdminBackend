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
      const userRole= req.user.role[0].slug;
      if (userRole!== "admin") throw new HttpException(409, MSG.NOT_AUTHORIZED);
      const userDetails: CreateUserDto = req.body;
      const findUser: User = await this.UserService.findUserByEmail(
        req.body.email
      );
      if (findUser && userDetails.role[0] !== "employee")
        throw new HttpException(409, MSG.AUTH_WRONG);

      const employeeData = this.UserService.createUser(userDetails);
      res.status(201).json({
        data: {
          user: await Helper.userObj(employeeData),
        },
        message: MSG.SIGNUP_SUCCESS,
      });
    } catch(error){
        next(error)
    }
  };

  public findEmployee= async (req:Request,res:Response,next:NextFunction)=>{
      try{
        const userDetails= this.UserService.findAllUser("employee")
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
