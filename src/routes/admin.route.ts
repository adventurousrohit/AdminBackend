import { Router } from "express";
import Route from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import UsersController from "@controllers/users.controller";
import Admincontroller from "@/controllers/admin.controller";
import { CreateUserDto } from "@dtos/users.dto";


class AdminRoute implements Route{

    public path= "/api/admin";
    public router=Router();
    // public usersController = new UsersController()
    public adminController = new Admincontroller


    constructor(){
        this.intializeRoutes()
        
    }
    // Create user
    private intializeRoutes(){
        this.router.post(
            `${this.path}/create-user`,
            this.adminController.createUser
        );
        // find user by role
        this.router.get(
            `${this.path}/user-details/:role`,
            // ()=>{console.log('helo')},
            this.adminController.findEmployee
        );
        // this.router.get(
        //     `${this.path}/users/{email}`

        // )

        //  verifying account
        this.router.get(
			`${this.path}/email/verified/:token`,
            // ()=>{console.log("token")},
			this.adminController.accountActivation
		)

        


        //  update user role
        this.router.patch(
            `${this.path}/user/update-role/:email`,
            this.adminController.updateRole
        )
        // this.router.put(
        //     `${this.path}/user/remove/role`,
        //     this.adminController.deleteRole
        // )


        // update user profile
        this.router.put(
            `${this.path}/user/update-profile/:id`,
            this.adminController.updateUser

        )

        // delete user profile
        this.router.delete(
            `${this.path}/delete-user/:id`,
            // ()=>{console.log("delete")},
            this.adminController.deleteUser
        )
    
        this.router.get(
			`${this.path}/users/export/:role`,
            // ()=>{console.log("token")},
            this.adminController.savedataInExcel
            
           
		)
    }

    
} 

export default AdminRoute