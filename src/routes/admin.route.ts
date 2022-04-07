import { Router } from "express";
import Route from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import UsersController from "@controllers/users.controller";
import Admincontroller from "@/controllers/admin.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import { CreateUserDto } from "@dtos/users.dto";


class AdminRoute implements Route{

    public path= "/api/admin";
    public router=Router();
    public adminController = new Admincontroller
    // public authMiddleware = new authMiddleware


    constructor(){
        this.intializeRoutes()
        
    }
    // Create user
    private intializeRoutes(){
        this.router.post(
            `${this.path}/create-user`,
            authMiddleware,
            this.adminController.createUser
        );
        // find user by role
        this.router.get(
            `${this.path}/user-details/:role`,
            this.adminController.findEmployee
        
        );

    
      
        //  verifying account
        this.router.get(
			`${this.path}/email/verified/:token`,
			this.adminController.accountActivation
		)

        //  update user role
        this.router.patch(
            `${this.path}/user/update-role/:id`,
            this.adminController.updateRole
        )
       

        // update user profile
        this.router.put(
            `${this.path}/user/update-profile/:id`,
            this.adminController.updateUser

        )

        // delete user profile
        this.router.delete(
            `${this.path}/delete-user/:id`,
            this.adminController.deleteUser
        )
    
        // excel sheet data save
        this.router.get(
			`${this.path}/users/export`,
            this.adminController.savedataInExcel  
		)

        // create Pdf
        this.router.get(
            `${this.path}/users/gererate-docs`,
            this.adminController.createPdf
        )
    }

    
} 

export default AdminRoute