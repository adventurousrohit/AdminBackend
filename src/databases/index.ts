import config from "config";
import { dbConfig } from "@interfaces/db.interface";

const { host, port, database, username, password }: dbConfig = config.get("dbConfig");

export const dbConnection = {
	//url: `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`,
	url: `mongodb://localhost:27017/tf-dev`,
	// url:"mongodb+srv://studentregistrtion:Rohit12345@cluster0.r1buw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	},
};
 