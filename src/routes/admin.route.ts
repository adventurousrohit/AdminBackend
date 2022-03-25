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
    private intializeRoutes(){
        this.router.post(
            `${this.path}/createEmployees`,
            this.adminController.createUser
        );
        this.router.get(
            `${this.path}/employee/details`,
            this.adminController.findEmployee
        );
        this.router.get(
            `${this.path}/`

        )
    }

    
} 

export default AdminRoute