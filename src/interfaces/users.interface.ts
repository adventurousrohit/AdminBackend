export interface User {
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
export type Withoutid = Omit<User,"  _id: string">;
