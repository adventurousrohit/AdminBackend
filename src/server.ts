process.env["NODE_CONFIG_DIR"] = __dirname + "/configs";

import "dotenv/config";
import App from "@/app";

//api routes
import AuthRoute from "@routes/auth.route";
import IndexRoute from "@routes/index.route";
import UsersRoute from "@routes/users.route";
import AjaxRoute from "@routes/ajax.route";
import AdminRoute from "@routes/admin.route";


import validateEnv from "@utils/validateEnv";
validateEnv();

const app = new App([
	//api routes
	new AuthRoute(),
	new IndexRoute(),
	new UsersRoute(),
	new AjaxRoute(),
	new AdminRoute(),

]);

app.listen();
