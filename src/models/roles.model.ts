import { model, Schema, Document, Mongoose } from "mongoose";
import {Roles} from "../interfaces/roles.interface";

 const ROLES = ["admin","employee", "HR","PM","client"]

const roleSchema:Schema = new Schema(
    {
      role:[{
        slug:{
            type:String,
            unique:true, 
        },
        enum:ROLES,
        // permission:true

       
    } ]   
      
        

}
)
const roleModel = model<Roles & Document>("Role", roleSchema);
export default roleModel
