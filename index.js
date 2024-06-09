const express = require("express");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
require("dotenv").config();

const port = process.env.PORT;

const app = express();

database.connect();

//App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));

// Flash
app.use(cookieParser("abcxyz"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash

//Routes
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
