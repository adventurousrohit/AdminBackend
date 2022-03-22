import { model, Schema, Document, Mongoose } from "mongoose";
import {Roles} from "../interfaces/roles.interface";

 const ROLES = ["admin","employee", "HR","PM","client"]

const roleSchema:Schema = new Schema(
    {
        slug:{
            type:String,
            enum:ROLES
        },
        permission:[
            {

            }
        ]

}
)
const roleModel = model<Role & Document>("Role", roleSchema);
export default roleModel
