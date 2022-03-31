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
import exceljs from "exceljs"
import "lodash"
import _ from "lodash";

class Admincontroller {
  public UserService = new userService();
  // to create Profile of User
  public createUser = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {

      req.body.role = [{ slug: req.body.role }]
      const userDetails: CreateUserDto = req.body;
      const findUser: User = await this.UserService.findUserByEmail(
        req.body.email
      );
      if (findUser)
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
          token: employeeData.token
        };
        Helper.mailStaticTemplates("send-activationLink", usrObj)
      }
      res.status(201).json({
        data: { _id: employeeData._id },
        message: MSG.SIGNUP_SUCCESS,
      });


    } catch (error) {
      next(error)
    }
  };
  //  To find User 
  public findEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // let cond = { "role.slug": "employee" }
      const userRole= req.params.role
      console.log(userRole,"role")
      
      const userDetails = await this.UserService.findUserByRole(userRole)
      // console.log(userDetails)
      res.status(200).json({

        message: MSG.SUCCESS,
        data: {
          userDetails,
        },
      });

    } catch (error) { next(error) }

  }
  // for account activation
  public accountActivation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.params.token
      console.log(token, "hi")
      const findToken = await this.UserService.findUserByResetToken(token)
      if (!findToken)
        throw new HttpException(409, MSG.ACTIVATION_FAILED);
      const _id = (await findToken)._id
      const resetToken = this.UserService.resetToken(_id)
      if (resetToken)
        throw new HttpException(409, MSG.AUTH_SUCCES.replace("%email%", findToken.email));


    } catch (error) { next(error) }
  }


  // controller for push role in User Profile by Admin
  public updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = req.body.type
      if (type == "push") {
        const email = req.params.email
        // console.log(email)
        const findEmployee = await this.UserService.findUserByEmail(email)
        if (!findEmployee)
          throw new HttpException(409, MSG.EMAIL_NOT_FOUND)
        let _id = findEmployee._id

        console.log(req.body.role)
        const role = req.body.role
        const index = _.findIndex(findEmployee.role, ["slug", role])
        console.log(index)
        if (index >= 0) {
          throw new HttpException(409, MSG.ALREADY_EXIST)
        } else {
          req.body.role = [{ slug: req.body.role }]
          const updateRole = await this.UserService.pushRole(_id, { role: req.body.role })
          res.send(updateRole)
        }
      }
      else if(type=="pull") {
        const email = req.params.email
        const findEmployee = await this.UserService.findUserByEmail(email)
        if (!findEmployee)
          throw new HttpException(409, MSG.EMAIL_NOT_FOUND)
        const role = req.body.role
        const index = _.findIndex(findEmployee.role, ["slug", role])
        if (index >= 0) {
          const deleteRole = await this.UserService.pullRole(findEmployee._id, role)
          res.send(deleteRole)
        }
        else {
          throw new HttpException(409, MSG.ALREADY_EXIST)

        }
      }

    } catch (error) { next(error) }
  }

  public updateUser = async (req:Request,res:Response,next:NextFunction)=>{
    try{
      const _id = req.params.id
      const findUser= this.UserService.findUserById(_id)
      if(!findUser)
      throw new HttpException(409, MSG.USER_MISSING)
      const updateDetails = req.body
      const updateUser =  await this.UserService.updateUser(_id,updateDetails)
      // console.log(updateUser)
      res.send(updateUser)
    }catch(error){next(error)}
  
  }

  public deleteUser = async (req:Request,res:Response,next:NextFunction)=>{
    try{
      console.log('hlo')
      const _id = req.params.id
      console.log(_id,"id")
      const findUser= this.UserService.findUserById(_id)
      if(!findUser)
      throw new HttpException(409, MSG.USER_MISSING)
      const deleteUser = await this.UserService.deleteUser(_id)
      res.send(new HttpException(201,MSG.DELETED.replace("%name%",(await findUser).name)))


    }catch(error){next(error)}
  }

  // public test = async ()=>{
  //   console.log("yes")

  // }
  public savedataInExcel = async (req:Request,res:Response,next:NextFunction)=>{
    try{
      console.log("hlo")
      const userRole =req.params.role
      console.log(userRole,"userRole")
      const userDetails = await this.UserService.findUserByRole(userRole)
      const workbook= new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('My Users')
      worksheet.columns=[
        // {header:"S.no",key:"s.no",width:10},
        {header:"Name",key:"name",width:10},
        {header:"Email",key:"email",width:10},
        {header:"mobile",key:"mobile",width:10},
        {header:"role",key:"role",width:10},
        {header:"status",key:"status",width:10},
        {header:"isDeleted",key:"isDeleted",width:10},
        {header:"emailVarification",key:"emailVarification",width:10},
        {header:"mobileVarification",key:"mobileVarification",width:10},
        {header:"token",key:"token",width:10},
      ]

      let count =1 
      userDetails.forEach(user=>{
        (user as any).s_no=count
        worksheet.addRow(user)
        count +=1
      })
      worksheet.getRow(1).eachCell((cell)=>{
        cell.font={bold:true}
      })
    const date = await workbook.xlsx.writeFile("users.xlsx")
    res.send("file saved")

    }catch(error){next(error)}
  }


}
  // class end




export default Admincontroller
