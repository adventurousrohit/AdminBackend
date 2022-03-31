import { Document } from "mongoose";
export interface User {
//   forEach(arg0: (user: any) => void);
    _id: string;
    // firstName: string;
    // lastName: string;
	name:string;
	role:Array<{slug:String;}>;
	
	email: string;
	mobile: string;
	password: string;
	// profileImage: string;
	status: boolean;
	mobileVarification:boolean;
	emailVarification:boolean;
	token:string

    
}
export interface UpdateWriteOpResult {
    result: { ok: number; n: number; nModified: number };
    connection: any;
    matchedCount: number;
    modifiedCount: number;
    upsertedCount: number;
   
}
