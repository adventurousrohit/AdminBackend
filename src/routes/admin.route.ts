import { Router } from "express";
import Route from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import UsersController from "@controllers/users.controller";
import { CreateUserDto } from "@dtos/users.dto";


class AdminRoute implements Route{
    
} 