import { model, Schema, Document } from "mongoose";
import { User } from "@interfaces/users.interface";
// import Role from '@models/roles.model'

const ROLES = ["admin", "employee", "HR", "PM", "client"];

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: [
      {
        
        slug: {
          type: String,
          enum: ROLES,
        },
      
      },
    ],
    // role:{
    //   type:Schema.Types.ObjectId,
    //   ref:"Role",
    //   required:true
    // },

    status: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.virtual('name')
// .get(function () { return `${this.firstName} ${this.lastName}`; })
// .set(function (v) {
//     const firstName = v.substring(0, v.indexOf(' '));
//     const lastName = v.substring(v.indexOf(' ') + 1);
//     this.set({ firstName, lastName });
// });

userSchema.index({ location: "2dsphere" });
userSchema.index({ name: "text" });
const userModel = model<User & Document>("User", userSchema);

export default userModel;
